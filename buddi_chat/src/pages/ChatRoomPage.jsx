import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users as UsersIcon, Send } from 'lucide-react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { connectWebSocket, closeWebSocket, sendMessage } from '../services/webSocketService';
import { fetchLoggedInUser, apiWrapper } from '../services/apiService';
import { Button } from './ui';

const ChatRoomPage = () => {
    const [messages, setMessages] = useState([]);
    const [currentRoom] = useState('General');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState(null);
    const [summarizing, setSummarizing] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await fetchLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
                navigate('/login'); 
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
    }, [loggedInUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSummarize = async () => {
        if (summarizing) return;
        setSummarizing(true);
        try {
            const roomId = "60d5f5e3f1d2c123456789ab"; // Placeholder
            const response = await apiWrapper.get(`/chat/${roomId}/summarize`);
            setAiSummary(response.summary);
        } catch (error) {
            console.error('Summarization failed:', error);
        } finally {
            setSummarizing(false);
        }
    };

    const handleSendMessage = (content) => {
        if (!loggedInUser) return;
        const newMessage = {
            user: loggedInUser,
            content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        sendMessage(newMessage);
    };

    if (loading) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="d-flex flex-column h-100"
            style={{ height: 'calc(100vh - 5rem)' }}
        >
            <div className="d-flex flex-grow-1 overflow-hidden">
                <div className="hide-mobile" style={{ width: '300px' }}>
                    <ChatSidebar />
                </div>
                
                <main className="flex-grow-1 d-flex flex-column bg-transparent position-relative">
                    {/* Header */}
                    <div className="px-4 py-3 d-flex justify-content-between align-items-center glass-card mx-3 mt-3">
                        <div>
                            <h5 className="m-0 fw-bold">{currentRoom}</h5>
                            <span className="small text-success d-flex align-items-center gap-1">
                                <span className="rounded-circle bg-success" style={{ width: 6, height: 6 }} />
                                12 online
                            </span>
                        </div>
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={handleSummarize}
                            loading={summarizing}
                            className="d-flex align-items-center gap-2"
                        >
                            <Sparkles size={16} />
                            Summarize
                        </Button>
                    </div>

                    {/* Summary Alert */}
                    <AnimatePresence>
                        {aiSummary && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mx-3 mt-3 px-3 py-2 glass-card border-primary"
                                style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex gap-2">
                                        <Sparkles size={18} className="text-primary mt-1" />
                                        <div>
                                            <strong className="small text-primary d-block">AI Catch-up</strong>
                                            <p className="small mb-0 opacity-75">{aiSummary}</p>
                                        </div>
                                    </div>
                                    <button className="btn-close btn-close-white small" onClick={() => setAiSummary(null)} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Messages */}
                    <div 
                        ref={scrollRef}
                        className="flex-grow-1 overflow-auto px-4 py-4 d-flex flex-column mt-2"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {messages.length === 0 ? (
                            <div className="flex-center flex-column text-center opacity-50 m-auto">
                                <div className="p-4 rounded-circle bg-surface-dark mb-3">
                                    <Send size={48} className="text-primary" />
                                </div>
                                <p className="small">No messages yet.<br/>Be the first to say hello!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <ChatMessage
                                    key={index}
                                    message={msg}
                                    isSent={msg.user?._id === loggedInUser?._id}
                                />
                            ))
                        )}
                    </div>

                    {/* Input */}
                    <ChatInput onSend={handleSendMessage} />
                </main>
            </div>
        </motion.div>
    );
};

export default ChatRoomPage;
