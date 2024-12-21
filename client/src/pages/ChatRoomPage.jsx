import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatMessage from '../components/ChatMessage';
import { connectWebSocket, sendMessage, closeWebSocket } from '../services/webSocketService'; // For plain WebSocket
// OR
// import { setupSocketListeners, sendMessage } from '../services/webSocketService'; // For Socket.IO

const ChatRoomPage = () => {
    useEffect(() => {
        // Initialize WebSocket connection
        connectWebSocket(); // For plain WebSocket
        // OR
        // setupSocketListeners(); // For Socket.IO

        return () => {
            // Clean up WebSocket connection on component unmount
            closeWebSocket();
        };
    }, []);

    const handleSendMessage = () => {
        sendMessage({ user: 'Alice', message: 'Hello!' });
    };

    return (
        <div>
            <Header />
            <main>
                <h2>Chat Room</h2>
                {/* Chat messages */}
                <ChatMessage user="Alice" message="Hello!" timestamp={Date.now()} />
                <ChatMessage user="Bob" message="Hi Alice!" timestamp={Date.now()} />

                {/* Send Message Button */}
                <button onClick={handleSendMessage}>Send Message</button>
            </main>
            <Footer />
        </div>
    );
};

export default ChatRoomPage;
