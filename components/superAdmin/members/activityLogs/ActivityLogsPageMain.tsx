'use client';

import { useMemo, useState } from "react";
import { MOCK_LOGS } from "./types";
import { motion } from "framer-motion";
import ActivityLogsStats from "./ActivityLogsStats";
import ActivityLogsToolbar from "./ActivityLogsToolbar";
import ActivityLogsTable from "./ActivityLogsTable";

const ActivityLogsPageMain = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase()
    return MOCK_LOGS.filter(log => {
        if (q && !log.memberName.toLowerCase().includes(q) && 
                 !log.memberEmail.toLowerCase().includes(q) &&
                 !log.detail.toLowerCase().includes(q)) return false
        if (actionFilter !== 'all' && log.action !== actionFilter) return false;
        if (statusFilter !== 'all' && log.status !== statusFilter) return false;
        return true;
    })
  }, [search, actionFilter, statusFilter])

  return (
    <div className="space-y-6">
        {/* HEADER */}
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4 flex-wrap"
        >
            <div>
                <h1 className="text-xl font-bold text-slate-800">Members Activity Logs</h1>
                <p className="text-sm text-slate-500 mt-0.5">Track all member actions = logins, purchase, encashment, and more</p>
            </div>
        </motion.div>

        <ActivityLogsStats />

        <ActivityLogsToolbar 
            search={search}
            actionFilter={actionFilter}
            statusFilter={statusFilter}
            total={filtered.length}
            onSearch={setSearch}
            onActionFilter={setActionFilter}
            onStatusFilter={setStatusFilter}
        />
      
      <ActivityLogsTable logs={filtered}/>
    </div>
  )
}

export default ActivityLogsPageMain
