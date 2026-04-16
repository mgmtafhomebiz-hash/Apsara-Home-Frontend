'use client'

import { Button } from '@heroui/react'
import { motion } from "framer-motion"
import MembersToolbar from "./MembersToolbar"
import MembersStats from "./MembersStats"
import type { MembersStatCardKey } from "./MembersStats"
import MembersTable from "./MembersTable"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Member, MemberStatus, MemberTier } from "@/types/members/types"
import AddMemberModal from "./AddMemberModal"
import {
    MembersMeta,
    MembersResponse,
    MembersStatsResponse,
    useGetMembersQuery,
    useGetMembersStatsQuery,
    useLazyGetMemberStatDetailsQuery,
    useLazyGetMembersQuery,
} from "@/store/api/membersApi"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface MembersPageMainProps {
    initialData?: MembersResponse | null
    initialStats?: MembersStatsResponse | null
}

function SkeletonTable() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <div className="h-4 w-28 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800/60" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800/60" />
                            <div className="h-2.5 w-20 rounded bg-slate-100 dark:bg-slate-800/60" />
                        </div>
                        <div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800/60" />
                        <div className="h-7 w-16 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
                    </div>
                ))}
            </div>
        </div>
    )
}

const csvEscape = (value: unknown) => {
    const text = String(value ?? '')
    if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`
    }
    return text
}

type ModalMember = Member & { metricValue?: string }

const modalDescriptions: Record<MembersStatCardKey, { intro: string; emptyTitle: string; emptyDescription: string }> = {
    total_members: {
        intro: 'Live member records loaded directly from the database.',
        emptyTitle: 'No members found.',
        emptyDescription: 'No member records were returned from the database.',
    },
    active: {
        intro: 'Live active-member records loaded directly from the database.',
        emptyTitle: 'No active members found.',
        emptyDescription: 'There are no active-member records to show right now.',
    },
    pending: {
        intro: 'Live pending and KYC-related member records loaded directly from the database.',
        emptyTitle: 'No pending or KYC members found.',
        emptyDescription: 'There are no pending or KYC-review records to show right now.',
    },
    blocked: {
        intro: 'Live blocked-member records loaded directly from the database.',
        emptyTitle: 'No blocked members found.',
        emptyDescription: 'There are no blocked-member records to show right now.',
    },
    new_members: {
        intro: 'Live recent registrations from the last 7 days, loaded directly from the database.',
        emptyTitle: 'No recent members found.',
        emptyDescription: 'There are no recent registration records to show right now.',
    },
    total_spent: {
        intro: 'These are the actual members contributing to Total Spent, ranked from the database.',
        emptyTitle: 'No spending records found.',
        emptyDescription: 'No members with recorded spending were returned from the database.',
    },
    total_earnings: {
        intro: 'These are the actual members contributing to Total Earnings, ranked from the database.',
        emptyTitle: 'No earnings records found.',
        emptyDescription: 'No members with recorded earnings were returned from the database.',
    },
    total_referrals: {
        intro: 'These are the actual members contributing to Total Referrals, ranked from the database.',
        emptyTitle: 'No referral records found.',
        emptyDescription: 'No members with referral counts were returned from the database.',
    },
}

const MembersPageMain = ({ initialData = null, initialStats = null }: MembersPageMainProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [status, setStatus] = useState<'all' | MemberStatus>('all')
    const [tier, setTier] = useState<'all' | MemberTier>('all')
    const [registration, setRegistration] = useState<'all' | 'new' | 'referred' | 'direct'>('all')
    const [profilePhoto, setProfilePhoto] = useState<'all' | 'with_photo' | 'no_photo'>('all')
    const [sort, setSort] = useState<'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low'>('default')
    const [showModal, setShowModal] = useState(false)
    const [selectedStatCard, setSelectedStatCard] = useState<MembersStatCardKey | null>(null)
    const [statModalMembers, setStatModalMembers] = useState<ModalMember[]>([])
    const [statModalMeta, setStatModalMeta] = useState<MembersMeta | null>(null)
    const [statModalTitle, setStatModalTitle] = useState('Member Details')
    const [statModalMetricLabel, setStatModalMetricLabel] = useState('Metric')
    const [statModalError, setStatModalError] = useState<string | null>(null)
    const [isStatModalLoading, setIsStatModalLoading] = useState(false)
    const [isStatModalLoadingMore, setIsStatModalLoadingMore] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [page, setPage] = useState(1)
    const [stableData, setStableData] = useState<MembersResponse | null>(initialData)
    const [stableStats, setStableStats] = useState<MembersStatsResponse | null>(initialStats)
    const perPage = 7
    const statPageSize = 30
    const urlSearch = (searchParams.get('q') ?? '').trim()

    useEffect(() => {
        const modal = (searchParams.get('modal') ?? '').toLowerCase()
        if (modal === 'add-member') {
            setShowModal(true)
        }
    }, [searchParams])

    useEffect(() => {
        setSearch(urlSearch)
        setPage(1)
    }, [urlSearch])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim())
        }, 300)

        return () => clearTimeout(timeout)
    }, [search])

    const isUsingDefaultView =
        page === 1 &&
        debouncedSearch === '' &&
        status === 'all' &&
        tier === 'all' &&
        registration === 'all' &&
        profilePhoto === 'all'

    const shouldSkipInitialMembersRefetch = Boolean(initialData && isUsingDefaultView)

    const { data: statsData } = useGetMembersStatsQuery(undefined, {
        skip: Boolean(initialStats),
    })
    const [triggerExportMembers] = useLazyGetMembersQuery()
    const [triggerStatDetails] = useLazyGetMemberStatDetailsQuery()

    const { data, isLoading, isFetching, isError } = useGetMembersQuery(
        {
            page,
            perPage,
            search: debouncedSearch !== '' ? debouncedSearch : undefined,
            status: status === 'all' ? undefined : status,
            tier: tier === 'all' ? undefined : tier,
            registration: registration === 'all' ? undefined : registration,
            profilePhoto: profilePhoto === 'all' ? undefined : profilePhoto,
            sort,
        },
        {
            skip: shouldSkipInitialMembersRefetch,
        }
    )

    useEffect(() => {
        if (data) {
            setStableData(data)
        }
    }, [data])

    useEffect(() => {
        if (statsData) {
            setStableStats(statsData)
        }
    }, [statsData])

    const effectiveData = data ?? stableData ?? initialData ?? null
    const effectiveStats = statsData ?? stableStats ?? initialStats ?? null
    const members = useMemo(() => effectiveData?.members ?? [], [effectiveData])
    const sortedMembers = useMemo(() => {
        const list = [...members]
        if (sort === 'earnings_low_high') {
            return list.sort((a, b) => (a.earnings ?? 0) - (b.earnings ?? 0))
        }
        if (sort === 'earnings_high_low') {
            return list.sort((a, b) => (b.earnings ?? 0) - (a.earnings ?? 0))
        }
        if (sort === 'referrals_high_low') {
            return list.sort((a, b) => (b.referrals ?? 0) - (a.referrals ?? 0))
        }
        if (sort === 'newest_registered') {
            return list.sort((a, b) => (Date.parse(b.joinedAt || '') || 0) - (Date.parse(a.joinedAt || '') || 0))
        }
        if (sort === 'oldest_registered') {
            return list.sort((a, b) => (Date.parse(a.joinedAt || '') || 0) - (Date.parse(b.joinedAt || '') || 0))
        }
        return list
    }, [members, sort])
    const meta = effectiveData?.meta

    const loadStatPage = useCallback(async (stat: MembersStatCardKey, nextPage: number, append: boolean) => {
        try {
            if (append) {
                setIsStatModalLoadingMore(true)
            } else {
                setIsStatModalLoading(true)
                setStatModalError(null)
            }

            const response = await triggerStatDetails({
                stat,
                page: nextPage,
                perPage: statPageSize,
            }).unwrap()

            setStatModalTitle(response.title)
            setStatModalMetricLabel(response.metricLabel)
            setStatModalMeta(response.meta)
            setStatModalMembers((prev) => append ? [...prev, ...response.members] : response.members)
        } catch (error) {
            console.error('Failed to load member stat details', error)
            setStatModalError('Failed to load live member records for this stat.')
            if (!append) {
                setStatModalMembers([])
                setStatModalMeta(null)
            }
        } finally {
            setIsStatModalLoading(false)
            setIsStatModalLoadingMore(false)
        }
    }, [triggerStatDetails])

    useEffect(() => {
        if (!selectedStatCard) {
            setStatModalMembers([])
            setStatModalMeta(null)
            setStatModalError(null)
            return
        }

        setStatModalMembers([])
        setStatModalMeta(null)
        setStatModalError(null)
        loadStatPage(selectedStatCard, 1, false)
    }, [loadStatPage, selectedStatCard])

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    const handleStatus = (value: 'all' | MemberStatus) => {
        setStatus(value)
        setPage(1)
    }

    const handleTier = (value: 'all' | MemberTier) => {
        setTier(value)
        setPage(1)
    }

    const handleRegistration = (value: 'all' | 'new' | 'referred' | 'direct') => {
        setRegistration(value)
        setPage(1)
    }

    const handleProfilePhoto = (value: 'all' | 'with_photo' | 'no_photo') => {
        setProfilePhoto(value)
        setPage(1)
    }

    const handleSort = (value: 'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low') => {
        setSort(value)
        setPage(1)
    }

    const handleExport = async () => {
        if (isExporting) return

        try {
            setIsExporting(true)
            const exportPerPage = 100
            const firstPage = await triggerExportMembers({
                page: 1,
                perPage: exportPerPage,
                search: debouncedSearch !== '' ? debouncedSearch : undefined,
                status: status === 'all' ? undefined : status,
                tier: tier === 'all' ? undefined : tier,
                registration: registration === 'all' ? undefined : registration,
                profilePhoto: profilePhoto === 'all' ? undefined : profilePhoto,
                sort,
            }).unwrap()

            const exportRows = [...(firstPage.members ?? [])]
            const lastPage = Math.max(firstPage.meta?.last_page ?? 1, 1)

            for (let nextPage = 2; nextPage <= lastPage; nextPage += 1) {
                const pageResponse = await triggerExportMembers({
                    page: nextPage,
                    perPage: exportPerPage,
                    search: debouncedSearch !== '' ? debouncedSearch : undefined,
                    status: status === 'all' ? undefined : status,
                    tier: tier === 'all' ? undefined : tier,
                    registration: registration === 'all' ? undefined : registration,
                    profilePhoto: profilePhoto === 'all' ? undefined : profilePhoto,
                    sort,
                }).unwrap()

                exportRows.push(...(pageResponse.members ?? []))
            }

            if (sort === 'earnings_low_high') {
                exportRows.sort((a, b) => (a.earnings ?? 0) - (b.earnings ?? 0))
            } else if (sort === 'earnings_high_low') {
                exportRows.sort((a, b) => (b.earnings ?? 0) - (a.earnings ?? 0))
            } else if (sort === 'referrals_high_low') {
                exportRows.sort((a, b) => (b.referrals ?? 0) - (a.referrals ?? 0))
            } else if (sort === 'newest_registered') {
                exportRows.sort((a, b) => (Date.parse(b.joinedAt || '') || 0) - (Date.parse(a.joinedAt || '') || 0))
            } else if (sort === 'oldest_registered') {
                exportRows.sort((a, b) => (Date.parse(a.joinedAt || '') || 0) - (Date.parse(b.joinedAt || '') || 0))
            }

            const headers = [
                'Member ID',
                'Name',
                'Email',
                'Status',
                'Verification Status',
                'Tier',
                'Orders',
                'Total Spent',
                'Earnings',
                'Wallet Cash Credits',
                'Wallet PV Credits',
                'Referrals',
                'Joined',
                'Address',
                'Barangay',
                'City',
                'Province',
                'Region',
                'Zip Code',
                'Full Address',
            ]

            const rows = exportRows.map((member) => [
                member.id,
                member.name,
                member.email,
                member.status,
                member.verificationStatus ?? '',
                member.tier,
                member.orders,
                member.totalSpent,
                member.earnings,
                Number(member.walletCashCredits ?? 0),
                Number(member.walletPvCredits ?? 0),
                member.referrals,
                member.joinedAt,
                member.addressLine ?? '',
                member.barangay ?? '',
                member.city ?? '',
                member.province ?? '',
                member.region ?? '',
                member.zipCode ?? '',
                member.fullAddress ?? '',
            ])

            const csv = [headers, ...rows]
                .map((row) => row.map(csvEscape).join(','))
                .join('\n')

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const now = new Date()
            const pad = (value: number) => String(value).padStart(2, '0')
            const filename = `members-export-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.csv`
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(url)
        } finally {
            setIsExporting(false)
        }
    }

    const selectedStatMeta = selectedStatCard ? modalDescriptions[selectedStatCard] : null
    const canLoadMoreStatMembers = Boolean(
        selectedStatCard &&
        statModalMeta &&
        statModalMeta.current_page < statModalMeta.last_page
    )

    return (
        <div className="space-y-5">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between gap-4"
            >
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Members</h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-300">Manage member profiles, tiers and activities</p>
                </div>
                <Button
                    onPress={() => setShowModal(true)}
                    className="shrink-0 rounded-xl bg-teal-600 text-white transition hover:bg-teal-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Add Member</span>
                </Button>
            </motion.div>

            <MembersStats
                stats={effectiveStats ?? undefined}
                onCardClick={setSelectedStatCard}
            />

            <MembersToolbar
                search={search}
                onSearch={handleSearch}
                status={status}
                onStatus={handleStatus}
                tier={tier}
                onTier={handleTier}
                registration={registration}
                onRegistration={handleRegistration}
                profilePhoto={profilePhoto}
                onProfilePhoto={handleProfilePhoto}
                sort={sort}
                onSort={handleSort}
                resultCount={meta?.total ?? members.length}
                onExport={handleExport}
                isExporting={isExporting}
            />

            {isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    Failed to load members list from customer data.
                </div>
            ) : isLoading && !effectiveData ? (
                <SkeletonTable />
            ) : (
                <div className="space-y-2">
                    {isFetching && <div className="google-loading-bar" />}
                    <MembersTable
                        rows={sortedMembers}
                        currentPage={meta?.current_page ?? 1}
                        totalPages={meta?.last_page ?? 1}
                        totalRecords={meta?.total ?? members.length}
                        from={meta?.from ?? null}
                        to={meta?.to ?? null}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <AddMemberModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    if ((searchParams.get('modal') ?? '').toLowerCase() === 'add-member') {
                        router.replace(pathname)
                    }
                }}
                onSubmit={(data) => {
                    console.log('New member data: ', data)
                }}
            />

            {selectedStatCard && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/55"
                        onClick={() => setSelectedStatCard(null)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                            <div>
                                <h2 className="text-base font-bold text-slate-800">{statModalTitle}</h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {selectedStatMeta?.intro ?? 'Live records loaded from the database.'}
                                </p>
                                {statModalMeta && (
                                    <p className="mt-1 text-[11px] font-medium text-teal-600">
                                        Showing {statModalMembers.length.toLocaleString()} of {statModalMeta.total.toLocaleString()} database records
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedStatCard(null)}
                                className="h-9 w-9 rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto">
                            {isStatModalLoading ? (
                                <div className="space-y-3 px-5 py-5">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <div key={index} className="animate-pulse rounded-2xl border border-slate-100 px-4 py-3">
                                            <div className="h-4 w-44 rounded bg-slate-100" />
                                            <div className="mt-2 h-3 w-60 rounded bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            ) : statModalError ? (
                                <div className="px-5 py-12 text-center">
                                    <p className="text-sm font-medium text-red-600">{statModalError}</p>
                                    <p className="mt-1 text-xs text-slate-400">Try reopening the modal to fetch the live records again.</p>
                                </div>
                            ) : statModalMembers.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                    {statModalMembers.map((member, index) => (
                                        <motion.div
                                            key={`${member.id}-${index}`}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.18, delay: Math.min(index * 0.015, 0.18) }}
                                            className="flex items-center justify-between gap-4 px-5 py-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800">{member.name}</p>
                                                <p className="truncate text-xs text-slate-500">{member.email}</p>
                                                <p className="mt-1 truncate text-[11px] text-slate-400">
                                                    {member.fullAddress || member.referredByName || member.status}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-bold text-teal-700">{member.metricValue ?? '-'}</p>
                                                <p className="text-[11px] text-slate-400">{statModalMetricLabel}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-5 py-12 text-center">
                                    <p className="text-sm font-medium text-slate-600">{selectedStatMeta?.emptyTitle ?? 'No records found.'}</p>
                                    <p className="mt-1 text-xs text-slate-400">{selectedStatMeta?.emptyDescription ?? 'No live records were returned from the database.'}</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs text-slate-400">
                                    Scroll to inspect records. Use load more to fetch the next batch from the database.
                                </p>
                                {canLoadMoreStatMembers && selectedStatCard ? (
                                    <Button
                                        onPress={() => loadStatPage(selectedStatCard, (statModalMeta?.current_page ?? 1) + 1, true)}
                                        isDisabled={isStatModalLoadingMore}
                                        className="rounded-xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:bg-teal-300"
                                    >
                                        {isStatModalLoadingMore ? 'Loading...' : 'Load More'}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default MembersPageMain
