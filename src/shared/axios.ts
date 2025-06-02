import axios from 'axios';
//import { useAuth } from '../../features/auth/store/auth.store';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance with default config
const axiosInstance = axios.create();

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token!);
        }
    });

    failedQueue = [];
};

// Request interceptor
// axiosInstance.interceptors.request.use(request => {
//     const accessToken = useAuth.getState().accessToken;

//     if (accessToken) {
//         request.headers['Authorization'] = `Bearer ${accessToken}`;
//     }

//     if (!(request.data instanceof FormData)) {
//         request.headers['Content-Type'] = 'application/json';
//     }

//     return request;
// }, error => Promise.reject(error));

// // Response interceptor
// axiosInstance.interceptors.response.use(response => response, async error => {
//     const status = error.response ? error.response.status : null;
//     const originalRequest = error.config;

//     // Don't intercept refresh token requests to avoid circular dependency
//     if (originalRequest.url?.includes('/auth/refresh-token')) {
//         return Promise.reject(error);
//     }

//     if (status === 401 && !originalRequest._retry) {
//         if (isRefreshing) {
//             // If refresh is already in progress, queue this request
//             return new Promise((resolve, reject) => {
//                 failedQueue.push({ resolve, reject });
//             }).then(token => {
//                 originalRequest.headers['Authorization'] = `Bearer ${token}`;
//                 return axiosInstance(originalRequest);
//             }).catch(err => {
//                 return Promise.reject(err);
//             });
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         const { refreshToken, accessToken } = useAuth.getState();

//         // Check if we have tokens before attempting refresh
//         if (!refreshToken || !accessToken) {
//             useAuth.getState().signOut();
//             processQueue(error, null);
//             isRefreshing = false;
//             return Promise.reject(error);
//         }

//         try {
//             // Create a separate axios instance for refresh to avoid interceptor recursion
//             const refreshAxios = axios.create({
//                 baseURL: process.env.REACT_APP_BACKEND_URL + '/api'
//             });

//             const response = await refreshAxios.post('/auth/refresh-token', {
//                 accessToken,
//                 refreshToken
//             });

//             if (response.data?.accessToken) {
//                 // Update tokens in the store
//                 useAuth.getState().refresh(response.data.accessToken, response.data.refreshToken);

//                 const newAccessToken = response.data.accessToken;

//                 // Update the original request with new token
//                 originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

//                 // Process the queued requests
//                 processQueue(null, newAccessToken);
//                 isRefreshing = false;

//                 // Retry the original request with the new token
//                 return axiosInstance(originalRequest);
//             } else {
//                 throw new Error('Invalid refresh response');
//             }
//         } catch (refreshError) {
//             useAuth.getState().signOut();
//             processQueue(refreshError, null);
//             isRefreshing = false;
//             return Promise.reject(refreshError);
//         }
//     }

//     return Promise.reject(error);
// });

export default axiosInstance; 