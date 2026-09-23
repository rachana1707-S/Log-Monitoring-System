const isProduction=import.meta.env.PROD;

export const API_BASE_URL=
    import.meta.env.VITE_API_BASE_URL||
    (isProduction?"":"http://localhost:8080");

export const WS_BASE_URL=
    import.meta.env.VITE_WS_BASE_URL||
    (isProduction?"":"http://localhost:8080");