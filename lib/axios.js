// lib/axios.js
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: '/api', // Your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to automatically attach token
apiClient.interceptors.request.use(
    (config) => {
        // Get the token from local storage or a cookie (or any method you're using)
        const token = localStorage.getItem('token');

        if (token) {
            // Attach token to the request header
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Add a response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Handle 401 errors (e.g., token expired or unauthorized)
        if (error.response && error.response.status === 401) {
            // Optionally, you can log out the user or redirect to login
            console.error('Unauthorized, logging out...');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
