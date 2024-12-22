import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
});

export const fetchMessages = async () => {
    const response = await apiClient.get('/messages');
    return response.data;
};
