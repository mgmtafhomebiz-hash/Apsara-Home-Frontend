'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface HeaderProps {
    onMenuClick: () => void;
}

const mockNotifs = [
    { id: 1, text: 'New member registered', time: '2m ago', unread: true },
    { id: 2, text: '12 orders pending approval', time: '15m ago', unread: true },
    { id: 3, text: 'Withdrawal request ₱4,620', time: '1h ago', unread: true },
    { id: 4, text: 'Low stock: Product #1042', time: '3h ago', unread: false },
]
const Header = ({ onMenuClick }: HeaderProps) => {
    const [notifOpen, setNotifOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const unreadCount = mockNotifs.filter(n => n.unread).length
    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10">
            {/* FOR MOBILE ONLY */}
            <button
                onClick={onMenuClick}
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            {/* PAGE TITLE */}
            <div className="hidden sm:block">
                <h1>Dashboard</h1>
                <p className="text-slate-400">Welcome back, Super Admin</p>
            </div>

            {/* SEARCH */}
            <div className="flex-1 max-w-md mx-auto">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        type="text"
                        placeholder="Search orders, members, products..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* DATE */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                              <span className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                </div>

                {/* NOTFICATIONS */}
                <div className="relative">
                    <button onClick={() => {
                        setNotifOpen(!notifOpen)
                        setUserOpen(false)
                    }}
                    className="relative flex items-center justify-center h-9 w-9 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"/>
                                    )}
                    </button>
                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95}}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100"
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 z-10 overflow-hidden">
                                    <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                                    <span className="text-xs text-teal-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                                </div>
                                {mockNotifs.map((n => (
                                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? 'bg-teal-50/50' : ''}`}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-700 font-medium">{n.text}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                                        </div>
                                    </div>
                                )))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    )
}

export default Header
