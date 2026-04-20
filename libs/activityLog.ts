import { store } from '@/store/store'
import { activityLogsApi } from '@/store/api/activityLogsApi'
import type { ActivityLogPayload } from '@/store/api/activityLogsApi'

export function getClientInfo() {
  if (typeof window === 'undefined') {
    return { ip_address: undefined, user_agent: navigator.userAgent }
  }

  return {
    ip_address: undefined,
    user_agent: navigator.userAgent,
  }
}

export async function logActivity(
  customerId: number,
  activityType: ActivityLogPayload['activity_type'],
  action: ActivityLogPayload['action'],
  description?: string,
  additionalData?: Omit<ActivityLogPayload, 'customer_id' | 'activity_type' | 'action' | 'description'>
) {
  try {
    const clientInfo = getClientInfo()
    const payload: ActivityLogPayload = {
      customer_id: customerId,
      activity_type: activityType,
      action,
      description,
      ...clientInfo,
      ...additionalData,
    }

    store.dispatch(
      activityLogsApi.endpoints.createActivityLog.initiate(payload)
    )
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

export async function logLoginActivity(customerId: number, loginMethod: string = 'manual') {
  await logActivity(
    customerId,
    'login',
    'create',
    'Member logged in',
    {
      details: {
        login_method: loginMethod,
      },
    }
  )
}

export async function logRegisterActivity(customerId: number) {
  await logActivity(
    customerId,
    'account_status_change',
    'create',
    'New member account created',
    {
      details: {
        registration_type: 'direct',
      },
    }
  )
}

export async function logLogoutActivity(customerId: number) {
  await logActivity(
    customerId,
    'logout',
    'create',
    'Member logged out'
  )
}
