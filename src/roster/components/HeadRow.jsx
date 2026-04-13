
export const HeadRow = () => {
    const TOTAL_SLOTS = 96;
    const SLOT_WIDTH = 20;
    const START_HOUR = 0;
    const TOTAL_HOURS = Math.floor(TOTAL_SLOTS / 4);

    return (
        <div
            className="relative bg-slate-100"
            style={{
                gridColumn: `span ${TOTAL_SLOTS}`,
                height: '44px',
                width: `${TOTAL_SLOTS * SLOT_WIDTH}px`,
                borderBottom: '0.5px solid #94a3b8',
            }}
        >
            {/* Ticks de media hora */}
            {Array.from({ length: TOTAL_SLOTS + 1 }, (_, i) => {
                const isHour = i % 4 === 0;
                const isHalf = i % 2 === 0 && !isHour;
                if (!isHour && !isHalf) return null;

                return (
                    <div
                        key={`tick-${i}`}
                        className="absolute bottom-0"
                        style={{
                            left: `${i * SLOT_WIDTH}px`,
                            transform: 'translateX(-50%)',
                            width: isHour ? '1px' : '1px',
                            height: isHour ? '12px' : '6px',
                            backgroundColor: isHour ? '#475569' : '#94a3b8',
                            borderRadius: '1px',
                        }}
                    />
                );
            })}

            {/* Etiquetas de hora */}
            {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
                const hour = START_HOUR + i;
                const leftPx = i * 4 * SLOT_WIDTH;

                return (
                    <div
                        key={hour}
                        className="absolute flex items-center justify-center"
                        style={{
                            left: `${leftPx}px`,
                            transform: 'translateX(-50%)',
                            top: '8px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '13px',
                                fontFamily: 'monospace',
                                fontWeight: '700',
                                color: '#1e293b',
                                letterSpacing: '0.02em',
                            }}
                        >
                            {String(hour).padStart(2, '0')}:00
                        </span>
                    </div>
                );
            })}
        </div>
    );
};