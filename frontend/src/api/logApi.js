import axios from "axios";

const API_URL = "http://localhost:8080/api/logs";

export const getLogs = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getLogsByService = async (service) => {
    const response = await axios.get(API_URL, {
        params: {
            service: service
        }
    });

    return response.data;
};

export const getLogsByLevel = async (level) => {
    const response = await axios.get(API_URL, {
        params: {
            level: level
        }
    });

    return response.data;
};

export const searchLogs = async (query) => {
    const response = await axios.get(API_URL, {
        params: {
            q: query
        }
    });

    return response.data;
};