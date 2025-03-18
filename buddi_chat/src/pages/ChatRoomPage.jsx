import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { connectWebSocket, closeWebSocket, sendMessage } from '../services/webSocketService';
import { fetchLoggedInUser } from '../services/apiService';

const ChatRoomPage = () => {
    const [messages, setMessages] = useState([]);
    const [chatRooms] = useState(['General', 'Random', 'Tech']);
    const [currentRoom, setCurrentRoom] = useState('General');
    const [users] = useState([
        { id: '1', name: 'Mulenga', profilePicture: 'https://via.placeholder.com/150', bio: 'Loves tech' },
        { id: '2', name: 'Mutambo', profilePicture: 'https://via.placeholder.com/150', bio: 'Enjoys gaming' },
    ]);

    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        if (!token) {
            navigate('/login'); 
            return;
        }

        const fetchData = async () => {
            try {
                const user = await fetchLoggedInUser(token);
                setLoggedInUser(user);
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
                localStorage.removeItem('authtoken');
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    useEffect(() => {
        if (!loggedInUser) return;

        connectWebSocket((newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => closeWebSocket();
    }, [loggedInUser]); // Prevent unnecessary re-renders

    const handleSendMessage = (message) => {
        if (!loggedInUser) return;

        const newMessage = {
            user: loggedInUser,
            message,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        sendMessage(newMessage);
    };

    if (loading) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="d-flex flex-grow-1 w-100">
                <ChatSidebar users={users} />
                <main className="flex-grow-1 p-5 d-flex flex-column w-100">
                    <h2 className="mb-4 text-primary">{currentRoom} Room</h2>
                    <div className="messages mb-5 flex-grow-1 overflow-auto">
                        {messages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                user={msg.user}
                                message={msg.message}
                                timestamp={msg.timestamp}
                                isSent={msg.user.id === loggedInUser?.id}
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