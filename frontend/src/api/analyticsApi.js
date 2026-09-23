import {API_BASE_URL} from "../config";

const API_URL=`${API_BASE_URL}/api/analytics`;

export const getAnalytics=async()=>{
    const response=await fetch(API_URL);

    if(!response.ok){
        throw new Error("Failed to fetch analytics");
    }

    return response.json();
};