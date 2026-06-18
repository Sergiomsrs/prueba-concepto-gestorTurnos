import React from 'react';
import {
    useRotationSimulator,
    DIAS_NOMBRES,
    DIAS_FULL,
    PALETA_CICLOS
} from '../hooks/useRotationSimulator';

export default function RotacionLibranzas() {
    const {
        numEmp, setNumEmp,
        vistaMode, setVistaMode,
        numCiclos, patron,
        empleadosActivos, toggleEmpleadoActivo,
        showConfig, setShowConfig,
        totalActivos,
        matrizDatos,
        metrics,
        borradorNumCiclos, borradorPatron,
        handleBorradorCheckbox,
        incrementarBorradorCiclo, decrementarBorradorCiclo,
        aplicarCiclos, restaurarCiclosDefecto
    } = useRotationSimulator();

    // Función auxiliar de color para los rangos de cobertura (Mismo comportamiento del script original)
    const getColorClase = (pct) => {
        if (pct >= 0.75) return 'bg-[#1D9E75] text-[#04342C]';
        if (pct >= 0.60) return 'bg-[#378ADD] text-[#042C53]';
        if (pct >= 0.45) return 'bg-[#EF9F27] text-[#412402]';
        return 'bg-[#E24B4A] text-[#501313]';
    };

    const diasTotales = numCiclos * 7;

    return (
        <div className="p-3 sm:p-6 space-y-8 mt-12 sm:px-16 w-full md:w-2/3 max-w-full mx-auto overflow-x-hidden">
            <h2 className="sr-only">Visualización de los {diasTotales} días del ciclo de rotación de libranzas</h2>

            {/* ── SECCIÓN DE CONTROLES PRINCIPALES ── */}
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center bg-[#fafafa] p-4 rounded-lg mb-6 border border-gray-100">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-[#6b6b6b] whitespace-nowrap">Empleados:</label>
                    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() => numEmp > numCiclos && setNumEmp(numEmp - 1)}
                            className="w-11 h-11 bg-[#378ADD] text-white font-bold text-lg active:bg-[#25619d] transition-colors flex-shrink-0"
                        >
                            —
                        </button>
                        <input
                            type="text"
                            value={numEmp}
                            readOnly
                            className="w-12 h-11 text-center text-lg font-bold text-[#1a1a1a] flex-shrink-0"
                        />
                        <button
                            type="button"
                            onClick={() => numEmp < 36 && setNumEmp(numEmp + 1)}
                            className="w-11 h-11 bg-[#378ADD] text-white font-bold text-lg active:bg-[#25619d] transition-colors flex-shrink-0"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 min-w-0 sm:min-w-[200px]">
                    <label className="text-sm font-semibold text-[#6b6b6b] whitespace-nowrap">Vista:</label>
                    <select
                        value={vistaMode}
                        onChange={(e) => setVistaMode(e.target.value)}
                        className="w-full min-w-0 p-2.5 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                    >
                        <option value="cobertura">Cobertura (empleados trabajando)</option>
                        <option value="libranza">Quién libra cada día</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => setShowConfig(!showConfig)}
                    className="md:ml-auto p-2.5 px-4 border border-gray-300 rounded-lg bg-white text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
                >
                    ⚙ Configurar ciclos
                </button>
            </div>

            {/* ── PANEL DE CONFIGURACIÓN DE CICLOS (MODAL / DESPLEGABLE) ── */}
            {showConfig && (
                <div className="bg-[#fafafa] border border-gray-200 rounded-lg p-4 mb-6 shadow-inner animate-fadeIn">
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 mb-4">
                        <label className="text-sm font-medium text-[#6b6b6b]">Número de ciclos:</label>
                        <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <button
                                type="button"
                                onClick={decrementarBorradorCiclo}
                                className="w-11 h-11 bg-[#378ADD] text-white font-bold text-lg active:bg-[#25619d] flex-shrink-0"
                            >
                                —
                            </button>
                            <input
                                type="text"
                                value={borradorNumCiclos}
                                readOnly
                                className="w-12 h-11 text-center text-lg font-bold flex-shrink-0"
                            />
                            <button
                                type="button"
                                onClick={incrementarBorradorCiclo}
                                className="w-11 h-11 bg-[#378ADD] text-white font-bold text-lg active:bg-[#25619d] flex-shrink-0"
                            >
                                +
                            </button>
                        </div>
                        <span className="text-xs text-[#6b6b6b] italic">Marca los días que libra cada ciclo</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {Array.from({ length: borradorNumCiclos }).map((_, c) => {
                            const color = PALETA_CICLOS[c % PALETA_CICLOS.length];
                            const diasSeleccionados = borradorPatron[c]?.length || 0;
                            return (
                                <div key={c} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-gray-200 rounded-lg p-2 px-3 shadow-sm">
                                    <div className="flex items-center gap-2 font-bold text-sm min-w-[80px]">
                                        <span className={`w-3 h-3 rounded-sm ${color.bg}`} />
                                        C{c + 1}
                                    </div>
                                    <div className="flex gap-2 flex-wrap flex-1">
                                        {DIAS_NOMBRES.map((nombreDia, d) => (
                                            <label key={d} className="flex flex-col items-center gap-0.5 text-[10px] sm:text-xs text-[#6b6b6b] cursor-pointer select-none min-w-[28px]">
                                                <input
                                                    type="checkbox"
                                                    checked={borradorPatron[c]?.includes(d) || false}
                                                    onChange={(e) => handleBorradorCheckbox(c, d, e.target.checked)}
                                                    className="w-4 h-4 cursor-pointer accent-[#378ADD]"
                                                />
                                                {nombreDia}
                                            </label>
                                        ))}
                                    </div>
                                    <div className={`text-xs text-right min-w-[85px] ${diasSeleccionados === 0 ? 'text-[#A32D2D] font-bold' : 'text-[#6b6b6b]'}`}>
                                        {diasSeleccionados} día{diasSeleccionados !== 1 ? 's' : ''} libre{diasSeleccionados !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                            type="button"
                            onClick={aplicarCiclos}
                            className="p-2 px-4 bg-[#378ADD] text-white font-semibold text-sm rounded-lg hover:bg-[#2a6dae]"
                        >
                            Aplicar cambios
                        </button>
                        <button
                            type="button"
                            onClick={restaurarCiclosDefecto}
                            className="p-2 px-4 bg-white border border-gray-300 text-[#1a1a1a] font-semibold text-sm rounded-lg hover:bg-gray-50"
                        >
                            Restaurar valores por defecto
                        </button>
                    </div>
                </div>
            )}

            {/* ── CUADRÍCULA DE MÉTRICAS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#f5f5f5] to-[#efefef] p-4 rounded-lg border border-gray-200 shadow-sm text-center md:text-left min-w-0">
                    <div className="text-2xl md:text-3xl font-bold leading-none mb-2">{totalActivos}/{numEmp}</div>
                    <div className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6b6b6b] uppercase">Empleados activos</div>
                </div>
                <div className="bg-gradient-to-br from-[#f5f5f5] to-[#efefef] p-4 rounded-lg border border-gray-200 shadow-sm text-center md:text-left min-w-0">
                    <div className="text-2xl md:text-3xl font-bold leading-none mb-2">{metrics.max}</div>
                    <div className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6b6b6b] uppercase">Máximo diario</div>
                </div>
                <div className="bg-gradient-to-br from-[#f5f5f5] to-[#efefef] p-4 rounded-lg border border-gray-200 shadow-sm text-center md:text-left min-w-0">
                    <div className="text-2xl md:text-3xl font-bold leading-none mb-2">{metrics.min}</div>
                    <div className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6b6b6b] uppercase">Mínimo diario</div>
                </div>
                <div className="bg-gradient-to-br from-[#f5f5f5] to-[#efefef] p-4 rounded-lg border border-gray-200 shadow-sm text-center md:text-left min-w-0">
                    <div className="text-2xl md:text-3xl font-bold leading-none mb-2">{metrics.pctDeseq}%</div>
                    <div className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6b6b6b] uppercase">Desequilibrio</div>
                </div>
            </div>

            {/* ── LEYENDA GENERAL ── */}
            <div className="flex flex-wrap gap-4 p-4 bg-[#fafafa] rounded-lg mb-6 text-xs sm:text-sm text-[#6b6b6b]">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#1D9E75] flex-shrink-0" />Alta cobertura (≥75%)</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#378ADD] flex-shrink-0" />Normal (60–74%)</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#EF9F27] flex-shrink-0" />Ajustada (45–59%)</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#E24B4A] flex-shrink-0" />Crítica (&lt;45%)</span>
            </div>

            {/* ── CUADRÍCULA CALENDARIO SEMANAL DE ROTACIÓN ── */}
            <p className="text-sm font-semibold tracking-wider text-[#1a1a1a] uppercase mb-3">
                {diasTotales} días — {numCiclos} semanas de rotación
            </p>

            <div className="flex flex-col gap-[1px] mb-8 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Fila Cabecera */}
                <div className="grid grid-cols-[28px_repeat(7,_1fr)] sm:grid-cols-[50px_repeat(7,_1fr)] gap-[1px] bg-white items-center text-center">
                    <div className="text-[10px] sm:text-xs font-semibold text-[#6b6b6b] bg-[#fafafa] py-2" />
                    {DIAS_NOMBRES.map((d, i) => (
                        <div key={i} className="text-[9px] sm:text-xs font-semibold text-[#6b6b6b] bg-[#fafafa] py-2 truncate px-0.5">{d}</div>
                    ))}
                </div>

                {/* Filas de Datos Semanales */}
                {matrizDatos.map((semana, sIdx) => (
                    <div key={sIdx} className="grid grid-cols-[28px_repeat(7,_1fr)] sm:grid-cols-[50px_repeat(7,_1fr)] gap-[1px] bg-white items-center">
                        <div className="text-[9px] sm:text-xs font-semibold text-[#6b6b6b] text-center bg-[#fafafa] py-3">S{sIdx + 1}</div>
                        {semana.map((dia, dIdx) => {
                            const pct = dia.total > 0 ? dia.trabajando / dia.total : 0;
                            const claseColor = getColorClase(pct);

                            if (vistaMode === 'cobertura') {
                                return (
                                    <div
                                        key={dIdx}
                                        className={`flex flex-col justify-center items-center py-2 min-h-[42px] sm:min-h-[50px] transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${claseColor}`}
                                        title={`${DIAS_FULL[dIdx]} semana ${sIdx + 1}: ${dia.trabajando} trabajando, ${dia.libran} librando`}
                                    >
                                        <span className="text-xs sm:text-base font-bold">{dia.trabajando}</span>
                                        <span className="text-[8px] sm:text-[11px] opacity-90">{Math.round(pct * 100)}%</span>
                                    </div>
                                );
                            } else {
                                const bgLibra = dia.libran > 0 ? 'bg-[#E24B4A] text-[#501313]' : 'bg-[#1D9E75] text-[#04342C]';
                                return (
                                    <div
                                        key={dIdx}
                                        className={`flex flex-col justify-center items-center py-2 min-h-[42px] sm:min-h-[50px] text-[10px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${bgLibra}`}
                                        title={`${DIAS_FULL[dIdx]} semana ${sIdx + 1}: libran ${dia.libran} emp`}
                                    >
                                        <span className="text-xs sm:text-base font-bold">{dia.libran}</span>
                                        <span className="text-[8px] sm:text-[11px] font-medium">libran</span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                ))}
            </div>

            {/* ── SECCIÓN DETALLE POR EMPLEADO ── */}
            <div className="bg-[#fafafa] p-3 sm:p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold tracking-wider text-[#1a1a1a] uppercase mb-3">
                    Detalle de libranzas por empleado — {diasTotales} días
                </p>

                {/* Leyenda Detalle Ciclos */}
                <div className="flex flex-wrap gap-3 mb-4 text-[11px] sm:text-xs text-[#6b6b6b]">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#FCEBEB] border border-[#E24B4A] flex-shrink-0" />Libra (L)</span>
                    {Array.from({ length: numCiclos }).map((_, c) => {
                        const diasTxt = patron[c]?.map(d => DIAS_NOMBRES[d]).join('-') || '';
                        const color = PALETA_CICLOS[c % PALETA_CICLOS.length];
                        return (
                            <span key={c} className="flex items-center gap-1.5">
                                <span className={`w-3 h-3 rounded-sm ${color.bg} flex-shrink-0`} />
                                C{c + 1}: {diasTxt}
                            </span>
                        );
                    })}
                </div>

                {/* Grid de cuadrícula interna horizontal escroleable */}
                <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 border-y sm:border border-gray-200 rounded-md sm:rounded-md bg-white">
                    <div className="min-w-[760px] p-2 flex flex-col gap-[1px]">

                        {/* Cabecera Días */}
                        <div className="flex items-center text-center font-semibold text-[9px] text-gray-400">
                            <div className="w-[30px] flex-shrink-0" />
                            <div className={`${numEmp > 18 ? 'w-11' : 'w-14'} flex-shrink-0 text-right pr-2`} />
                            {Array.from({ length: numCiclos }).map((_, s) => (
                                <div key={s} className="flex flex-1 border-l border-gray-300">
                                    {DIAS_NOMBRES.map((d, dIdx) => (
                                        <div key={dIdx} className="flex-1 text-center py-1">{d}</div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Cabecera Semanas */}
                        <div className="flex items-center text-center font-bold text-[10px] text-gray-600 mb-1">
                            <div className="w-[30px] flex-shrink-0" />
                            <div className={`${numEmp > 18 ? 'w-11' : 'w-14'} flex-shrink-0`} />
                            {Array.from({ length: numCiclos }).map((_, s) => (
                                <div key={s} className="flex-1 mx-[1px] bg-gray-100 rounded text-center py-0.5 border-l border-gray-300">
                                    S{s + 1}
                                </div>
                            ))}
                        </div>

                        {/* Lista Filas Empleados */}
                        {Array.from({ length: numEmp }).map((_, ei) => {
                            const offset = ei % numCiclos;
                            const colorCicloBase = PALETA_CICLOS[offset % PALETA_CICLOS.length];
                            const estaActivo = empleadosActivos[ei] ?? true;

                            const esFilaGrupo = ei > 0 && ei % numCiclos === 0;

                            return (
                                <div
                                    key={ei}
                                    className={`flex items-center h-6 ${!estaActivo ? 'opacity-40' : ''} ${esFilaGrupo ? 'border-t-2 border-gray-300 mt-0.5 pt-0.5' : ''}`}
                                >
                                    {/* Checkbox Activo */}
                                    <div className="w-[30px] flex justify-center flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={estaActivo}
                                            onChange={() => toggleEmpleadoActivo(ei)}
                                            className="w-4 h-4 cursor-pointer accent-[#378ADD]"
                                        />
                                    </div>

                                    {/* Nombre Empleado */}
                                    <div className={`${numEmp > 18 ? 'w-11 text-[10px]' : 'w-14 text-xs'} font-semibold text-[#6b6b6b] text-right pr-2 flex-shrink-0 flex items-center justify-end gap-1`}>
                                        <span className={`inline-block w-2 h-2 rounded-sm ${colorCicloBase.bg} flex-shrink-0`} />
                                        <span className={!estaActivo ? 'line-through' : ''}>
                                            Emp {String(ei + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Celdas Semanales (T / L) */}
                                    {Array.from({ length: numCiclos }).map((_, s) => {
                                        const cicloActual = (offset + s) % numCiclos;
                                        const diasLibra = patron[cicloActual] || [];
                                        const colorActual = PALETA_CICLOS[cicloActual % PALETA_CICLOS.length];

                                        return (
                                            <div key={s} className="flex flex-1 items-center h-full border-l border-gray-200">
                                                {DIAS_NOMBRES.map((_, d) => {
                                                    const libra = diasLibra.includes(d);
                                                    return (
                                                        <div
                                                            key={d}
                                                            className={`flex-1 mx-[1px] h-[22px] text-[10px] font-bold text-center flex items-center justify-center rounded-sm transition-opacity`}
                                                            style={{
                                                                backgroundColor: libra ? '#FCEBEB' : colorActual.hex,
                                                                color: libra ? '#A32D2D' : '#FFFFFF',
                                                                opacity: libra ? 1 : 0.85
                                                            }}
                                                            title={`Emp ${String(ei + 1).padStart(2, '0')} — ${DIAS_FULL[d]} S${s + 1}: ${libra ? 'LIBRA' : `Trabaja (C${cicloActual + 1})`}`}
                                                        >
                                                            {libra ? 'L' : 'T'}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </div>
    );
}