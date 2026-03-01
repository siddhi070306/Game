const getApiBaseUrl = () => {
    // If running in production (like Vercel), it will use the environment variable
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    // Fallback to local dev network IP or localhost
    const hostname = window.location.hostname;
    return `http://${hostname}:5002`;
};

const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
