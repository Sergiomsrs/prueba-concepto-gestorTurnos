import { axiosClient } from "./axiosClient";

export const getCycle = async (cycle) => {
    try {
        const response = await axiosClient.get(`/gs/getcycle`, {
            params: { cycle }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRoles = async () => {
    try {
        const response = await axiosClient.get(`/role`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDefaultRoles = async () => {
    try {
        const response = await axiosClient.get(`/default/get-all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createByGenericShift = async (config) => {
    try {
        const response = await axiosClient.post(`/gs/create-week`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const toggleShiftRole = async (roleId) => {
    try {
        const response = await axiosClient.put(`/role/${roleId}/toggle-active`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveDefaultRole = async (role) => {
    try {
        const response = await axiosClient.post(`/default/save`, role);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createRolesBulk = async (roles) => {
    const response = await axiosClient.post('/role/bulk', roles);
    return response.data;
};

export const deleteRole = async (roleId) => {
    const response = await axiosClient.delete(`/role/${roleId}`);
    return response.data;
};