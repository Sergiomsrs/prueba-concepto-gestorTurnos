import { axiosClient } from "./axiosClient";

// Empleados activos
export const searchActiveEmployees = async () => {
    const res = await axiosClient.get("/emp/active");
    return res.data;
};

// PTO de un empleado
export const searchPtoByEmployee = async (employeeId) => {
    const res = await axiosClient.get(`/pto/${employeeId}`);
    return res.data;
};

// Disponibilidades de un empleado
export const fetchAbsences = async (selectedId) => {
    const res = await axiosClient.get(`/disp/${selectedId}`);
    return { status: res.status, data: res.data };
};

// Nuevo servicio: empleados
export const getAllEmployees = async () => {
    const res = await axiosClient.get("/emp/findall");
    return res.data;
};

export const getEmployeesByRange = async (month, year) => {
    const res = await axiosClient.get(
        `/emp/active-by-month?month=${month}&year=${year}`
    );
    return res.data;
};

// Disponibilidades CRUD
export const fetchDisponibilities = {
    getDisponibilities: async (selectedId) => {
        const res = await axiosClient.get(`/disp/${selectedId}`);
        return { status: res.status, data: res.data };
    },
    saveDisponibility: async (disponibilityData) => {
        const res = await axiosClient.post("/disp/add", disponibilityData);
        return { status: res.status, data: res.data };
    },
    deleteDisponibilityById: async (id) => {
        const res = await axiosClient.delete(`/disp/delete/${id}`);
        return { status: res.status, data: res.data };
    },
};

// PTO CRUD
export const fetchPto = {
    getPtoList: async (selectedId) => {
        const res = await axiosClient.get(`/pto/${selectedId}`);
        return { status: res.status, data: res.data };
    },
    savePto: async (ptoData) => {
        const res = await axiosClient.post("/pto/add", ptoData);
        return { status: res.status, data: res.data };
    },
    deletePtoById: async (ptoId) => {
        const res = await axiosClient.delete(`/pto/delete/${ptoId}`);
        return { status: res.status, data: res.data };
    },
};