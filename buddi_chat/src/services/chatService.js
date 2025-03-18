import api from './apiService';

export const fetchChatRoom = async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
};

export const fetchRoomUsers = async (roomId) => {
    const response = await api.get(`/rooms/${roomId}/users`);
    return response.data;
};