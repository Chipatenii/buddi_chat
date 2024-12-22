import { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage, closeWebSocket } from '../services/webSocketService';

const ChatRoomPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        connectWebSocket();

        // Listen for messages
        const handleMessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        window.addEventListener('message', handleMessage);

        return () => {
            closeWebSocket();
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage({ user: 'User1', message });
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Chat Room</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.user}:</strong> {msg.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatRoomPage;
