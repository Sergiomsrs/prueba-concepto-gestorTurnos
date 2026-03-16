import { useContext, useEffect, useState } from 'react';
import { filterAndMapRecords } from '../utilities/timeManagement';
import { AuthContext } from '../context/AuthContext';
import { ConfirmModal } from './ConfirmationModal';
import { axiosClient } from '@/services/axiosClient';

const API_URL = import.meta.env.VITE_API_URL;

export const Modal = ({ isOpen, setIsOpen, employeeId, selectedDayRecords, records, setRecords }) => {

  const { auth } = useContext(AuthContext);

  const [isConOpen, setIsConOpenModal] = useState(false);
  const [recordToOperate, setRecordToOperate] = useState(null);
  const [action, setAction] = useState(null);
  const [message, setMessage] = useState(null);



  const [editableRecords, setEditableRecords] = useState([]);
  const [dayRecords, setDayRecords] = useState({
    id: null,
    data: {
      day: '',
      periods: [],
      totalWorked: '',
      recordsCount: 0,
      warning: null
    }
  });


  // Si selectedDayRecords es null o undefined, no se hace nada
  // Carga la informacion de selectedDayRecords en day records
  useEffect(() => {
    if (isOpen && selectedDayRecords?.data) {
      setDayRecords(selectedDayRecords.data);
    }
  }, [isOpen, selectedDayRecords?.data]);


  // Filtra los record y rellena editableRecords con los registros del dia seleccionado
  useEffect(() => {
    if (isOpen && dayRecords?.day && records?.length) {
      const filtered = filterAndMapRecords(records, dayRecords.day);
      setEditableRecords(filtered);
    }
  }, [isOpen, dayRecords?.day, records]);

  // Si el modal no está abierto o no hay registros del día, no renderiza nada
  if (!isOpen || !dayRecords) return null;

  // Maneja los imput de tiempo y los guarda en editableRecords
  const handleTimeChange = (index, newTime) => {
    const updatedRecords = [...editableRecords];
    const record = updatedRecords[index];

    if (!newTime.match(/^\d{2}:\d{2}$/)) return;

    const [hours, minutes] = newTime.split(':');
    const newTimestamp = `${record.dateStr}T${hours}:${minutes}:00.000`;


    updatedRecords[index] = {
      ...record,
      timestamp: newTimestamp,
      time: newTime,
    };

    setEditableRecords(updatedRecords);
  };


  // Funcion para guardar o actualizar un registro
  const handleSaveRecord = async (recordId) => {
    // 1. Localizar el registro
    const recordToSave = editableRecords.find(r => r.id === recordId);
    if (!recordToSave) return alert("No se encontró el registro.");

    const isNew = String(recordId).startsWith('temp');

    try {
      // 2. Ejecutar la petición con Axios
      const payload = {
        employeeId: isNew ? recordToSave.employeeId : "",
        timestamp: recordToSave.timestamp,
        isMod: "true",
      };

      // Usamos el método correspondiente según si es nuevo o existente
      const response = isNew
        ? await axiosClient.post('/timestamp/timestamp', payload)
        : await axiosClient.patch(`/timestamp/${recordId}`, payload);

      // 3. Preparar el objeto para la interfaz
      // Nota: Si el backend devuelve el ID real al crear, podrías usar response.data.id
      const updatedRecord = {
        employeeId: recordToSave.employeeId,
        timestamp: recordToSave.timestamp,
        id: isNew && response.data.id ? response.data.id : recordId,
        isMod: "true",
      };

      // 4. Actualizar estados (Lógica original intacta)

      // Eliminar de la lista de edición
      setEditableRecords(prev => prev.filter(r => r.id !== recordId));

      if (isNew) {
        // Si el registro es nuevo, lo añadimos a la lista principal
        setRecords(prev => [...prev, updatedRecord]);
      } else {
        // Si es modificado, actualizamos el existente en la lista principal
        setRecords(prev => prev.map(r => (r.id === recordId ? updatedRecord : r)));
      }

    } catch (err) {
      // Axios guarda el error de respuesta en err.response
      const errorMessage = err.response?.data?.message || err.message || "Error al guardar";
      console.error("Error al guardar:", err);
      alert(errorMessage);
    } finally {
      // Esto se ejecuta siempre, equivaliendo al final de tu función
      setIsOpen(false);
    }
  };

  const onOpenModal = (id, action) => {

    setRecordToOperate(id);
    setIsConOpenModal(true);
    setAction(action);
    setMessage(action == "delete" ? "¿Estás seguro de que deseas eliminar este registro?" : "¿Estás seguro de que deseas guardar este registro?");
  }

  const onConfirmDelete = () => {
    handleDeleteRecord(recordToOperate);
    setRecordToOperate(null);
    setIsConOpenModal(false);
  }
  const onCancel = () => {
    setRecordToOperate(null);
    setIsConOpenModal(false);
  }

  const onConfirmSave = () => {
    handleSaveRecord(recordToOperate);
    setRecordToOperate(null);
    setIsConOpenModal(false);
  }


  const handleDeleteRecord = async (recordId) => {
    // 1. Manejo de registros temporales (Local)
    if (String(recordId).startsWith('temp')) {
      setEditableRecords(prev => prev.filter(r => r.id !== recordId));
      setRecords(prev => prev.filter(r => r.id !== recordId));
      setIsOpen(false);
      return;
    }

    // 2. Manejo de registros persistidos (API)
    try {
      // Axios lanza automáticamente el error si la respuesta no es 2xx
      await axiosClient.delete(`/timestamp/${recordId}`);

      // Si la petición tiene éxito, actualizamos los estados
      setEditableRecords(prev => prev.filter(r => r.id !== recordId));
      setRecords(prev => prev.filter(r => r.id !== recordId));

      setIsOpen(false);
    } catch (err) {
      // Accedemos al mensaje de error del servidor de forma segura
      const errorMessage = err.response?.data?.message || err.message || "Error al eliminar el registro";
      console.error("Error al eliminar:", err);
      alert(errorMessage);
    }
  };

  const methods = () => {
    if (action === "save") onConfirmSave()
    if (action === "delete") onConfirmDelete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/80"
        onClick={() => setIsOpen(false)}
      />

      <ConfirmModal isOpen={isConOpen} onConfirm={methods} onCancel={onCancel} message={message} />


      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">Detalles del día</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha:</p>
                <p className="text-base font-semibold">{dayRecords?.day}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total trabajado:</p>
                <p className="text-base font-semibold">{dayRecords?.totalWorked}</p>
              </div>
            </div>

            <h4 className="text-lg font-medium">Turnos:</h4>
            <div className="space-y-3">
              {dayRecords?.periods?.map((period, index) => (
                <div key={index} className={`p-3 rounded-lg ${!period.isComplete ? 'bg-amber-50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Turno {index + 1}</span>
                    {!period.isComplete && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        Falta salida
                      </span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div><p className="text-gray-500">Entrada:</p><p>{period.entry}</p></div>
                    <div><p className="text-gray-500">Salida:</p><p>{period.exit || '--'}</p></div>
                    <div><p className="text-gray-500">Duración:</p><p>{period.durationMs > 0 ? `${Math.floor(period.durationMs / 3600000)}h ${Math.floor((period.durationMs % 3600000) / 60000)}m` : '--'}</p></div>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-lg font-medium mt-6">Registros del día:</h4>
            <div className="space-y-2 w-fit">
              {editableRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div className="w-full">
                    <div className="text-sm text-gray-500  flex justify-between">
                      <span>Fecha: {record.dateStr}</span>

                      <button
                        onClick={() => onOpenModal(record.id, "delete")}
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300shadow-lg shadow-red-500/50 font-medium rounded-lg text-sm px-2 py-1 text-center me-0 mb-0 cursor-pointer"
                      >X</button>


                    </div>
                    <div className="flex items-center gap-6 mt-1">
                      <input
                        type="time"
                        value={record.time}
                        onChange={e => handleTimeChange(index, e.target.value)}
                        className="w-fit px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white  text-gray-900 "
                      />
                      <button
                        onClick={() => onOpenModal(record.id, "save")}
                        className="w-full  px-4 py-2 rounded-md font-semibold text-sm transition bg-indigo-600 hover: bg-indigo-500 text-white cursor-pointer "
                      >Guardar</button>


                    </div>
                  </div>
                </div>
              ))}
              {/* 
              <button
                onClick={handleAddRecord}
                className="mt-3 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow transition duration-150"
              >
                + Añadir nuevo registro
              </button>
              */}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

