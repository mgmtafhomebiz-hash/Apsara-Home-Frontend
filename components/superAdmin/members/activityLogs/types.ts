export type ActivityAction =
  | 'login' | 'logout' | 'purchase' | 'referral'
  | 'encashment_request' | 'profile_update' | 'kyc_submission'
  | 'password_change' | 'wallet_topup' | 'failed_login'

export type ActivityStatus = 'success' | 'failed' | 'pending'

export interface ActivityLog {
  id: number
  memberId: number
  memberName: string
  memberEmail: string
  action: ActivityAction
  detail: string
  status: ActivityStatus
  ipAddress: string
  device: string
  timestamp: string
}

export const ACTION_CONFIG: Record<ActivityAction, { label: string; icon: string; bg: string; text: string }> = {
  login:               { label: 'Login',           icon: 'ðŸ”‘', bg: 'bg-blue-50',    text: 'text-blue-700'   },
  logout:              { label: 'Logout',           icon: 'ðŸšª', bg: 'bg-slate-100',  text: 'text-slate-600'  },
  purchase:            { label: 'Purchase',         icon: 'ðŸ›’', bg: 'bg-teal-50',    text: 'text-teal-700'   },
  referral:            { label: 'Referral',         icon: 'ðŸ”—', bg: 'bg-purple-50',  text: 'text-purple-700' },
  encashment_request:  { label: 'Encashment',       icon: 'ðŸ’¸', bg: 'bg-sky-50',   text: 'text-sky-700'  },
  profile_update:      { label: 'Profile Update',   icon: '✏️',  bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  kyc_submission:      { label: 'KYC Submission',   icon: 'ðŸ“„', bg: 'bg-sky-50',  text: 'text-sky-700' },
  password_change:     { label: 'Password Change',  icon: 'ðŸ”’', bg: 'bg-rose-50',    text: 'text-rose-700'   },
  wallet_topup:        { label: 'Wallet Top-up',    icon: 'ðŸ’³', bg: 'bg-emerald-50', text: 'text-emerald-700'},
  failed_login:        { label: 'Failed Login',     icon: '⚠️',  bg: 'bg-red-50',     text: 'text-red-700'    },
}

export const STATUS_CONFIG: Record<ActivityStatus, { dot: string; bg: string; text: string; label: string }> = {
  success: { dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Success' },
  failed:  { dot: 'bg-red-400',     bg: 'bg-red-50',     text: 'text-red-700',     label: 'Failed'  },
  pending: { dot: 'bg-sky-400',   bg: 'bg-sky-50',   text: 'text-sky-700',   label: 'Pending' },
}

export const ACTION_FILTER_OPTIONS = [
  { value: 'all',                label: 'All Actions'     },
  { value: 'login',              label: 'Login'           },
  { value: 'logout',             label: 'Logout'          },
  { value: 'purchase',           label: 'Purchase'        },
  { value: 'referral',           label: 'Referral'        },
  { value: 'encashment_request', label: 'Encashment'      },
  { value: 'profile_update',     label: 'Profile Update'  },
  { value: 'kyc_submission',     label: 'KYC Submission'  },
  { value: 'password_change',    label: 'Password Change' },
  { value: 'wallet_topup',       label: 'Wallet Top-up'   },
  { value: 'failed_login',       label: 'Failed Login'    },
]

export const MOCK_LOGS: ActivityLog[] = [
  { id: 1,  memberId: 1,  memberName: 'Maria Santos',     memberEmail: 'maria.santos@email.com',     action: 'login',              detail: 'Logged in successfully',                      status: 'success', ipAddress: '182.18.4.12',  device: 'Chrome  ?  Windows',  timestamp: '2026-03-09T08:14:22Z' },
  { id: 2,  memberId: 2,  memberName: 'Ramon dela Cruz',  memberEmail: 'ramon.delacruz@email.com',   action: 'purchase',           detail: 'Order #AF-20341 placed - PHP 12,500',         status: 'success', ipAddress: '112.204.7.91', device: 'Safari  ?  iPhone',   timestamp: '2026-03-09T08:02:10Z' },
  { id: 3,  memberId: 3,  memberName: 'Luisa Fernandez',  memberEmail: 'luisa.fernandez@email.com',  action: 'encashment_request', detail: 'Requested PHP 8,000 encashment',              status: 'pending', ipAddress: '121.54.9.3',   device: 'Chrome  ?  Android',  timestamp: '2026-03-09T07:55:00Z' },
  { id: 4,  memberId: 4,  memberName: 'Jose Reyes',       memberEmail: 'jose.reyes@email.com',       action: 'referral',           detail: 'Ana Cruz registered via referral link',       status: 'success', ipAddress: '180.22.1.44',  device: 'Firefox  ?  Windows', timestamp: '2026-03-09T07:41:38Z' },
  { id: 5,  memberId: 5,  memberName: 'Rosa Garcia',      memberEmail: 'rosa.garcia@email.com',      action: 'kyc_submission',     detail: 'Submitted KYC documents for review',          status: 'pending', ipAddress: '120.28.6.77',  device: 'Chrome  ?  Windows',  timestamp: '2026-03-09T07:30:15Z' },
  { id: 6,  memberId: 6,  memberName: 'Elena Bautista',   memberEmail: 'elena.bautista@email.com',   action: 'profile_update',     detail: 'Updated phone number and bio',                status: 'success', ipAddress: '175.45.2.18',  device: 'Safari  ?  Mac',      timestamp: '2026-03-09T07:20:05Z' },
  { id: 7,  memberId: 10, memberName: 'Miguel Torres',    memberEmail: 'miguel.torres@email.com',    action: 'failed_login',       detail: 'Incorrect password - 3 attempts',             status: 'failed',  ipAddress: '202.11.8.55',  device: 'Chrome  ?  Windows',  timestamp: '2026-03-09T07:15:50Z' },
  { id: 8,  memberId: 7,  memberName: 'Ana Cruz',         memberEmail: 'ana.cruz@email.com',         action: 'wallet_topup',       detail: 'Wallet credited PHP 5,000 via GCash',         status: 'success', ipAddress: '119.93.3.21',  device: 'Chrome  ?  Android',  timestamp: '2026-03-09T06:58:12Z' },
  { id: 9,  memberId: 1,  memberName: 'Maria Santos',     memberEmail: 'maria.santos@email.com',     action: 'purchase',           detail: 'Order #AF-20338 placed - PHP 7,200',          status: 'success', ipAddress: '182.18.4.12',  device: 'Chrome  ?  Windows',  timestamp: '2026-03-09T06:44:00Z' },
  { id: 10, memberId: 8,  memberName: 'Carlos Tan',       memberEmail: 'carlos.tan@email.com',       action: 'password_change',    detail: 'Password updated successfully',               status: 'success', ipAddress: '180.191.5.60', device: 'Firefox  ?  Android', timestamp: '2026-03-09T06:30:33Z' },
  { id: 11, memberId: 9,  memberName: 'Pedro Lim',        memberEmail: 'pedro.lim@email.com',        action: 'login',              detail: 'Logged in successfully',                      status: 'success', ipAddress: '115.42.7.9',   device: 'Safari  ?  iPhone',   timestamp: '2026-03-09T06:12:04Z' },
  { id: 12, memberId: 11, memberName: 'Carla Villanueva', memberEmail: 'carla.villanueva@email.com', action: 'referral',           detail: 'Pedro Lim registered via referral link',      status: 'success', ipAddress: '121.54.0.14',  device: 'Chrome  ?  Windows',  timestamp: '2026-03-08T23:55:41Z' },
  { id: 13, memberId: 12, memberName: 'Dante Ocampo',     memberEmail: 'dante.ocampo@email.com',     action: 'encashment_request', detail: 'Requested PHP 15,000 encashment',             status: 'failed',  ipAddress: '175.45.8.99',  device: 'Chrome  ?  Mac',      timestamp: '2026-03-08T22:40:17Z' },
  { id: 14, memberId: 2,  memberName: 'Ramon dela Cruz',  memberEmail: 'ramon.delacruz@email.com',   action: 'logout',             detail: 'Session ended',                               status: 'success', ipAddress: '112.204.7.91', device: 'Safari  ?  iPhone',   timestamp: '2026-03-08T21:22:09Z' },
  { id: 15, memberId: 3,  memberName: 'Luisa Fernandez',  memberEmail: 'luisa.fernandez@email.com',  action: 'purchase',           detail: 'Order #AF-20330 placed - PHP 18,900',         status: 'success', ipAddress: '121.54.9.3',   device: 'Chrome  ?  Android',  timestamp: '2026-03-08T20:10:55Z' },
  { id: 16, memberId: 5,  memberName: 'Rosa Garcia',      memberEmail: 'rosa.garcia@email.com',      action: 'login',              detail: 'Logged in successfully',                      status: 'success', ipAddress: '120.28.6.77',  device: 'Chrome  ?  Windows',  timestamp: '2026-03-08T19:05:30Z' },
  { id: 17, memberId: 10, memberName: 'Miguel Torres',    memberEmail: 'miguel.torres@email.com',    action: 'failed_login',       detail: 'Account locked after 5 attempts',             status: 'failed',  ipAddress: '202.11.8.55',  device: 'Chrome  ?  Windows',  timestamp: '2026-03-08T18:44:22Z' },
  { id: 18, memberId: 6,  memberName: 'Elena Bautista',   memberEmail: 'elena.bautista@email.com',   action: 'wallet_topup',       detail: 'Wallet credited PHP 2,500 via Maya',          status: 'success', ipAddress: '175.45.2.18',  device: 'Safari  ?  Mac',      timestamp: '2026-03-08T17:30:11Z' },
  { id: 19, memberId: 4,  memberName: 'Jose Reyes',       memberEmail: 'jose.reyes@email.com',       action: 'profile_update',     detail: 'Updated profile photo',                       status: 'success', ipAddress: '180.22.1.44',  device: 'Firefox  ?  Windows', timestamp: '2026-03-08T16:15:48Z' },
  { id: 20, memberId: 7,  memberName: 'Ana Cruz',         memberEmail: 'ana.cruz@email.com',         action: 'kyc_submission',     detail: 'Re-submitted KYC after rejection',            status: 'pending', ipAddress: '119.93.3.21',  device: 'Chrome  ?  Android',  timestamp: '2026-03-08T15:02:33Z' },
]

export const formatTimestamp = (ts: string) =>
  new Date(ts).toLocaleString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

export const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
