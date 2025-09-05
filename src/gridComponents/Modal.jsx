import { EmployeeWeek } from "../pages/EmployeeWeek"

export const Modal = ({ username, teamWork, handleCloseModal, id, lastName }) => {
  return (


    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2">
          <h2 className="text-xl font-bold">Detalle de {username} {lastName}</h2>
        </div>

        <div>
          <div>
            <EmployeeWeek id={id} />
          </div>

          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleCloseModal}
          >
            Cerrar
          </button>
        </div>
      </div>

    </div>



  )
}
