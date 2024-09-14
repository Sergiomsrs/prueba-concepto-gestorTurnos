import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { formatTime } from "../utils/function";

export const RDias = () => {
  const { data, selectedOption } = useContext(AppContext);

  useEffect(() => {
  }, [data]);

  const dataWeek = useMemo(() => data.slice(1, data.length), [data]);

  const empleados = useMemo(() => {
    if (dataWeek.length > 0) {
      return dataWeek[0].employees;
    }
    return [];
  }, [dataWeek]);

  return (
    <div className="overflow-x-auto mt-4">
      <table className="table table-hover text-center">
        <thead>
          <tr>
            {dataWeek.map((item) => (
              <th key={item.id}>{item.day.charAt(0).toUpperCase() + item.day.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => {
            const employeeData = dataWeek[0]?.employees.find((e) => e.name === empleado.name);
            if (selectedOption === "todos" || selectedOption === employeeData?.teamWork) {
              return (
                <tr key={empleado.name}>
                  {dataWeek.map((item) => (
                    <td key={item.id}>
                      {formatTime(item.employees.find((e) => e.name === empleado.name)?.shiftDuration)}
                    </td>
                  ))}
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
};


