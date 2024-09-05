import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const RDias = () => {
  const { data } = useContext(AppContext);
  const dataWeek = data.slice(1, data.length);

  const empleados = dataWeek[0].employees;



  return (
    <div className="overflow-x-auto mt-4">
      <table className="table table-hover text-center">
        <thead>
          <tr>
            {dataWeek.map((item) => (
              <th key={item.id}>{item.day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.name}
            >
              {dataWeek.map((item) => (
                <td key={item.id}
                
                >
                  {item.employees.find((e) => e.name === empleado.name)?.total}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

