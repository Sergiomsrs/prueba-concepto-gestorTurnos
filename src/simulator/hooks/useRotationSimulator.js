import { useState, useMemo, useEffect } from 'react';

export const DIAS_NOMBRES = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export const DIAS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const PALETA_CICLOS = [
    { bg: 'bg-[#1D9E75]', text: 'text-white', hex: '#1D9E75' },
    { bg: 'bg-[#378ADD]', text: 'text-white', hex: '#378ADD' },
    { bg: 'bg-[#EF9F27]', text: 'text-[#412402]', hex: '#EF9F27' },
    { bg: 'bg-[#A32D2D]', text: 'text-white', hex: '#A32D2D' },
    { bg: 'bg-[#534AB7]', text: 'text-white', hex: '#534AB7' },
    { bg: 'bg-[#5F5E5A]', text: 'text-white', hex: '#5F5E5A' },
    { bg: 'bg-[#0E7C66]', text: 'text-white', hex: '#0E7C66' },
    { bg: 'bg-[#C2553D]', text: 'text-white', hex: '#C2553D' },
    { bg: 'bg-[#2D6A4F]', text: 'text-white', hex: '#2D6A4F' },
    { bg: 'bg-[#7B5EA7]', text: 'text-white', hex: '#7B5EA7' },
];

const PATRON_DEFECTO = [[5, 6], [5, 6], [5, 6], [5, 6]];

export function useRotationSimulator() {
    // Estados Principales
    const [numEmp, setNumEmp] = useState(4);
    const [vistaMode, setVistaMode] = useState('cobertura');
    const [numCiclos, setNumCiclos] = useState(4);
    const [patron, setPatron] = useState(PATRON_DEFECTO);
    const [empleadosActivos, setEmpleadosActivos] = useState({});
    const [showConfig, setShowConfig] = useState(false);

    // Estados Borrador (Panel de Configuración)
    const [borradorNumCiclos, setBorradorNumCiclos] = useState(4);
    const [borradorPatron, setBorradorPatron] = useState(PATRON_DEFECTO.map(d => [...d]));

    // Sincronizar empleados activos al cambiar el número total
    useEffect(() => {
        setEmpleadosActivos(prev => {
            const next = { ...prev };
            for (let i = 0; i < numEmp; i++) {
                if (next[i] === undefined) next[i] = true;
            }
            return next;
        });
    }, [numEmp]);

    // Sincronizar borrador cuando se abre el panel
    useEffect(() => {
        if (showConfig) {
            setBorradorNumCiclos(numCiclos);
            setBorradorPatron(patron.map(d => [...d]));
        }
    }, [showConfig, numCiclos, patron]);

    // Asegurar que numEmp no sea inferior a numCiclos
    useEffect(() => {
        if (numEmp < numCiclos) {
            setNumEmp(numCiclos);
        }
    }, [numCiclos, numEmp]);

    const totalActivos = useMemo(() => {
        return Object.keys(empleadosActivos)
            .filter(k => parseInt(k) < numEmp)
            .reduce((acc, k) => acc + (empleadosActivos[k] ? 1 : 0), 0);
    }, [empleadosActivos, numEmp]);

    // Distribución de empleados activos por ciclo base
    const distActivos = useMemo(() => {
        const cuenta = Array(numCiclos).fill(0);
        for (let i = 0; i < numEmp; i++) {
            if (empleadosActivos[i]) {
                cuenta[i % numCiclos]++;
            }
        }
        return cuenta;
    }, [empleadosActivos, numEmp, numCiclos]);

    // Cálculo de la matriz de cuadrícula (Semanas x Días)
    const matrizDatos = useMemo(() => {
        const datos = [];
        const totalEmpPorCiclo = Array(numCiclos).fill(0);
        for (let i = 0; i < numEmp; i++) {
            totalEmpPorCiclo[i % numCiclos]++;
        }

        for (let s = 0; s < numCiclos; s++) {
            const semana = [];
            for (let d = 0; d < 7; d++) {
                let libran = 0;
                let totalEnDia = 0;

                distActivos.forEach((count, offset) => {
                    const cicloActual = (offset + s) % numCiclos;
                    if (patron[cicloActual]?.includes(d)) {
                        libran += count;
                    }
                    totalEnDia += count;
                });

                semana.push({
                    trabajando: totalEnDia - libran,
                    libran,
                    total: totalEnDia,
                });
            }
            datos.push(semana);
        }
        return datos;
    }, [numCiclos, distActivos, patron, numEmp]);

    // Métricas calculadas
    const metrics = useMemo(() => {
        const todos = matrizDatos.flat();
        const coberturas = todos.map(d => d.trabajando);
        const max = coberturas.length ? Math.max(...coberturas) : 0;
        const min = coberturas.length ? Math.min(...coberturas) : 0;
        const pctDeseq = min > 0 ? Math.round((max - min) / min * 100) : 0;

        return { max, min, pctDeseq };
    }, [matrizDatos]);

    // Handlers del Borrador de Ciclos
    const handleBorradorCheckbox = (c, d, checked) => {
        setBorradorPatron(prev => {
            const next = prev.map((arr, idx) => idx === c ? [...arr] : arr);
            if (!next[c]) next[c] = [];
            if (checked) {
                if (!next[c].includes(d)) next[c].push(d);
            } else {
                next[c] = next[c].filter(x => x !== d);
            }
            next[c].sort((a, b) => a - b);
            return next;
        });
    };

    const incrementarBorradorCiclo = () => {
        if (borradorNumCiclos < 10) {
            const nuevoIdx = borradorNumCiclos;
            setBorradorNumCiclos(prev => prev + 1);
            setBorradorPatron(prev => {
                const next = [...prev];
                if (!next[nuevoIdx]) {
                    const d1 = (nuevoIdx * 2) % 7;
                    const d2 = (d1 + 1) % 7;
                    next[nuevoIdx] = [d1, d2].sort((a, b) => a - b);
                }
                return next;
            });
        }
    };

    const decrementarBorradorCiclo = () => {
        if (borradorNumCiclos > 2) {
            setBorradorNumCiclos(prev => prev - 1);
        }
    };

    const aplicarCiclos = () => {
        const ciclosSinDias = [];
        for (let c = 0; c < borradorNumCiclos; c++) {
            if (!borradorPatron[c] || borradorPatron[c].length === 0) {
                ciclosSinDias.push(c + 1);
            }
        }
        if (ciclosSinDias.length > 0) {
            alert(`Cada ciclo necesita al menos 1 día libre. Revisa el ciclo: C${ciclosSinDias.join(', C')}`);
            return;
        }

        setNumCiclos(borradorNumCiclos);
        setPatron(borradorPatron.slice(0, borradorNumCiclos).map(d => [...d]));
        setShowConfig(false);
    };

    const restaurarCiclosDefecto = () => {
        setBorradorNumCiclos(4);
        setBorradorPatron(PATRON_DEFECTO.map(d => [...d]));
    };

    const toggleEmpleadoActivo = (idx) => {
        setEmpleadosActivos(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return {
        numEmp, setNumEmp,
        vistaMode, setVistaMode,
        numCiclos, patron,
        empleadosActivos, toggleEmpleadoActivo,
        showConfig, setShowConfig,
        totalActivos,
        matrizDatos,
        metrics,
        borradorNumCiclos, borradorPatron,
        handleBorradorCheckbox,
        incrementarBorradorCiclo, decrementarBorradorCiclo,
        aplicarCiclos, restaurarCiclosDefecto
    };
}