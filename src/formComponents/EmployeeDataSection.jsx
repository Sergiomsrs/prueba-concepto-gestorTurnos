import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../components/icons/ChevronIcon';
import { WwhSection } from './sections/WwhSection';
import { PtoSection } from './sections/PtoSection';
import { TeamWorkSection } from './sections/TeamWorkSection';
import { DispSection } from './sections/DispSection';

/**
 * EmployeeDataSection
 * 
 * Componente contenedor que gestiona todas las secciones de datos del empleado
 * usando un patrón de Accordion para mantener la interfaz limpia y organizada
 */
export const EmployeeDataSection = ({ employeeId, allEmployees, employeeData }) => {
    const [expandedSections, setExpandedSections] = useState({
        wwh: false,
        pto: false,
        teamWork: false,
        disp: false,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Configuración de las secciones
    const sections = [
        {
            id: 'wwh',
            title: 'Jornadas de Trabajo (WWH)',
            icon: '📋',
            component: WwhSection
        },
        {
            id: 'pto',
            title: 'Ausencias (PTO)',
            icon: '🏖️',
            component: PtoSection
        },
        {
            id: 'teamWork',
            title: 'Trabajo en Equipo (Team Work)',
            icon: '👥',
            component: TeamWorkSection
        },
        {
            id: 'disp',
            title: 'Disponibilidades',
            icon: '⏰',
            component: DispSection
        },
    ];

    return (
        <div className="space-y-3">
            {sections.map((section) => {
                const Component = section.component;
                const isExpanded = expandedSections[section.id];

                return (
                    <div
                        key={section.id}
                        className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* HEADER del Accordion */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full px-4 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{section.icon}</span>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {section.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-2">
                                {isExpanded ? (
                                    <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                        </button>

                        {/* CONTENIDO del Accordion */}
                        {isExpanded && (
                            <div className="px-4 py-4 border-t border-gray-200 bg-white animate-fade-in">
                                <Component
                                    employeeId={employeeId}
                                    allEmployees={allEmployees}
                                    employeeData={employeeData}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};