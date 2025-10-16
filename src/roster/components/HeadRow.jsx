import { hours } from "../../utils/data";


export const HeadRow = () => (
    <>


        {hours.salida.map((hour, i) => (
            <div key={i} className="text-center text-xs font-mono -ml-6">
                {i % 4 === 0 ? hour : ""}
            </div>
        ))}
    </>
);
