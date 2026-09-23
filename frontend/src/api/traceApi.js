const API_URL="http://localhost:8080/api/traces";

export const getTrace=async(traceId)=>{
    const response=await fetch(
        `${API_URL}/${encodeURIComponent(traceId)}`
    );

    if(response.status===404){
        throw new Error("Trace not found");
    }

    if(!response.ok){
        throw new Error("Failed to load trace");
    }

    return response.json();
};