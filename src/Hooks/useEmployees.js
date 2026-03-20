import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllEmployees, fetchDisponibilities, fetchPto } from "../services/employees";
import { AuthContext } from "@/timeTrack/context/AuthContext";

const createFormInitialState = { name: '', lastName: '', email: '', ptoStartDate: '', ptoTerminationDate: '' };
const PtoFormInitialState = { name: '', lastName: '', email: '', ptoStartDate: '', ptoTerminationDate: '' };

export const useEmployees = () => {
    const queryClient = useQueryClient();
    const { auth } = useContext(AuthContext);

    const [createForm, setCreateForm] = useState(createFormInitialState);
    const [ptoCreateForm, setPtoCreateForm] = useState(PtoFormInitialState);
    const [message, setMessage] = useState("");

    // Queries
    const { data: allEmployees = [] } = useQuery({
        queryKey: ["employees"],
        queryFn: () => getAllEmployees(auth.token),
        enabled: !!auth?.token,
    });

    const { data: workHours = [], isLoading: loadingDispo } = useQuery({
        queryKey: ["disponibilities", createForm?.id],
        queryFn: async () => {
            const { status, data } = await fetchDisponibilities.getDisponibilities(createForm.id);
            return status === 204 ? [] : data;
        },
        enabled: !!createForm?.id,
        onSuccess: (data) => {
            if (data.length === 0) setMessage("No hay ausencias registradas.");
            else setMessage("");
        }
    });

    const { data: ptoList = [] } = useQuery({
        queryKey: ["pto", ptoCreateForm?.id],
        queryFn: async () => {
            const { status, data } = await fetchPto.getPtoList(ptoCreateForm.id);
            return status === 204 ? [] : data;
        },
        enabled: !!ptoCreateForm?.id,
    });

    // Mutations - Disponibilities
    const saveDispoMutation = useMutation({
        mutationFn: fetchDisponibilities.saveDisponibility,
        onSuccess: () => {
            queryClient.invalidateQueries(["disponibilities", createForm?.id]);
        },
        onError: () => setMessage("Error al guardar la ausencia.")
    });

    const deleteDispoMutation = useMutation({
        mutationFn: fetchDisponibilities.deleteDisponibilityById,
        onSuccess: () => {
            queryClient.invalidateQueries(["disponibilities", createForm?.id]);
        },
        onError: () => setMessage("Error al eliminar la ausencia.")
    });

    // Mutations - PTO
    const savePtoMutation = useMutation({
        mutationFn: fetchPto.savePto,
        onSuccess: () => {
            queryClient.invalidateQueries(["pto", ptoCreateForm?.id]);
        },
        onError: () => setMessage("Error al guardar el PTO.")
    });

    const deletePtoMutation = useMutation({
        mutationFn: fetchPto.deletePtoById,
        onSuccess: () => {
            queryClient.invalidateQueries(["pto", ptoCreateForm?.id]);
        },
        onError: () => setMessage("Error al eliminar el PTO.")
    });

    // Handlers
    const handleEmployeeSelect = (selectedId) => {
        const selectedEmployee = allEmployees.find(emp => emp.id.toString() === selectedId);
        if (selectedEmployee) {
            setCreateForm(selectedEmployee);
            setMessage("");
        } else {
            setCreateForm(createFormInitialState);
        }
    };

    const handlePtoEmployeeSelect = (selectedId) => {
        const selectedEmployee = allEmployees.find(emp => emp.id.toString() === selectedId);
        if (selectedEmployee) {
            setPtoCreateForm(selectedEmployee);
            setMessage("");
        } else {
            setPtoCreateForm(PtoFormInitialState);
        }
    };

    return {
        allEmployees,
        createForm,
        message,
        workHours,
        ptoCreateForm,
        ptoList,
        setCreateForm,
        setPtoCreateForm,
        setMessage,
        handleEmployeeSelect,
        handlePtoEmployeeSelect,
        handleSaveDisponibility: saveDispoMutation.mutate,
        handleDeleteDisponibility: deleteDispoMutation.mutate,
        handleSavePto: savePtoMutation.mutate,
        handleDeletePto: (id) => deletePtoMutation.mutate(id),
        isLoading: loadingDispo || saveDispoMutation.isLoading
    };
};
