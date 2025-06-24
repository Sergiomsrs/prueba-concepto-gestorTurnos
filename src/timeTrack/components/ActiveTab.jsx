
export const ActiveTab = ({activeTab, setActiveTab}) => {
  
  
  return (
    <div className="rounded-lg border border-indigo-200 bg-white p-4 w-fit mx-4 flex flex-row md:flex-col h-fit gap-4 mb-4">
   
   <div
  onClick={() => setActiveTab("list")}
  className={`cursor-pointer rounded-md px-4 py-2 text-xs sm:text-sm font-medium md:text-base lg:px-6 transition-all duration-300 ${
    activeTab === "list"
      ? "bg-indigo-600 text-white shadow-md"
      : activeTab === "form"
      ? "bg-white text-indigo-600 hover:bg-indigo-50"
      : activeTab === "hourly"
      ? "bg-white text-indigo-600 border-2 border-indigo-600" 
      : "bg-white text-indigo-600 hover:bg-indigo-50"
  }`}
>
  Lista de Empleados
</div>
    <div
      onClick={() => setActiveTab("form")}
      className={`cursor-pointer rounded-md px-4 py-2 text-xs sm:text-sm font-medium md:text-base lg:px-6 transition-all duration-300 ${
        activeTab === "form"
          ? "bg-indigo-600 text-white shadow-md"
          : "bg-white text-indigo-600 hover:bg-indigo-50"
      }`}
    >
      Añadir Empleado
    </div>
  </div>
  )
}
