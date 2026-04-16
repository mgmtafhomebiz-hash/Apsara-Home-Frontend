'use client';

interface PvStatCardProps {
    label: string;
    value: number | string;
    accent?: 'blue' | 'amber' | 'violet' | 'emerald'
    helper?: string;
}

const accentMap = {
  blue: 'from-sky-500/15 to-cyan-500/5 dark:from-sky-900/40 dark:to-cyan-900/30 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-800',
  amber: 'from-amber-500/15 to-orange-500/5 dark:from-amber-900/40 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800',
  emerald: 'from-emerald-500/15 to-teal-500/5 dark:from-emerald-900/40 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
  violet: 'from-violet-500/15 to-fuchsia-500/5 dark:from-violet-900/40 dark:to-fuchsia-900/30 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-800',
}

const PvStatCard = ({
  label,
  value,
  accent = 'blue',
  helper,
}: PvStatCardProps) => {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${accentMap[accent]} p-5`}
    >
      <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-bold -tracking-tight text-slate-900 dark:text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {helper ? <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">{helper}</p> : null}
    </div>
  )
}

export default PvStatCard
