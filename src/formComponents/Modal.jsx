export const Modal = ({ isOpen, onClose, employee, day }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no lo renderizamos

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles del Empleado</h2>
        <p>Empleado: {employee.name}</p>
        <p>Equipo de trabajo: {employee.teamWork}</p>
        <p>Día: {formatDate(day)}</p> {/* Formatea el día según lo necesites */}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};