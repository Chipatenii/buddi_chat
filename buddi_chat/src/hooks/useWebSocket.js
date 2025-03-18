import { useState, useEffect, useCallback } from 'react';
import logger from '../utils/logger';

export const useWebSocket = ({ url, onMessage, onError }) => {
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('disconnected');

    const connect = useCallback(() => {
        const ws = new WebSocket(url);
        
        ws.onopen = () => setStatus('connected');
        ws.onmessage = (e) => onMessage(JSON.parse(e.data));
        ws.onerror = (e) => {
            logger.error('WebSocket error:', e);
            setStatus('error');
            onError(e);
        };
        ws.onclose = () => {
            setStatus('disconnected');
            setTimeout(connect, 3000); // Reconnect after 3s
        };

        setSocket(ws);
    }, [url, onMessage, onError]);

    useEffect(() => {
        connect();
        return () => socket?.close();
    }, [connect]);

    const sendMessage = useCallback((message) => {
        return new Promise((resolve, reject) => {
            if (socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
                resolve();
            } else {
                reject(new Error('WebSocket not connected'));
            }
        });
    }, [socket]);

    return { sendMessage, connectionStatus: status };
};