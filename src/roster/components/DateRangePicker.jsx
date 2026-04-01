import { AppContext } from "@/context/AppContext";
import { useContext, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateRangePicker({ filters, handleFilterChange }) {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const [range, setRange] = useState({
        from: filters.startDate ? new Date(filters.startDate) : undefined,
        to: filters.endDate ? new Date(filters.endDate) : undefined,
    });

    const { setAppliedDates } = useContext(AppContext);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const handleOpen = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
            });
        }
        setOpen(true);
    };

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDate = (date) => {
        return date ? date.toLocaleDateString() : "Añadir fecha";
    };

    const handleSelect = (selectedRange) => {
        setRange(selectedRange);
        if (selectedRange?.from) {
            handleFilterChange("startDate", formatLocalDate(selectedRange.from));
        }
        if (selectedRange?.to) {
            handleFilterChange("endDate", formatLocalDate(selectedRange.to));
        }
    };

    const handleApply = () => {
        setAppliedDates({
            startDate: filters.startDate,
            endDate: filters.endDate,
        });
        setOpen(false);
    };

    const handleClear = () => {
        setRange({ from: undefined, to: undefined });
        handleFilterChange("startDate", "");
        handleFilterChange("endDate", "");
    };

    const dropdown = open && (
        <>
            {/* Overlay para cerrar al hacer click fuera */}
            <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setOpen(false)}
            />
            <div
                className={`z-[9999] bg-white border rounded-xl shadow-xl p-4 ${isMobile ? "fixed inset-4 overflow-auto" : "absolute"
                    }`}
                style={
                    isMobile
                        ? {}
                        : { top: dropdownPos.top, left: dropdownPos.left }
                }
            >
                {isMobile && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Seleccionar fechas</h2>
                        <button onClick={() => setOpen(false)} className="text-slate-500 text-sm">
                            Cerrar
                        </button>
                    </div>
                )}

                <div style={{ fontSize: "0.8rem" }}>
                    <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={handleSelect}
                        numberOfMonths={isMobile ? 1 : 2}
                        pagedNavigation
                        style={{ margin: 0 }}
                    />
                </div>

                <div className="flex justify-between mt-4 gap-2">
                    <button
                        onClick={handleClear}
                        className="flex-1 text-sm text-slate-500 py-2 hover:text-black"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 text-sm bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="relative w-full flex flex-col gap-3" ref={triggerRef}>
            <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Entrada</label>
                    <div
                        onClick={handleOpen}
                        className="border border-slate-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500 transition text-sm truncate bg-white h-10 flex items-center"
                    >
                        {formatDate(range?.from)}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Salida</label>
                    <div
                        onClick={handleOpen}
                        className="border border-slate-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500 transition text-sm truncate bg-white h-10 flex items-center"
                    >
                        {formatDate(range?.to)}
                    </div>
                </div>
            </div>

            {createPortal(dropdown, document.body)}
        </div>
    );
}