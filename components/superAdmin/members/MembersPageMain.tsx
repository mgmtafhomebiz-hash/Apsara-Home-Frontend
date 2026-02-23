'use client'

import { motion } from "framer-motion"
import MembersToolbar from "./MembersToolbar"
import MembersStats from "./MembersStats"
import MembersTable from "./MembersTable"
import { useMemo, useState } from "react"
import { MemberStatus, MemberTier } from "@/types/members/types"
import { MOCK_MEMBERS } from "@/libs/members/mockMembers"
import AddMemberModal from "./AddMemberModal"

const MembersPageMain = () => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<'all' | MemberStatus>('all')
    const [tier, setTier] = useState<'all' | MemberTier>('all');
    const [showModal, setShowModal] = useState(false);

    const filtered = useMemo(() => {
        return MOCK_MEMBERS.filter((member) => {
            const matchSearch =
                member.name.toLowerCase().includes(search.toLowerCase()) ||
                member.email.toLowerCase().includes(search.toLowerCase())
            const matchStatus = status === 'all' ? true : member.status === status
            const matchTier = tier === 'all' ? true : member.tier === tier
            return matchSearch && matchStatus && matchTier
        })
    }, [search, status, tier])

    return (
        <div className="space-y-5">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between gap-4"
            >
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Members</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage member profiles, tiers and activities</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-teal-500/30 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Add Member</span>
                </button>
            </motion.div>

            <MembersStats rows={filtered} />

            <MembersToolbar
                search={search}
                onSearch={setSearch}
                status={status}
                onStatus={setStatus}
                tier={tier}
                onTier={setTier}
                resultCount={filtered.length}
            />

            <MembersTable rows={filtered} />

            <AddMemberModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={(data) => {
                    console.log('New member data: ', data)
                }}
            />
        </div>
    )
}

export default MembersPageMain
