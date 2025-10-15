import { useEffect, useReducer, useMemo } from "react";
import { useRoster } from "../roster/hooks/useRoster";
import { rosterReducer } from "../roster/reducers/rosterReducer";
import { DistributionBar } from "../gridComponents/DistributionBar";
const API_URL = import.meta.env.VITE_API_URL;

export const RosterPage = () => {
    const { getRosterBetweenDates, apiData, saveData } = useRoster();
    const [data, dispatch] = useReducer(rosterReducer, []);

    const modifiedData = useMemo(() =>
        data.flatMap(day =>
            day.employees
                .filter(emp => emp.isModified)
                .map(emp => ({
                    employeeId: emp.id,
                    date: day.id,
                    hours: emp.workShift,
                    shiftDuration: emp.shiftDuration,
                }))
        ), [data]
    );

    useEffect(() => {
        getRosterBetweenDates("2025-09-15", "2025-09-16");
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
            // Opcional: hacer algo más después de guardar
        } else {
            console.error("Error al guardar:", result.message);
        }
    };


    return (
        <section>
            <header>ShiftBoardPage</header>
            <main>
                {data.map((day, dayIndex) => (
                    <div key={day.id}>
                        <h1>
                            {day.id} <span>{day.day?.toUpperCase()}</span>
                        </h1>

                        {day.employees?.map((employee, employeeIndex) => (
                            <div key={employee.id}>
                                <div className="flex flex-row gap-2">
                                    <p>{employee.name}</p>
                                    <p>{employee.teamWork}</p>

                                    {employee.workShift?.map((WSH, wsI) => (
                                        <input
                                            key={wsI}
                                            type="checkbox"
                                            checked={WSH === "WORK"}
                                            onChange={() =>
                                                dispatch({
                                                    type: "UPDATE_SHIFT",
                                                    payload: { dayIndex, employeeIndex, hourIndex: wsI },
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <DistributionBar day={day} />
                    </div>
                ))}
            </main>
            <footer>
                <button onClick={handleSaveData}>
                    enviar
                </button>
            </footer>
        </section>
    );
};