import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { lastRecordData } from '../../utils/apiMock';
import { axiosClient } from '@/services/axiosClient';

export const LogList = () => {
    const { auth } = useContext(AuthContext);
    const [lastRecords, setLastRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchLast10Records = async () => {
            try {
                setIsLoading(true); // Aseguramos el estado de carga al empezar

                // 1. Lógica de Modo Demo / No Autenticado
                if (auth.token === "demo-token-12345" || !auth.token) {
                    setLastRecords(lastRecordData);
                    return; // El finally se encargará de setIsLoading(false)
                }

                // 2. Llamada real con Axios
                // El token y los headers ya van incluidos por el interceptor
                const response = await axiosClient.get("/schedule/last100");

                // Axios ya ha convertido el JSON, lo guardamos directamente
                setLastRecords(response.data);

            } catch (err) {
                // Manejamos el error extrayendo el mensaje del backend si existe
                const errorMsg = err.response?.data?.message || "Error al obtener los datos";
                setError(errorMsg);
                console.error("Error en fetchLast10Records:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLast10Records();
    }, [auth]);

    return (
        <div className="flex flex-col items-center w-full h-full min-h-dvh py-8">
            <div className="w-full max-w-3xl px-2 ">
                <h1 className="text-xl font-bold mb-2 text-gray-800">Últimas Notificaciones</h1>
                <p className="text-md mb-6 text-gray-600">Fichajes previstos no registrados</p>

                {isLoading ? (
                    <p className="text-gray-600">Cargando...</p>
                ) : lastRecords && lastRecords.length > 0 ? (
                    <div className="space-y-4 max-h-96">
                        {lastRecords.map((record, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {record.nombre} {record.apellido}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Fecha: <span className="text-gray-800 font-medium">{record.fecha}</span> — Hora:{" "}
                                            <span className="text-gray-800 font-medium">{record.hora}</span>
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-500 sm:text-right">
                                        <p className="font-medium">Notificado</p>
                                        <p>{new Date(record.enviadoEn).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No hay notificaciones recientes.</p>
                )}

                {error && (
                    <div className="mt-6 text-center py-4 px-6 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
