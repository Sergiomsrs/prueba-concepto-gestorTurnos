export const OptionsPicker = ({ value, onChange }) => {
    return (
        <select
            id="cycle"
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition min-w-[120px]"
        >
            <option value="">Ciclo</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
            ))}
        </select>
    );
};
