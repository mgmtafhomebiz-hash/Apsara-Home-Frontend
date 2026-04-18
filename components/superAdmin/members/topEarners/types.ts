export interface TopEarner {
  id: number
  name: string
  email: string
  tier: string
  earnings: number
  orders: number
  referrals: number
  status: 'active' | 'pending' | 'blocked'
  joinedAt: string
  lastActive: string
  totalSpent: number
}

export type SortKey = 'earnings' | 'orders' | 'referrals' | 'totalSpent'

export const TIER_COLORS: Record<string, string> = {
  'Lifestyle Elite':      'bg-purple-100 text-purple-700 border-purple-200',
  'Lifestyle Consultant': 'bg-blue-100   text-blue-700   border-blue-200',
  'Home Stylist':         'bg-teal-100   text-teal-700   border-teal-200',
  'Home Builder':         'bg-sky-100  text-sky-700  border-sky-200',
  'Home Starter':         'bg-slate-100  text-slate-600  border-slate-200',
}

export const STATUS_CONFIG: Record<string, { dot: string; text: string; label: string }> = {
  active:  { dot: 'bg-emerald-400', text: 'text-emerald-600', label: 'Active'  },
  pending: { dot: 'bg-sky-400',   text: 'text-sky-600',   label: 'Pending' },
  blocked: { dot: 'bg-red-400',     text: 'text-red-500',     label: 'Blocked' },
}

export const MEDALS: Record<number, { emoji: string; ring: string; bg: string }> = {
  1: { emoji: '#1', ring: 'ring-2 ring-yellow-400', bg: 'bg-gradient-to-br from-yellow-400 to-sky-500' },
  2: { emoji: '#2', ring: 'ring-2 ring-slate-400',  bg: 'bg-gradient-to-br from-slate-400 to-slate-500'  },
  3: { emoji: '#3', ring: 'ring-2 ring-sky-600',  bg: 'bg-gradient-to-br from-sky-600 to-sky-700'  },
}

export const TIERS = [
  'All Tiers',
  'Lifestyle Elite',
  'Lifestyle Consultant',
  'Home Stylist',
  'Home Builder',
  'Home Starter',
]

export const MOCK_EARNERS: TopEarner[] = [
  { id: 1,  name: 'Maria Santos',      email: 'maria.santos@email.com',     tier: 'Lifestyle Elite',      earnings: 148500, orders: 47, referrals: 18, status: 'active',  joinedAt: '2022-11-05', lastActive: '2026-03-08', totalSpent: 312000 },
  { id: 2,  name: 'Ramon dela Cruz',   email: 'ramon.delacruz@email.com',   tier: 'Lifestyle Consultant', earnings: 112300, orders: 38, referrals: 11, status: 'active',  joinedAt: '2023-01-18', lastActive: '2026-03-07', totalSpent: 245000 },
  { id: 3,  name: 'Carla Villanueva', email: 'carla.villanueva@email.com',  tier: 'Lifestyle Consultant', earnings: 87400,  orders: 29, referrals: 8,  status: 'active',  joinedAt: '2023-02-05', lastActive: '2026-03-07', totalSpent: 176000 },
  { id: 4,  name: 'Luisa Fernandez',   email: 'luisa.fernandez@email.com',  tier: 'Lifestyle Consultant', earnings: 98750,  orders: 31, referrals: 9,  status: 'active',  joinedAt: '2023-02-22', lastActive: '2026-03-06', totalSpent: 198000 },
  { id: 5,  name: 'Jose Reyes',        email: 'jose.reyes@email.com',       tier: 'Home Stylist',         earnings: 74200,  orders: 24, referrals: 7,  status: 'active',  joinedAt: '2023-03-10', lastActive: '2026-03-05', totalSpent: 145000 },
  { id: 6,  name: 'Dante Ocampo',      email: 'dante.ocampo@email.com',     tier: 'Home Stylist',         earnings: 53900,  orders: 18, referrals: 5,  status: 'active',  joinedAt: '2023-05-01', lastActive: '2026-03-01', totalSpent: 112000 },
  { id: 7,  name: 'Rosa Garcia',       email: 'rosa.garcia@email.com',      tier: 'Home Stylist',         earnings: 62100,  orders: 21, referrals: 6,  status: 'active',  joinedAt: '2023-04-01', lastActive: '2026-03-04', totalSpent: 127000 },
  { id: 8,  name: 'Elena Bautista',    email: 'elena.bautista@email.com',   tier: 'Home Builder',         earnings: 45800,  orders: 16, referrals: 4,  status: 'active',  joinedAt: '2023-04-15', lastActive: '2026-03-03', totalSpent: 98000  },
  { id: 9,  name: 'Ana Cruz',          email: 'ana.cruz@email.com',         tier: 'Home Builder',         earnings: 38400,  orders: 13, referrals: 3,  status: 'active',  joinedAt: '2023-05-20', lastActive: '2026-03-02', totalSpent: 81000  },
  { id: 10, name: 'Carlos Tan',        email: 'carlos.tan@email.com',       tier: 'Home Builder',         earnings: 29700,  orders: 11, referrals: 2,  status: 'active',  joinedAt: '2023-06-08', lastActive: '2026-02-28', totalSpent: 64000  },
  { id: 11, name: 'Pedro Lim',         email: 'pedro.lim@email.com',        tier: 'Home Starter',         earnings: 18200,  orders: 7,  referrals: 1,  status: 'pending', joinedAt: '2023-07-12', lastActive: '2026-02-20', totalSpent: 42000  },
  { id: 12, name: 'Miguel Torres',     email: 'miguel.torres@email.com',    tier: 'Home Starter',         earnings: 11600,  orders: 4,  referrals: 0,  status: 'blocked', joinedAt: '2023-08-01', lastActive: '2026-01-15', totalSpent: 28000  },
]

export const php = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n)

export const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
