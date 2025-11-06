import { hours } from "../../utils/data";


export const HeadRow = () => (
    <>


        {hours.salida.map((hour, i) => (
            <div key={i} className="text-center text-sm font-mono font-bold -ml-[20px] flex items-center">
                {i % 4 === 0 ? hour : ""}
            </div>
        ))}
    </>
);
