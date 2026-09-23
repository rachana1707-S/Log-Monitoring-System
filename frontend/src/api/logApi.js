const API_URL="http://localhost:8080/api/logs";

export const getLogs=async()=>{
    const response=await fetch(API_URL);

    if(!response.ok){
        throw new Error("Failed to fetch logs");
    }

    return response.json();
};

export const searchLogs=async(filters={})=>{
    const params=new URLSearchParams();

    if(filters.service){
        params.append("service",filters.service);
    }

    if(filters.level){
        params.append("level",filters.level);
    }

    if(filters.environment){
        params.append("environment",filters.environment);
    }

    if(filters.keyword){
        params.append("keyword",filters.keyword);
    }

    if(filters.startTime){
        params.append("startTime",filters.startTime);
    }

    if(filters.endTime){
        params.append("endTime",filters.endTime);
    }

    params.append("page",filters.page??0);
    params.append("size",filters.size??25);

    const response=await fetch(
        `${API_URL}/search?${params.toString()}`
    );

    if(!response.ok){
        throw new Error("Failed to search logs");
    }

    return response.json();
};