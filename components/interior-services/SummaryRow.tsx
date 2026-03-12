'use client';

const SummaryRow = ({ label, value}: { label: string, value: string }) => {
    return (
        <div className="flex items-start justify-between py-3 border-b border-white/[0.06] last:border-0">
            <span className="text-[0.68rem] tracking-[0.12em] uppercase text-stone-500">{label}</span>
            <span className="text-[0.82rem] text-stone-300 text-right max-w-[60%]">{value || "—"}</span>
        </div>
    )
}

export default SummaryRow
