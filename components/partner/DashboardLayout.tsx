'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useGetAdminMeQuery } from '@/store/api/authApi'
import { useHeartbeatAdminPresenceMutation } from '@/store/api/adminUsersApi'
import Sidebar from './Sidebar'
import Header from './Header'

interface PartnerDashboardLayoutProps {
    children: React.ReactNode
}

const PartnerDashboardLayout = ({ children }: PartnerDashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const { data: session } = useSession()
    const [heartbeatAdminPresence] = useHeartbeatAdminPresenceMutation()
    const pathname = usePathname()
    const isBanned = (session?.user as { isBanned?: boolean } | undefined)?.isBanned === true
    const sessionAccessToken = String((session?.user as { accessToken?: string } | undefined)?.accessToken ?? '')
    const adminIdentityKey = sessionAccessToken
        ? `${String((session?.user as { id?: string | number } | undefined)?.id ?? 'unknown')}:${sessionAccessToken}`
        : undefined

    // Poll /me every 12 seconds
    useGetAdminMeQuery(adminIdentityKey, { pollingInterval: 12_000, skip: isBanned || !sessionAccessToken })

    useEffect(() => {
        if (!sessionAccessToken || isBanned) {
            return
        }

        const currentPath = pathname || '/partner/dashboard'

        void heartbeatAdminPresence({ path: currentPath })

        const intervalId = window.setInterval(() => {
            void heartbeatAdminPresence({ path: currentPath })
        }, 30_000)

        return () => window.clearInterval(intervalId)
    }, [heartbeatAdminPresence, isBanned, sessionAccessToken, pathname])

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto bg-slate-100 p-4 lg:p-6 dark:bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default PartnerDashboardLayout
