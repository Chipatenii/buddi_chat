import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import AiSummaryPanel from '../components/AiSummaryPanel';
import api from '../services/apiService';
import webSocketService from '../services/webSocketService';
import useAuth from '../hooks/useAuth';
import { ChatSkeleton } from '../components/ui';

const ChatRoomPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [summary, setSummary] = useState('');
    const [summarizing, setSummarizing] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [msgsRes, usersRes] = await Promise.all([
                    api.get('/messages/recent'),
                    api.get('/users/active')
                ]);
                setMessages(msgsRes.data || msgsRes || []);
                setActiveUsers(usersRes.data || usersRes || []);
                setLoading(false);
                setTimeout(scrollToBottom, 100);
            } catch (err) {
                console.error('Error fetching chat data:', err);
                setLoading(false);
            }
        };

        fetchInitialData();

        webSocketService.connect();
        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'NEW_MESSAGE') {
                setMessages(prev => [...prev, event.data]);
                scrollToBottom();
            } else if (event.type === 'USER_LIST_UPDATE') {
                setActiveUsers(event.data);
            }
        });

        return () => {
            unsubscribe();
            webSocketService.disconnect();
        };
    }, []);

    const handleSendMessage = async (content) => {
        if (!content.trim()) return;
        setSending(true);
        try {
            await api.post('/messages', { content });
            setSending(false);
        } catch (err) {
            console.error('Failed to send message:', err);
            setSending(false);
        }
    };

    const handleGenerateSummary = async () => {
        setSummarizing(true);
        try {
            const res = await api.get('/ai/summary');
            setSummary(res.data?.summary || res.summary || '');
            setSummarizing(false);
        } catch (err) {
            console.error('Failed to generate summary:', err);
            setSummarizing(false);
        }
    };

    if (loading) return <ChatSkeleton />;

    return (
        <div className="d-flex flex-column h-100 bg-main">
            {/* Header / Info Area */}
            <div className="px-4 py-3 border-bottom border-color bg-surface-low d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="fw-bold m-0">Global Chat Room</h5>
                    <div className="small text-secondary d-flex align-items-center gap-1">
                        <span className="w-2 h-2 rounded-circle bg-accent animate-pulse" style={{ width: 8, height: 8 }}></span>
                        {activeUsers.length} people online
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 overflow-hidden d-flex flex-column flex-lg-row">
                {/* Chat Container */}
                <div className="flex-grow-1 d-flex flex-column h-100 overflow-hidden position-relative">
                    {/* Messages Area */}
                    <div className="flex-grow-1 overflow-auto px-1 py-4 custom-scrollbar">
                        <div className="container-fluid" style={{ maxWidth: '900px' }}>
                            <AiSummaryPanel 
                                summary={summary} 
                                onRefresh={handleGenerateSummary} 
                                loading={summarizing} 
                            />
                            
                            <div className="d-flex flex-column gap-2 mb-4">
                                {messages.map((msg, index) => {
                                    const isPrevFromSameUser = index > 0 && messages[index - 1].user?.id === msg.user?.id;
                                    return (
                                        <ChatMessage 
                                            key={msg.id || index} 
                                            message={msg} 
                                            isSent={msg.user?.id === user?.id}
                                            hideUser={isPrevFromSameUser}
                                        />
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-top border-color bg-surface-low backdrop-blur-md">
                        <div className="container-fluid px-4 py-3" style={{ maxWidth: '900px' }}>
                            <ChatInput onSend={handleSendMessage} disabled={sending} />
                        </div>
                    </div>
                </div>

                {/* Sidebar - Desktop Only */}
                <div className="d-none d-lg-block border-start border-color bg-surface-low" style={{ width: '320px' }}>
                    <ChatSidebar users={activeUsers} />
                </div>
            </div>
        </div>
    );
};

export default ChatRoomPage;
