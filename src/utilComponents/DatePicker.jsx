export const DatePicker = ({ date, setDate, onSearch }) => {
  const handleChange = (event, type) => {
    const newValue = event.target.value;
    if (type === "start") {
      setDate({ ...date, start: newValue });
    } else if (type === "end") {
      setDate({ ...date, end: newValue });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full">

      {/* Fecha inicio */}
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-medium text-gray-500">Fecha inicio</label>
        <input
          name="start"
          type="date"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={date.start}
          onChange={(event) => handleChange(event, "start")}
        />
      </div>

      {/* Separador */}
      <span className="hidden sm:block text-gray-300 pb-2">—</span>

      {/* Fecha fin */}
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-medium text-gray-500">Fecha fin</label>
        <input
          name="end"
          type="date"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={date.end}
          onChange={(event) => handleChange(event, "end")}
        />
      </div>

      {/* Botón */}
      <button
        onClick={onSearch}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors sm:mb-0"
      >
        Obtener
      </button>

    </div>
  );
};