import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance with default config
const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(request => {
    const token = localStorage.getItem('authToken');

    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(request.data instanceof FormData)) {
        request.headers['Content-Type'] = 'application/json';
    }

    return request;
}, error => Promise.reject(error));

export default axiosInstance; 