import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loader, ErrorMessage } from '../components/ui';
import { ChatSidebar, ChatMessage, ChatInput } from '../components';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../hooks/useAuth';
import { fetchChatRoom, fetchRoomUsers } from '../services/chatService';
import { logger } from '../utils/logger';
import { APP_ROUTES, WS_EVENTS } from '../constants';

const ChatRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user: loggedInUser, loading: authLoading, error: authError } = useAuth();
    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { sendMessage, connectionStatus } = useWebSocket({
        url: `/ws/rooms/${roomId}`,
        onMessage: (message) => {
            setMessages(prev => [...prev, message]);
        },
        onError: (error) => {
            logger.error('WebSocket error:', error);
            setError('Connection lost. Reconnecting...');
        }
    });

    useEffect(() => {
        if (authError) {
            navigate(APP_ROUTES.LOGIN);
            return;
        }

        const loadRoomData = async () => {
            try {
                const [roomData, usersData] = await Promise.all([
                    fetchChatRoom(roomId),
                    fetchRoomUsers(roomId)
                ]);
                
                setRoom(roomData);
                setUsers(usersData);
                setMessages(roomData.messages);
            } catch (error) {
                logger.error('Chat room load error:', error);
                setError(error.message);
                navigate(APP_ROUTES.HOME);
            } finally {
                setLoading(false);
            }
        };

        if (loggedInUser) {
            loadRoomData();
        }
    }, [loggedInUser, roomId, navigate, authError]);

    const handleSendMessage = async (content) => {
        if (!content.trim() || !loggedInUser) return;

        const tempId = Date.now().toString();
        const newMessage = {
            tempId,
            content,
            user: loggedInUser,
            timestamp: new Date().toISOString(),
            status: 'sending'
        };

        setMessages(prev => [...prev, newMessage]);

        try {
            await sendMessage({
                type: WS_EVENTS.MESSAGE,
                roomId,
                content,
                userId: loggedInUser.id
            });
            
            setMessages(prev => 
                prev.map(msg => 
                    msg.tempId === tempId ? { ...msg, status: 'sent' } : msg
                )
            );
        } catch (error) {
            logger.error('Message send failed:', error);
            setMessages(prev => 
                prev.map(msg => 
                    msg.tempId === tempId ? { ...msg, status: 'failed' } : msg
                )
            );
        }
    };

    if (authLoading || loading) {
        return <Loader fullScreen />;
    }

    if (error) {
        return <ErrorMessage 
            code="CHAT_LOAD_ERROR" 
            message={error} 
            retry={() => window.location.reload()} 
        />;
    }

    return (
        <div className="chat-room-container">
            <ChatSidebar 
                users={users} 
                room={room} 
                connectionStatus={connectionStatus}
            />
            
            <main className="chat-main-content">
                <div className="chat-messages">
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id || message.tempId}
                            message={message}
                            isCurrentUser={message.user.id === loggedInUser?.id}
                        />
                    ))}
                </div>
                
                <ChatInput 
                    onSend={handleSendMessage} 
                    disabled={connectionStatus !== 'connected'}
                />
            </main>
        </div>
    );
};

ChatRoomPage.propTypes = {
    roomId: PropTypes.string.isRequired
};

export default ChatRoomPage;