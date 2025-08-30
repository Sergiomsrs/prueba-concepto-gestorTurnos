export const Modal = ({ username, teamWork, handleCloseModal, id }) => {
  return (


    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Detalles de {username}</h2>

        <div className=''>

          <p>ID: {id}</p>
          <p>Equipo: {teamWork}</p>
          <input type="color" placeholder="Comentarios" />
        </div>

        <div>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleCloseModal}
          >
            Cerrar
          </button>
        </div>
      </div>

    </div>



  )
}
