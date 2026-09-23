import {API_BASE_URL} from "../config";

const API_URL=`${API_BASE_URL}/api/alerts`;

export const getAlerts=async()=>{
    const response=await fetch(API_URL);

    if(!response.ok){
        throw new Error("Failed to fetch alerts");
    }

    return response.json();
};

export const getActiveAlerts=async()=>{
    const response=await fetch(`${API_URL}/active`);

    if(!response.ok){
        throw new Error("Failed to fetch active alerts");
    }

    return response.json();
};

export const resolveAlert=async(id)=>{
    const response=await fetch(
        `${API_URL}/${id}/resolve`,
        {
            method:"PATCH"
        }
    );

    if(!response.ok){
        throw new Error("Failed to resolve alert");
    }

    return response.json();
};