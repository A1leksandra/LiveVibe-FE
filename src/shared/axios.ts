import axios from 'axios';
import { useAuth } from '../../features/auth/store/auth.store';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance with default config
const axiosInstance = axios.create();

//Request interceptor
axiosInstance.interceptors.request.use(request => {
    const accessToken = useAuth.getState().accessToken;

    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (!(request.data instanceof FormData)) {
        request.headers['Content-Type'] = 'application/json';
    }

    return request;
}, error => Promise.reject(error));

export default axiosInstance; 