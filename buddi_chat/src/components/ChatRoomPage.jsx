import React, { memo, useMemo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import UserList from './UserList';
import Loader from './Loader';
import ErrorBoundary from './ErrorBoundary';
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchChatRoom, fetchRoomUsers } from '../services/chatService';
import { logger } from '../utils/logger';
import { APP_ROUTES, WS_EVENTS } from '../constants';

const ChatRoomPage = memo(() => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { 
        messages, 
        users, 
        loading, 
        error,
        sendMessage,
        loadMoreMessages,
        markAsRead
    } = useChat(roomId);

    const { connectionStatus } = useWebSocket({
        url: `/ws/rooms/${roomId}`,
        onMessage: (message) => {
            // Handle incoming messages
        },
        onError: (error) => {
            logger.error('WebSocket error:', error);
            // Handle connection errors
        }
    });

    // Memoize the message list to prevent unnecessary re-renders
    const messageList = useMemo(() => 
        messages.map(message => (
            <ChatMessage
                key={message._id}
                message={message}
                currentUser={user}
            />
        )),
        [messages, user]
    );

    // Memoize the user list
    const userList = useMemo(() => 
        users.map(chatUser => ({
            ...chatUser,
            isOnline: chatUser.lastSeen > Date.now() - 300000 // 5 minutes
        })),
        [users]
    );

    // Memoize handlers
    const handleSendMessage = useCallback((content, attachment) => {
        sendMessage(content, attachment);
    }, [sendMessage]);

    const handleScroll = useCallback((e) => {
        const { scrollTop } = e.target;
        if (scrollTop === 0) {
            loadMoreMessages();
        }
    }, [loadMoreMessages]);

    // Mark messages as read when component mounts or messages change
    useEffect(() => {
        if (messages.length > 0) {
            markAsRead();
        }
    }, [messages, markAsRead]);

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <ErrorBoundary>
            <div className="chat-room">
                <div className="chat-messages" onScroll={handleScroll}>
                    {messageList}
                </div>
                <ChatInput onSend={handleSendMessage} />
                <UserList users={userList} />
            </div>
        </ErrorBoundary>
    );
});

ChatRoomPage.displayName = 'ChatRoomPage';

export default ChatRoomPage;