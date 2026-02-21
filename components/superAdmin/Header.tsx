'use client';

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
const Header = ({ onMenuClick }:HeaderProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const unreadCount = mockNotifs.filter(n => n.unread).length
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10">

    </header>
  )
}

export default Header
