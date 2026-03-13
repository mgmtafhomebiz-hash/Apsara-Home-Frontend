'use client';

interface PvStatCardProps {
    label: string;
    value: number | string;
    accent?: 'blue' | 'amber' | 'violet' | 'emerald'
    helper?: string;
}

const accentMap = {
  blue: 'from-sky-500/15 to-cyan-500/5 text-sky-700 border-sky-100',
  amber: 'from-amber-500/15 to-orange-500/5 text-amber-700 border-amber-100',
  emerald: 'from-emerald-500/15 to-teal-500/5 text-emerald-700 border-emerald-100',
  violet: 'from-violet-500/15 to-fuchsia-500/5 text-violet-700 border-violet-100',
}

const PvStatCard = ({
  label,
  value,
  accent = 'blue',
  helper,
}: PvStatCardProps) => {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${accentMap[accent]} p-5 shadow-sm`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold -tracking-tight text-slate-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
    </div>
  )
}

export default PvStatCard
