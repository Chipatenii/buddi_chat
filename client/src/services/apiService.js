import axios from 'axios';

// Base Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Replace with your backend's URL
    timeout: 10000,                      // Optional: set a timeout
});

// Example API call
export const fetchMessages = async () => {
    try {
        const response = await apiClient.get('/messages');
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const sendMessage = async (message) => {
    try {
        const response = await apiClient.post('/messages', { message });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
