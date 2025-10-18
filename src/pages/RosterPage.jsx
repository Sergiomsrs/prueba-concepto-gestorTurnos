import { useEffect, useReducer, useMemo, useRef } from "react";
import { useRoster } from "../roster/hooks/useRoster";
import { rosterReducer } from "../roster/reducers/rosterReducer";
import { DistributionRow } from "../roster/components/DistributionRow";
import { HeadRow } from "../roster/components/HeadRow";
import { EmployeeRow } from "../roster/components/EmployeeRow";
import { RosterRangeSummary } from "../roster/components/RosterRangeSummary";

export const RosterPage = () => {
    const { getRosterBetweenDates, apiData, saveData } = useRoster();
    const [data, dispatch] = useReducer(rosterReducer, []);
    const inputRefsMatrix = useRef([]); // ✅ Referencias para navigation con teclado
    const focusMatrixRef = useRef([]);


    // ✅ Calcular empleados modificados
    const modifiedData = useMemo(
        () =>
            data.flatMap((day) =>
                day.employees
                    .filter((emp) => emp.isModified)
                    .map((emp) => ({
                        employeeId: emp.id,
                        date: day.id,
                        hours: emp.workShift,
                        shiftDuration: emp.shiftDuration,
                    }))
            ),
        [data]
    );

    useEffect(() => {
        getRosterBetweenDates("2025-09-01", "2025-09-30");
    }, [getRosterBetweenDates]);

    useEffect(() => {
        if (apiData.length > 0) {
            dispatch({ type: "SET_ROSTER", payload: apiData.slice(1) });
        }
    }, [apiData]);

    const handleSaveData = async () => {
        const result = await saveData(modifiedData);
        if (result.success) {
            console.log("Datos guardados exitosamente");
        } else {
            console.error("Error al guardar:", result.message);
        }
    };

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">ShiftBoardPage</h1>
            </header>

            <main className="space-y-8 max-w-[1800px] mx-auto">
                {data.map((day, dayIndex) => (
                    <div key={day.id} className="bg-gray-50 rounded-lg shadow-sm border overflow-hidden p-4">
                        {/* Header del día */}
                        <div className="bg-gray-50 px-4 py-3 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {day.id} <span className="text-gray-600">{day.day?.toUpperCase()}</span>
                            </h2>
                        </div>

                        {/* Tabla de empleados */}
                        <div className="overflow-x-auto">
                            {/* ✅ Header de la tabla */}
                            <div
                                className="grid gap-px bg-gray-200 min-w-max items-center"
                                style={{
                                    gridTemplateColumns: "120px 150px repeat(62, 20px) 80px", // +80px para columna total
                                }}
                            >
                                <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-r">
                                    Equipo
                                </div>
                                <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-r">
                                    Empleado
                                </div>

                                <HeadRow />

                                <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 text-center">
                                    Horas
                                </div>
                            </div>

                            {/* ✅ Filas de empleados */}
                            {day.employees?.map((employee, employeeIndex) => (
                                <div
                                    key={employee.id}
                                    className={`grid gap-px bg-gray-200 min-w-max hover:bg-gray-50 ${employee.isModified ? "bg-yellow-50" : ""
                                        }`}
                                    style={{ gridTemplateColumns: "120px 150px repeat(62, 20px) 80px" }}
                                >
                                    <EmployeeRow
                                        employee={employee}
                                        dayIndex={dayIndex}
                                        employeeIndex={employeeIndex}
                                        numRows={day.employees.length}
                                        numDays={data.length}          // ← aquí estaba el error
                                        inputRefsMatrix={inputRefsMatrix}
                                        dispatch={dispatch}
                                    />
                                </div>
                            ))}

                            {/* ✅ Distribution Row */}
                            <div
                                className="grid gap-px bg-gray-200 min-w-max border-t-2 border-gray-400"
                                style={{ gridTemplateColumns: "120px 150px repeat(62, 20px) 80px" }}
                            >
                                <DistributionRow day={day} />
                            </div>
                        </div>
                    </div>
                ))}
                <RosterRangeSummary data={data} />
            </main>


            <footer className="mt-8 flex justify-center">
                <button
                    onClick={handleSaveData}
                    disabled={modifiedData.length === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${modifiedData.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        }`}
                >
                    Guardar Cambios {modifiedData.length > 0 && `(${modifiedData.length})`}
                </button>
            </footer>
        </section>
    );
};
