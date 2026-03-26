import { hours } from "../../utils/data";


export const HeadRow = () => {
    const TOTAL_SLOTS = 62;
    const SLOT_WIDTH = 20;
    const START_HOUR = 7;
    const TOTAL_HOURS = Math.floor(TOTAL_SLOTS / 4); // 15 horas → 07:00 a 22:00

    return (
        <div
            className="relative bg-slate-100"
            style={{
                gridColumn: `span ${TOTAL_SLOTS}`,
                height: '36px',
                width: `${TOTAL_SLOTS * SLOT_WIDTH}px`,
            }}
        >
            {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
                const hour = START_HOUR + i;
                const leftPx = i * 4 * SLOT_WIDTH;

                return (
                    <div
                        key={hour}
                        className="absolute flex flex-col items-center justify-end h-full"
                        style={{
                            left: `${leftPx}px`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <div className="w-px bg-slate-300" style={{ height: '8px' }} />
                        <span className="text-[10px] font-mono font-bold text-slate-500 leading-none pb-1 whitespace-nowrap">
                            {String(hour).padStart(2, '0')}:00
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
