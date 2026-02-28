const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
};

const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
