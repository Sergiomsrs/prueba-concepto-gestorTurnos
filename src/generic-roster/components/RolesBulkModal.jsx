import { useState } from "react";

const DEFAULT_ROW = { prefijo: "", horas: 18, equipo: "", cantidad: 1 };

export const RolesBulkModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [rows, setRows] = useState([{ ...DEFAULT_ROW }]);

    if (!isOpen) return null;

    const handleChange = (index, field, value) => {
        setRows(prev => prev.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        ));
    };

    const handleAddRow = () => setRows(prev => [...prev, { ...DEFAULT_ROW }]);

    const handleRemoveRow = (index) => {
        if (rows.length === 1) return; // mínimo una fila
        setRows(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Construir el array de roles a enviar
        const rolesToSave = [];
        rows.forEach(({ prefijo, horas, equipo, cantidad }) => {
            if (!prefijo || !equipo || cantidad < 1) return;
            for (let i = 1; i <= Number(cantidad); i++) {
                rolesToSave.push({
                    name: `${prefijo} ${i}`,
                    wwh: Number(horas),
                    teamwork: equipo,
                    active: true
                });
            }
        });

        if (rolesToSave.length === 0) return;
        onConfirm(rolesToSave);
    };

    const totalRoles = rows.reduce((acc, row) => acc + (Number(row.cantidad) || 0), 0);

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Crear Roles Genéricos</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Se crearán <span className="font-semibold text-blue-600">{totalRoles}</span> roles en total
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabla editable */}
                <div className="overflow-y-auto px-6 py-4 flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                                <th className="text-left pb-2">Prefijo</th>
                                <th className="text-left pb-2">Horas (WWH)</th>
                                <th className="text-left pb-2">Equipo</th>
                                <th className="text-left pb-2">Cantidad</th>
                                <th className="pb-2" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td className="py-2 pr-2">
                                        <input
                                            type="text"
                                            placeholder="T-39"
                                            value={row.prefijo}
                                            onChange={e => handleChange(index, "prefijo", e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <input
                                            type="number"
                                            min={1}
                                            max={40}
                                            value={row.horas}
                                            onChange={e => handleChange(index, "horas", e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <input
                                            type="text"
                                            placeholder="black"
                                            value={row.equipo}
                                            onChange={e => handleChange(index, "equipo", e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <input
                                            type="number"
                                            min={1}
                                            max={50}
                                            value={row.cantidad}
                                            onChange={e => handleChange(index, "cantidad", e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <button
                                            onClick={() => handleRemoveRow(index)}
                                            disabled={rows.length === 1}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Añadir fila */}
                    <button
                        onClick={handleAddRow}
                        className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        <span className="text-lg leading-none">+</span> Añadir grupo
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || totalRoles === 0}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isLoading || totalRoles === 0
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            }`}
                    >
                        {isLoading ? "⏳ Creando..." : `✅ Crear ${totalRoles} roles`}
                    </button>
                </div>
            </div>
        </div>
    );
};