import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useEmployees } from '@/Hooks/useEmployees';
import { usePrefetchEmployeeData } from '@/Hooks/usePrefetchEmployeeData';
import { AuthContext } from '@/timeTrack/context/AuthContext';
import { EmployeeDataSection } from '../formComponents/EmployeeDataSection';
import { EmployeeManagementModal } from '../formComponents/modals/EmployeeManagementModal';
import { PublicHolidaysModal } from '../formComponents/modals/PublicHolidaysModal';

export const Add = () => {
  const { auth } = useContext(AuthContext);
  const isDemo = auth?.token === "demo-token-12345";

  const { allEmployees } = useEmployees();
  const { prefetchEmployeeData } = usePrefetchEmployeeData();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showHolidaysModal, setShowHolidaysModal] = useState(false);

  // En modo demo, seleccionar automáticamente el primer empleado
  useEffect(() => {
    if (isDemo && allEmployees.length > 0 && !selectedEmployeeId) {
      const demoEmployeeId = allEmployees[0].id.toString();
      setSelectedEmployeeId(demoEmployeeId);
      prefetchEmployeeData(demoEmployeeId);
    }
  }, [isDemo, allEmployees, selectedEmployeeId, prefetchEmployeeData]);

  // Memoizar el empleado seleccionado
  const selectedEmployee = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return allEmployees.find(emp => emp.id.toString() === selectedEmployeeId.toString());
  }, [selectedEmployeeId, allEmployees]);

  const handleEmployeeChange = useCallback((employeeId) => {
    setSelectedEmployeeId(employeeId);
    // Hacer prefetch de todos los datos cuando se selecciona un empleado
    prefetchEmployeeData(employeeId);
  }, [prefetchEmployeeData]);

  return (
    <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-2/3 mx-auto mt-8 animate-fade-in">
      {/* Banner de Modo Demo */}
      {isDemo && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg border border-blue-600 shadow-lg">
          <p className="text-white font-semibold text-center">
            🎯 Modo Demo - Datos de ejemplo cargados automáticamente
          </p>
        </div>
      )}

      <div className="border rounded-lg shadow-md p-6">

        {/* SECCIÓN: Selector de Empleado + Botones de Acción */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="employee-select" className="block text-sm font-semibold text-gray-900">
              Seleccionar Empleado
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmployeeModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Empleado
              </button>

              <button
                onClick={() => setShowHolidaysModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                <span>🎉</span>
                Festivos
              </button>
            </div>
          </div>

          <select
            id="employee-select"
            value={selectedEmployeeId || ''}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
          >
            <option value="">-- Seleccione un empleado --</option>
            {allEmployees.map(employee => (
              <option key={employee.id} value={employee.id.toString()}>
                {employee.name} {employee.lastName} - {employee.email}
              </option>
            ))}
          </select>
        </div>

        {/* SECCIÓN: Información del Empleado */}
        {selectedEmployee && (
          <>
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedEmployee.name} {selectedEmployee.lastName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{selectedEmployee.email}</p>
              {selectedEmployee.hireDate && (
                <p className="text-sm text-gray-600">
                  Fecha de ingreso: {new Date(selectedEmployee.hireDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* SECCIÓN: Accordion con datos del empleado */}
            <EmployeeDataSection
              employeeId={selectedEmployee.id}
              allEmployees={allEmployees}
              employeeData={selectedEmployee}
            />
          </>
        )}

        {!selectedEmployee && (
          <div className="pt-6 text-center text-gray-500">
            Selecciona un empleado para ver sus datos
          </div>
        )}
      </div>

      {/* Modales */}
      <EmployeeManagementModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        onEmployeeCreated={() => {
          // Refrescar lista de empleados si es necesario
        }}
        allEmployees={allEmployees}
      />

      <PublicHolidaysModal
        isOpen={showHolidaysModal}
        onClose={() => setShowHolidaysModal(false)}
      />
    </div>
  )
}
