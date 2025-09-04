

export const GenerateShift = () => {

    const hours = ["Work", "Work", "Work", "Work"]




    return (
        <div className="bg-gray-50 h-full">
            <div className="mx-auto max-w-2xl px-2 lg:max-w-7xl lg:px-8 mt-16"></div>
            <div>
                <>
                    <td
                        className="sm:text-base text-sm font-semibold text-gray-800 whitespace-nowrap max-w-none">
                        <button className="mr-2 py-0" >Turno 1</button>
                    </td>
                    {hours && hours.map((value, index) => (
                        <td
                            className={`relative md:w-24 w-12 text-center align-middle py-0 ${index % 4 === 3 ? 'border-45-height' : ''}`}
                            key={index}
                        >
                            <input
                                type="checkbox"
                                className={`sm:w-4 sm:h-4 w-3 h-3 p-0 m-0 appearance-none border align-middle border-gray-400 rounded-3xl relative`}
                            />
                            {index % 4 === 3 && (
                                <div className="absolute right-0 top-1/2 h-1/2 bg-slate-400" style={{ zIndex: -1, width: 1 }}></div>
                            )}
                        </td>
                    ))}

                </>

            </div>
        </div>

    )
}
