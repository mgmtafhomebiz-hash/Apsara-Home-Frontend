'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReferralNode {
  id: number
  name: string
  email: string
  tier: string
  commissionEarned: number
  referralCount: number
  joinedAt: string
  status: 'active' | 'pending' | 'blocked'
  children?: ReferralNode[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_TREE: ReferralNode[] = [
  {
    id: 1,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    tier: 'Lifestyle Elite',
    commissionEarned: 48500,
    referralCount: 18,
    joinedAt: '2023-01-15',
    status: 'active',
    children: [
      {
        id: 4,
        name: 'Jose Reyes',
        email: 'jose.reyes@email.com',
        tier: 'Lifestyle Consultant',
        commissionEarned: 22300,
        referralCount: 7,
        joinedAt: '2023-03-02',
        status: 'active',
        children: [
          {
            id: 8,
            name: 'Ana Cruz',
            email: 'ana.cruz@email.com',
            tier: 'Home Stylist',
            commissionEarned: 8700,
            referralCount: 3,
            joinedAt: '2023-05-10',
            status: 'active',
            children: [],
          },
          {
            id: 9,
            name: 'Pedro Lim',
            email: 'pedro.lim@email.com',
            tier: 'Home Builder',
            commissionEarned: 4200,
            referralCount: 1,
            joinedAt: '2023-06-20',
            status: 'pending',
            children: [],
          },
        ],
      },
      {
        id: 5,
        name: 'Rosa Garcia',
        email: 'rosa.garcia@email.com',
        tier: 'Home Stylist',
        commissionEarned: 11200,
        referralCount: 4,
        joinedAt: '2023-04-18',
        status: 'active',
        children: [
          {
            id: 10,
            name: 'Carlos Tan',
            email: 'carlos.tan@email.com',
            tier: 'Home Starter',
            commissionEarned: 1800,
            referralCount: 0,
            joinedAt: '2023-07-05',
            status: 'active',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Ramon dela Cruz',
    email: 'ramon.delacruz@email.com',
    tier: 'Lifestyle Consultant',
    commissionEarned: 31200,
    referralCount: 11,
    joinedAt: '2023-02-08',
    status: 'active',
    children: [
      {
        id: 6,
        name: 'Elena Bautista',
        email: 'elena.bautista@email.com',
        tier: 'Home Builder',
        commissionEarned: 9600,
        referralCount: 2,
        joinedAt: '2023-04-01',
        status: 'active',
        children: [],
      },
    ],
  },
  {
    id: 3,
    name: 'Luisa Fernandez',
    email: 'luisa.fernandez@email.com',
    tier: 'Home Stylist',
    commissionEarned: 15800,
    referralCount: 6,
    joinedAt: '2023-03-22',
    status: 'active',
    children: [
      {
        id: 7,
        name: 'Miguel Torres',
        email: 'miguel.torres@email.com',
        tier: 'Home Starter',
        commissionEarned: 2100,
        referralCount: 0,
        joinedAt: '2023-05-30',
        status: 'blocked',
        children: [],
      },
    ],
  },
]

// Flatten tree for list view
function flattenTree(nodes: ReferralNode[], depth = 0): (ReferralNode & { depth: number })[] {
  return nodes.flatMap(n => [{ ...n, depth }, ...flattenTree(n.children ?? [], depth + 1)])
}

const ALL_FLAT = flattenTree(MOCK_TREE)

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TIER_COLORS: Record<string, string> = {
  'Lifestyle Elite': 'bg-purple-100 text-purple-700 border-purple-200',
  'Lifestyle Consultant': 'bg-blue-100 text-blue-700 border-blue-200',
  'Home Stylist': 'bg-teal-100 text-teal-700 border-teal-200',
  'Home Builder': 'bg-amber-100 text-amber-700 border-amber-200',
  'Home Starter': 'bg-slate-100 text-slate-600 border-slate-200',
}

const STATUS_CONFIG = {
  active: { dot: 'bg-emerald-400', label: 'Active', text: 'text-emerald-600' },
  pending: { dot: 'bg-amber-400', label: 'Pending', text: 'text-amber-600' },
  blocked: { dot: 'bg-red-400', label: 'Blocked', text: 'text-red-600' },
}

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const php = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n)

// ─── TreeNode Component ───────────────────────────────────────────────────────
function TreeNodeCard({ node, depth }: { node: ReferralNode; depth: number }) {
  const [open, setOpen] = useState(depth < 1)
  const hasChildren = (node.children?.length ?? 0) > 0
  const status = STATUS_CONFIG[node.status]
  const tierColor = TIER_COLORS[node.tier] ?? 'bg-slate-100 text-slate-600 border-slate-200'

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-slate-100 pl-4' : ''}`}>
      <div className={`group relative bg-white border rounded-2xl p-4 mb-2 transition-all duration-200 hover:shadow-md hover:border-teal-200 ${depth === 0 ? 'border-slate-200 shadow-sm' : 'border-slate-100'}`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${depth === 0 ? 'bg-gradient-to-br from-teal-400 to-teal-600' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
              {getInitials(node.name)}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${status.dot}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-800 truncate">{node.name}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tierColor}`}>
                {node.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{node.email}</p>

            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Commission</p>
                <p className="text-sm font-bold text-teal-600">{php(node.commissionEarned)}</p>
              </div>
              <div className="w-px h-7 bg-slate-100" />
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Referrals</p>
                <p className="text-sm font-bold text-slate-700">{node.referralCount}</p>
              </div>
              <div className="w-px h-7 bg-slate-100" />
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Joined</p>
                <p className="text-xs font-medium text-slate-600">{new Date(node.joinedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: '2-digit' })}</p>
              </div>
            </div>
          </div>

          {/* Toggle */}
          {hasChildren && (
            <button
              onClick={() => setOpen(p => !p)}
              className="shrink-0 h-7 w-7 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-400 hover:text-teal-600 flex items-center justify-center transition-all"
            >
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Children count badge */}
        {hasChildren && !open && (
          <div className="absolute -bottom-px left-4">
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-t-none rounded-b-lg font-medium">
              {node.children!.length} direct {node.children!.length === 1 ? 'referral' : 'referrals'} hidden
            </span>
          </div>
        )}
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map(child => (
              <TreeNodeCard key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ListRow({ member }: { member: ReferralNode & { depth: number } }) {
  const status = STATUS_CONFIG[member.status]
  const tierColor = TIER_COLORS[member.tier] ?? 'bg-slate-100 text-slate-600 border-slate-200'

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div style={{ paddingLeft: member.depth * 16 }} className="flex items-center gap-3">
            {member.depth > 0 && (
              <span className="text-slate-300 text-xs select-none">{'└─'.repeat(1)}</span>
            )}
            <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${member.depth === 0 ? 'bg-gradient-to-br from-teal-400 to-teal-600' : 'bg-gradient-to-br from-slate-300 to-slate-500'}`}>
              {getInitials(member.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{member.name}</p>
              <p className="text-xs text-slate-400">{member.email}</p>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${tierColor}`}>
          {member.tier}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-bold text-teal-600">{php(member.commissionEarned)}</td>
      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-slate-700">{member.referralCount}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">
        {new Date(member.joinedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
    </tr>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  {
    label: 'Total Commission Paid',
    value: php(145900),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-teal-400 to-teal-600',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
  },
  {
    label: 'Active Referrers',
    value: '47',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    label: 'Total Referrals',
    value: '231',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    color: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    label: 'Avg. Commission/Member',
    value: php(3104),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────
type Tab = 'tree' | 'list'

export default function ReferralTreePageMain() {
  const [tab, setTab] = useState<Tab>('tree')
  const [search, setSearch] = useState('')

  const filteredFlat = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return ALL_FLAT
    return ALL_FLAT.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.tier.toLowerCase().includes(q)
    )
  }, [search])

  const filteredTree = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return MOCK_TREE
    const filterNodes = (nodes: ReferralNode[]): ReferralNode[] =>
      nodes
        .map(n => ({
          ...n,
          children: filterNodes(n.children ?? []),
        }))
        .filter(
          n =>
            n.name.toLowerCase().includes(q) ||
            n.email.toLowerCase().includes(q) ||
            n.tier.toLowerCase().includes(q) ||
            n.children!.length > 0
        )
    return filterNodes(MOCK_TREE)
  }, [search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-800">Commission / Referral Tree</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track referral hierarchies and commission earnings across all members
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className="text-base font-bold text-slate-800 truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3 flex-wrap"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search member, email or tier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400 bg-slate-50 text-slate-700 placeholder-slate-400 transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Tab toggle */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setTab('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'tree' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
            Tree View
          </button>
          <button
            onClick={() => setTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            List View
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === 'tree' ? (
          <div className="space-y-2">
            {filteredTree.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">No results found</p>
                <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
              </div>
            ) : (
              filteredTree.map(node => (
                <TreeNodeCard key={node.id} node={node} depth={0} />
              ))
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Member</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tier</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Commission</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Referrals</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredFlat.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center">
                        <p className="text-sm text-slate-500">No members found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredFlat.map(m => <ListRow key={`${m.id}-${m.depth}`} member={m} />)
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filteredFlat.length}</span> members
              </p>
              <div className="text-xs text-slate-400">
                Total commission:{' '}
                <span className="font-bold text-teal-600">
                  {php(filteredFlat.reduce((sum, m) => sum + m.commissionEarned, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
      >
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Tier Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TIER_COLORS).map(([tier, color]) => (
            <span key={tier} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
              {tier}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
