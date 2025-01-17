import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { connectWebSocket, closeWebSocket, sendMessage } from '../services/webSocketService';

const ChatRoomPage = () => {
    const [messages, setMessages] = useState([]);
    const [chatRooms] = useState(['General', 'Random', 'Tech']);
    const [currentRoom, setCurrentRoom] = useState('General');
    const [users, setUsers] = useState([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
    ]);
    const loggedInUser = { id: '3', name: 'You' }; // Example logged-in user

    useEffect(() => {
        connectWebSocket((newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => closeWebSocket();
    }, []);

    const handleSendMessage = (message) => {
        const newMessage = { user: loggedInUser, message, timestamp: new Date() };
        setMessages((prev) => [...prev, newMessage]);
        sendMessage(newMessage);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="bg-primary text-white py-4 w-100">
                <h1 className="text-center m-0">Chat Room</h1>
            </header>

            <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Buddi Chat</Link>
                    <div className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/settings">Settings</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => alert('Logged out!')}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="d-flex flex-grow-1 w-100">
                <ChatSidebar users={users} />
                <main className="flex-grow-1 p-4 d-flex flex-column w-100">
                    <h2 className="mb-4 text-primary">{currentRoom} Room</h2>
                    <div className="messages mb-4 flex-grow-1 overflow-auto">
                        {messages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                user={msg.user}
                                message={msg.message}
                                timestamp={msg.timestamp}
                                isSent={msg.user.id === loggedInUser.id}
                            />
                        ))}
                    </div>
                    <ChatInput onSend={handleSendMessage} />
                </main>
            </div>
        </div>
    );
};

export default ChatRoomPage;