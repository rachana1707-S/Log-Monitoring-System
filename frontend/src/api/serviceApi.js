const API_URL="http://localhost:8080/api/services";

export const getServices=async()=>{
    const response=await fetch(API_URL);

    if(!response.ok){
        throw new Error("Failed to fetch services");
    }

    return response.json();
};