import { hours } from "../../utils/data";


export const HeadRow = ({ startIndex = 0, endIndex = 97 } = {}) => {
    const visibleHours = hours.salida.slice(startIndex, endIndex);

    return (
        <>
            {visibleHours.map((hour, i) => (
                <div key={i} className="text-center text-sm font-mono font-bold -ml-[20px] flex items-center">
                    {i % 4 === 0 ? hour : ""}
                </div>
            ))}
        </>
    );
};
