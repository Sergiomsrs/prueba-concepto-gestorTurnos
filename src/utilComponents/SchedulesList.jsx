import { formatMillisecondsToTime } from "../timeTrack/utilities/timeManagement"

export const SchedulesList = ({processedRecords}) => {
    return (
        <table className="w-full">
            <tbody className="divide-y divide-gray-200">
                {processedRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap">
                            {record.data.day}
                            {record.data.warning && (
                                <span className="block text-xs text-yellow-600 mt-1">{record.data.warning}</span>
                            )}
                        </td>
                        <td className="py-3 px-4">
                            {record.data.periods.map((period, i) => (
                                <div
                                    key={i}
                                    className={`mb-2 last:mb-0 ${!period.isComplete ? 'text-amber-600' : ''}`}
                                >
                                    <span className="flex items-center gap-1 text-sm flex-wrap">
                                        <span className="inline-flex">
                                            <span
                                                className={`font-medium px-1 rounded ${period.entryIsMod === "true"
                                                    ? 'border border-red-500 text-red-700'
                                                    : ''
                                                    }`}
                                            >
                                                {period.entry}
                                            </span>
                                        </span>

                                        <span className="text-gray-500 mx-1 ">→</span>
                                        {period.exit ? (
                                            <>


                                                <span className="inline-flex">
                                                    <span
                                                        className={`font-medium px-1 rounded ${period.exitIsMod === "true"
                                                            ? 'border border-red-500 text-red-700'
                                                            : ''
                                                            }`}
                                                    >
                                                        {period.exit}
                                                    </span>
                                                </span>

                                                <span className="text-gray-500 ml-1 whitespace-nowrap">
                                                    ({formatMillisecondsToTime(period.durationMs)})
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-amber-600 font-bold ml-2">(Falta Registro)</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </td>



                        <td className="py-3 px-4 text-center font-medium">
                            {record.data.totalWorked}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-500">
                            {record.data.recordsCount}
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    )
}
