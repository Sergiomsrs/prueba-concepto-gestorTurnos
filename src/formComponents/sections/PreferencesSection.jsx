import { useState, useEffect } from 'react';
import { useEmployeePreferences } from '../../Hooks/useEmployeePreferences';
import { TrashIcon } from '../../components/icons/TrashIcon';

const SHIFT_OPTIONS = [
    { value: 'NO_PREFERENCE', label: 'Sin preferencia' },
    { value: 'MORNING',       label: 'Mañana' },
    { value: 'AFTERNOON',     label: 'Tarde' },
    { value: 'NIGHT',         label: 'Noche' },
];

const WEEKEND_OPTIONS = [
    { value: 'ROTATING', label: 'Rotativo' },
    { value: 'ALWAYS',   label: 'Siempre disponible' },
    { value: 'NEVER',    label: 'No disponible' },
];

const FORM_DEFAULTS = {
    wantsExtraHours:       false,
    maxExtraHoursPerWeek:  '',
    shiftPreference:       'NO_PREFERENCE',
    weekendPreference:     'ROTATING',
    weekdayOnlyAfternoon:  false,
    skillIds:              [],
};

export const PreferencesSection = ({ employeeId }) => {
    const {
        availableSkills,
        preferences,
        message,
        isLoading,
        isSaving,
        handleSavePreferences,
        handleCreateSkill,
        handleDeleteSkill,
    } = useEmployeePreferences(employeeId);

    const [form, setForm]           = useState(FORM_DEFAULTS);
    const [newSkillName, setNewSkillName] = useState('');
    const [showSkillInput, setShowSkillInput] = useState(false);

    // Sincronizar formulario cuando llegan las preferencias del servidor
    useEffect(() => {
        if (!preferences) return;
        setForm({
            wantsExtraHours:      preferences.wantsExtraHours      ?? false,
            maxExtraHoursPerWeek: preferences.maxExtraHoursPerWeek ?? '',
            shiftPreference:      preferences.shiftPreference       ?? 'NO_PREFERENCE',
            weekendPreference:    preferences.weekendPreference     ?? 'ROTATING',
            weekdayOnlyAfternoon: preferences.weekdayOnlyAfternoon ?? false,
            skillIds: preferences.skills?.map(s => s.id) ?? [],
        });
    }, [preferences]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const toggleSkill = (skillId) => {
        setForm(prev => ({
            ...prev,
            skillIds: prev.skillIds.includes(skillId)
                ? prev.skillIds.filter(id => id !== skillId)
                : [...prev.skillIds, skillId],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSavePreferences({
            ...form,
            maxExtraHoursPerWeek: form.maxExtraHoursPerWeek === ''
                ? null
                : Number(form.maxExtraHoursPerWeek),
        });
    };

    const handleAddSkill = async () => {
        if (!newSkillName.trim()) return;
        handleCreateSkill({ name: newSkillName.trim() });
        setNewSkillName('');
        setShowSkillInput(false);
    };

    if (isLoading) {
        return (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-sm font-medium text-blue-700">Cargando preferencias...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Mensaje de feedback */}
            {message && (
                <div className={`rounded-lg px-4 py-3 text-sm font-medium animate-fade-in ${
                    message.includes('Error')
                        ? 'border border-red-200 bg-red-50 text-red-700'
                        : 'border border-green-200 bg-green-50 text-green-700'
                }`}>
                    {message}
                </div>
            )}

            {/* ── HORAS EXTRA ─────────────────────────────────────────── */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Horas extra</h4>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="wantsExtraHours"
                        checked={form.wantsExtraHours}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                        El empleado quiere hacer horas extra
                    </span>
                </label>

                {/* Solo mostrar si NO quiere horas extra — permite limitar cuántas acepta */}
                {!form.wantsExtraHours && (
                    <div className="pl-7">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Máximo de horas extra por semana que acepta
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                name="maxExtraHoursPerWeek"
                                value={form.maxExtraHoursPerWeek}
                                onChange={handleChange}
                                min="0"
                                max="40"
                                placeholder="0"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500"
                            />
                            <span className="text-xs text-gray-500">
                                Dejar vacío = no acepta ninguna
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── PREFERENCIAS DE TURNO ───────────────────────────────── */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Preferencias de turno</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Franja horaria preferida
                        </label>
                        <select
                            name="shiftPreference"
                            value={form.shiftPreference}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-white"
                        >
                            {SHIFT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Disponibilidad fin de semana
                        </label>
                        <select
                            name="weekendPreference"
                            value={form.weekendPreference}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-white"
                        >
                            {WEEKEND_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="weekdayOnlyAfternoon"
                        checked={form.weekdayOnlyAfternoon}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                        Entre semana solo puede hacer turno de tarde
                    </span>
                </label>
            </div>

            {/* ── SKILLS ──────────────────────────────────────────────── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Habilidades en tienda</h4>
                    <button
                        type="button"
                        onClick={() => setShowSkillInput(v => !v)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        + Nueva habilidad
                    </button>
                </div>

                {/* Formulario inline para crear una nueva skill de empresa */}
                {showSkillInput && (
                    <div className="flex gap-2 animate-fade-in">
                        <input
                            type="text"
                            value={newSkillName}
                            onChange={e => setNewSkillName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            placeholder="Ej: Caja, Almacén calzado..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={handleAddSkill}
                            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                            Añadir
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowSkillInput(false); setNewSkillName(''); }}
                            className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                )}

                {/* Lista de skills de la empresa — checkbox para asignar al empleado */}
                {availableSkills.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                        No hay habilidades definidas. Crea una con "+ Nueva habilidad".
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableSkills.map(skill => {
                            const isAssigned = form.skillIds.includes(skill.id);
                            return (
                                <div key={skill.id} className="flex items-center justify-between gap-2 group">
                                    <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={isAssigned}
                                            onChange={() => toggleSkill(skill.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
                                        />
                                        <span className={`text-sm truncate ${
                                            isAssigned ? 'text-gray-900 font-medium' : 'text-gray-600'
                                        }`}>
                                            {skill.name}
                                        </span>
                                    </label>
                                    {/* Botón eliminar skill visible solo en hover */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="opacity-0 group-hover:opacity-100 shrink-0 text-gray-400 hover:text-red-600 transition-all"
                                        title={`Eliminar habilidad "${skill.name}"`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── BOTONES ──────────────────────────────────────────────── */}
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => setForm(FORM_DEFAULTS)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Restablecer
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg transition-colors"
                >
                    {isSaving ? 'Guardando...' : 'Guardar preferencias'}
                </button>
            </div>
        </form>
    );
};
