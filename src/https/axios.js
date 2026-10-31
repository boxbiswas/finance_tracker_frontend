import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,    // Allow sending cookies with requests
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a response interceptor to globally handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Remove user from localStorage so auth state resets and avoids redirect loops
            localStorage.removeItem('clarivo_user');
            sessionStorage.removeItem('user');

            // Only redirect if we are not already on the login or register page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;