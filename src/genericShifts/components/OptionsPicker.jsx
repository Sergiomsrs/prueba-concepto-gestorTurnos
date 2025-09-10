export const OptionsPicker = ({ value, onChange }) => {
    return (
        <div>
            <label htmlFor="cycle" className="block mb-1 font-medium text-gray-700">
                Selecciona ciclo:
            </label>
            <select
                id="cycle"
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="border rounded px-3 py-2"
            >
                <option value="">-- Selecciona --</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
        </div>
    );
};
