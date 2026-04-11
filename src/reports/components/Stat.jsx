export const Stat = ({ label, value, color, highlight }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{label}</span>
        <span className={`text-3xl font-bold tracking-tight ${color} ${highlight ? 'underline decoration-4 decoration-emerald-500/10 underline-offset-8' : ''}`}>
            {value}
        </span>
    </div>
)