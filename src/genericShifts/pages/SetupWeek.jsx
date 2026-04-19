import { useContext, useEffect, useState } from "react";
import { useCyclesGenerator } from "../../Hooks/useCyclesGenerator";
import { useEmployees } from "../../Hooks/useEmployees";
import { DateRangePicker } from "../components/DateRangePicker";
import { OptionsPicker } from "../components/OptionsPicker";
import { createRolesBulk, saveDefaultRole } from "../../services/genericShiftService";
import ConfirmButton from "@/roster/utils/ConfirmButton";
import { AuthContext } from "@/timeTrack/context/AuthContext";
import { RolesBulkModal } from "@/generic-roster/components/RolesBulkModal";

export const SetupWeek = () => {
    const {
        ciclo,
        defaultRoles,
        roles,
        isSavingCycle,
        handleCreateByGeneric,
        setCiclo,
        handleGetAllRolesWihtDefaults,
        handleToggle,
        handleDeleteRole,
    } = useCyclesGenerator();

    const { allEmployees } = useEmployees();

    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [range, setRange] = useState({ start: "", end: "" });
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isBulkLoading, setIsBulkLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        handleGetAllRolesWihtDefaults();
    }, []);

    useEffect(() => {
        if (defaultRoles?.length > 0 && selectedEmployees.length === 0) {
            setSelectedEmployees(
                defaultRoles.map(dr => ({
                    employeeId: dr.employeeId,
                    genericShiftId: dr.shiftRoleId,
                }))
            );
        }
    }, [defaultRoles]);

    // Auto-limpiar el mensaje de estado tras 3 segundos
    useEffect(() => {
        if (!saveStatus) return;
        const timer = setTimeout(() => setSaveStatus(null), 3000);
        return () => clearTimeout(timer);
    }, [saveStatus]);

    const handleSelectEmployee = (genericShiftId, employeeId) => {
        setSelectedEmployees(prev => {
            const prevObj = prev.find(sel => sel.genericShiftId === genericShiftId);
            const filtered = prev.filter(sel => sel.genericShiftId !== genericShiftId);
            if (!employeeId && prevObj?.employeeId) {
                handleSendEmployeeToApi({ employeeId: null, shiftRoleId: genericShiftId });
                return filtered;
            }
            if (!employeeId) return filtered;
            return [...filtered, { employeeId, genericShiftId }];
        });
    };

    const employeeCounts = selectedEmployees.reduce((acc, obj) => {
        if (obj.employeeId) acc[obj.employeeId] = (acc[obj.employeeId] || 0) + 1;
        return acc;
    }, {});
    const isEmployeeRepeated = (employeeId) => employeeCounts[employeeId] > 1;

    const handleGetConfig = () => {
        const config = {
            cycle: ciclo,
            startDate: range.start,
            endDate: range.end,
            selectedEmployees,
        };
        handleCreateByGeneric(config, {
            onSuccess: () => setSaveStatus('success'),
            onError: () => setSaveStatus('error'),
        });
    };

    const handleSendEmployeeToApi = async (role) => {
        const payload = {
            ...role,
            employeeId: role.employeeId === "" ? null : role.employeeId,
            shiftRoleId: role.shiftRoleId === "" ? null : role.shiftRoleId,
        };
        if (!payload.shiftRoleId) return;
        try {
            await saveDefaultRole(payload, auth.token);
        } catch (error) {
            console.error("Error enviando datos:", error);
        }
    };

    const handleBulkCreate = async (roles) => {
        setIsBulkLoading(true);
        try {
            await createRolesBulk(roles);
            await handleGetAllRolesWihtDefaults();
            setIsBulkModalOpen(false);
        } catch (error) {
            console.error("❌ Error creando roles:", error);
        } finally {
            setIsBulkLoading(false);
        }
    };

    // ── Subcomponente de feedback ─────────────────────────────────────────
    const SaveStatusBanner = () => {
        if (!saveStatus) return null;
        const isSuccess = saveStatus === 'success';
        return (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${isSuccess
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
                }`}>
                {isSuccess ? (
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {isSuccess ? "✓ Configuración guardada correctamente" : "✗ Error al guardar. Inténtalo de nuevo."}
            </div>
        );
    };

    return (
        <section className="min-h-screen bg-gray-50 pt-4 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Configurar Semana</h1>
                    <p className="text-gray-600">Configura los roles y empleados para la semana laboral</p>
                </div>

                {/* Controles */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">

                    {/* Vista móvil */}
                    <div className="sm:hidden space-y-4">
                        <button
                            onClick={handleGetAllRolesWihtDefaults}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition font-medium text-sm w-full h-[42px]"
                        >
                            <ReloadIcon /> Recargar datos
                        </button>
                        <DateRangePicker value={range} onChange={setRange} />
                        <OptionsPicker value={ciclo} onChange={setCiclo} />
                        <SaveStatusBanner />
                        <ConfirmButton
                            triggerText={isSavingCycle ? "Guardando..." : "Enviar Configuración"}
                            title="¿Confirmar envío de datos?"
                            description="Se aplicarán los cambios en el horario del trabajador seleccionado."
                            onConfirm={handleGetConfig}
                            disabled={isSavingCycle}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full h-[42px]"
                        />
                        <button
                            onClick={() => setIsBulkModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700 transition font-medium text-sm h-[42px]"
                        >
                            ➕ Crear Roles
                        </button>
                    </div>

                    {/* Vista desktop */}
                    <div className="hidden sm:flex gap-6">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rango de fechas</label>
                                <DateRangePicker value={range} onChange={setRange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ciclo</label>
                                <OptionsPicker value={ciclo} onChange={setCiclo} />
                            </div>
                            <SaveStatusBanner />
                        </div>

                        <div className="flex flex-col gap-3 w-40">
                            <button
                                onClick={handleGetAllRolesWihtDefaults}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition font-medium text-sm h-[42px]"
                            >
                                <ReloadIcon /> Recargar
                            </button>
                            <ConfirmButton
                                triggerText={isSavingCycle ? "Guardando..." : "Enviar Configuración"}
                                title="¿Confirmar envío de datos?"
                                description="Se aplicarán los cambios en el horario del trabajador seleccionado."
                                onConfirm={handleGetConfig}
                                disabled={isSavingCycle}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full h-[42px]"
                            />
                            <button
                                onClick={() => setIsBulkModalOpen(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700 transition font-medium text-sm h-[42px]"
                            >
                                ➕ Crear Roles
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vista móvil: Cards */}
                <div className="block lg:hidden space-y-4">
                    {roles.map((row) => {
                        const selectedObj = selectedEmployees.find(sel => sel.genericShiftId === row.id);
                        const selectedId = selectedObj ? selectedObj.employeeId : "";
                        const repeated = selectedId && isEmployeeRepeated(selectedId);
                        return (
                            <div key={row.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-base">{row.name}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                <span>WWH: <span className="font-medium">{row.wwh}</span></span>
                                                <span>Equipo: <span className="font-medium">{row.teamwork}</span></span>
                                            </div>
                                        </div>
                                        <ToggleSwitch checked={row.active} onChange={() => handleToggle(row.id)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Empleado asignado</label>
                                        <select
                                            className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors ${repeated ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                                            value={selectedId}
                                            onChange={e => handleSelectEmployee(row.id, Number(e.target.value))}
                                        >
                                            <option value="">Selecciona empleado</option>
                                            {allEmployees.map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.name} {emp.lastName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSendEmployeeToApi({ employeeId: selectedId, shiftRoleId: row.id })}
                                        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium"
                                    >
                                        <AssignIcon /> Guardar asignación
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteRole(row.id)}
                                        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 text-sm font-medium"
                                    >
                                        <TrashIcon /> Eliminar rol
                                    </button>
                                    {repeated && (
                                        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                                            ⚠️ Este empleado está asignado a múltiples roles
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Vista desktop: Tabla */}
                <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Nombre del Rol</th>
                                    <th className="px-6 py-4 text-left font-semibold">WWH</th>
                                    <th className="px-6 py-4 text-left font-semibold">Equipo</th>
                                    <th className="px-6 py-4 text-left font-semibold">
                                        <div className="flex items-center gap-2">
                                            Empleado
                                            <button
                                                onClick={() => setSelectedEmployees([])}
                                                className="p-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                                                type="button"
                                                aria-label="Resetear selección"
                                            >
                                                <ResetIcon size={16} />
                                            </button>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold">Activo</th>
                                    <th className="px-6 py-4 text-center font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {roles.map((row) => {
                                    const selectedObj = selectedEmployees.find(sel => sel.genericShiftId === row.id);
                                    const selectedId = selectedObj ? selectedObj.employeeId : "";
                                    const repeated = selectedId && isEmployeeRepeated(selectedId);
                                    return (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            <th className="px-6 py-4 font-medium text-gray-900 text-left">{row.name}</th>
                                            <td className="px-6 py-4">{row.wwh}</td>
                                            <td className="px-6 py-4">{row.teamwork}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        className={`border rounded-lg px-3 py-1.5 text-sm min-w-48 ${repeated ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                                                        value={selectedId}
                                                        onChange={e => handleSelectEmployee(row.id, Number(e.target.value))}
                                                    >
                                                        <option value="">Selecciona empleado</option>
                                                        {allEmployees.map(emp => (
                                                            <option key={emp.id} value={emp.id}>{emp.name} {emp.lastName}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendEmployeeToApi({ employeeId: selectedId, shiftRoleId: row.id })}
                                                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                                                        aria-label="Asignar empleado"
                                                    >
                                                        <AssignIcon />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <ToggleSwitch checked={row.active} onChange={() => handleToggle(row.id)} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteRole(row.id)}
                                                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700"
                                                        aria-label="Eliminar rol"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAB reset móvil */}
                <div className="block lg:hidden fixed bottom-4 right-4">
                    <button
                        onClick={() => setSelectedEmployees([])}
                        className="p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition"
                        aria-label="Resetear todas las selecciones"
                    >
                        <ResetIcon size={24} />
                    </button>
                </div>
            </div>

            <RolesBulkModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onConfirm={handleBulkCreate}
                isLoading={isBulkLoading}
            />
        </section>
    );
};

// ── Iconos extraídos como micro-componentes ───────────────────────────────
const ReloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
        <path d="M20 4v5h-5" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
);

const AssignIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M11.445 20.913a1.665 1.665 0 0 1 -1.12 -1.23a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.31 .318 1.643 1.79 .997 2.694" />
        <path d="M15 19l2 2l4 -4" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </svg>
);

const ResetIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 3l18 18" />
        <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l5 -4.993m2.009 -2.01l3 -3a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41c-1.417 1.431 -2.406 2.432 -2.97 3m-2.02 2.043l-4.211 4.256" />
        <path d="M18 13.3l-6.3 -6.3" />
    </svg>
);

const ToggleSwitch = ({ checked, onChange }) => (
    <label className="inline-flex items-center cursor-pointer relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors peer-checked:bg-blue-600" />
        <span className="absolute top-0.5 left-0.5 h-5 w-5 bg-white border border-gray-300 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
    </label>
);