import { EmployeeWeek } from "../pages/EmployeeWeek"

export const Modal = ({ username, teamWork, handleCloseModal, id, lastName }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-extrabold mb-2">
            Detalle de <span className="capitalize">{username} {lastName}</span>
          </h2>
        </div>

        <div>
          <EmployeeWeek id={id} />
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            onClick={handleCloseModal}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
