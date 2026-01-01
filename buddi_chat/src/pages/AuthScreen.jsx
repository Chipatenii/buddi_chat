import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck, AlertCircle, Mail, Lock, User as UserIcon, AtSign, Upload, Plus } from 'lucide-react';
import api from '../services/apiService';
import { PrimaryButton, InputField } from '../components/ui';
import AuthLayout from '../components/AuthLayout';
import useAuth from '../hooks/useAuth';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit

const AuthScreen = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Login State
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    // Register State
    const [registerData, setRegisterData] = useState({
        realName: '',
        username: '',
        password: '',
        email: '',
        profilePicture: null,
    });
    const [preview, setPreview] = useState(null);

    const handleLoginChange = (e) => {
        const { id, value } = e.target;
        setLoginData(prev => ({ ...prev, [id]: value }));
    };

    const handleRegisterChange = (e) => {
        const { id, value, files } = e.target;
        if (files) {
            const file = files[0];
            setRegisterData(prev => ({ ...prev, [id]: file }));
            setPreview(URL.createObjectURL(file));
        } else {
            setRegisterData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', loginData);
            const data = response.data;
            login(data.user || data.data || data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!registerData.profilePicture) {
            setError('Please upload a profile picture');
            return;
        }
        if (registerData.profilePicture.size > MAX_FILE_SIZE) {
            setError('Image must be smaller than 2 MB');
            return;
        }

        const formData = new FormData();
        Object.entries(registerData).forEach(([key, value]) => formData.append(key, value));

        try {
            setLoading(true);
            const response = await api.post('/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 201) {
                const data = response.data;
                login(data.user || data.data || data);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={mode === 'login' ? "Welcome back" : "Create account"}
            subtitle={mode === 'login' ? "Enter your credentials to access Buddi Chat." : "Join thousands of users chatting securely."}
            visualContent={
                <div className="mt-5">
                    {mode === 'login' ? (
                        <div className="d-flex gap-3">
                            <div className="p-3 bg-surface-low rounded-4 border border-color glow-primary">
                                <div className="fw-bold text-primary">12k+</div>
                                <div className="small text-secondary">Active</div>
                            </div>
                            <div className="p-3 bg-surface-low rounded-4 border border-color">
                                <div className="fw-bold text-accent-cyan">99.9%</div>
                                <div className="small text-secondary">Uptime</div>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-accent rounded-circle text-white shadow-premium">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-secondary small">End-to-end encryption active</span>
                        </div>
                    )}
                </div>
            }
        >
            {/* Tab Switcher */}
            <div className="d-flex p-1 bg-main rounded-3 mb-5 border border-color">
                <button 
                    onClick={() => { setMode('login'); setError(''); }}
                    className={`flex-fill py-2 px-3 rounded-2 small fw-semibold transition-smooth border-0 ${mode === 'login' ? 'bg-surface-high text-white shadow-sm' : 'bg-transparent text-secondary'}`}
                >
                    Sign In
                </button>
                <button 
                    onClick={() => { setMode('register'); setError(''); }}
                    className={`flex-fill py-2 px-3 rounded-2 small fw-semibold transition-smooth border-0 ${mode === 'register' ? 'bg-surface-high text-white shadow-sm' : 'bg-transparent text-secondary'}`}
                >
                    Create Account
                </button>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-danger py-3 px-4 small border-0 bg-danger bg-opacity-10 text-danger mb-4 rounded-3 d-flex align-items-center gap-2"
                >
                    <AlertCircle size={18} />
                    {error}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {mode === 'login' ? (
                    <motion.form 
                        key="login"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleLogin}
                    >
                        <InputField
                            label="Username"
                            id="username"
                            icon={<AtSign size={18} />}
                            placeholder="Your username"
                            value={loginData.username}
                            onChange={handleLoginChange}
                            required
                        />
                        <InputField
                            label="Password"
                            id="password"
                            type="password"
                            icon={<Lock size={18} />}
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                        />
                        <PrimaryButton type="submit" loading={loading} className="mt-2">
                            <LogIn size={20} />
                            Sign In
                        </PrimaryButton>
                    </motion.form>
                ) : (
                    <motion.form 
                        key="register"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleRegister}
                    >
                        <div className="text-center mb-4">
                            <label htmlFor="profilePicture" className="cursor-pointer position-relative d-inline-block">
                                <div 
                                    className="rounded-circle overflow-hidden bg-main border border-2 border-primary border-dashed transition-smooth hover-border-solid" 
                                    style={{ width: 90, height: 90 }}
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <div className="w-100 h-100 flex-center text-secondary opacity-50">
                                            <Upload size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-1 shadow-premium text-white">
                                    <Plus size={14} />
                                </div>
                                <input id="profilePicture" type="file" hidden accept="image/*" onChange={handleRegisterChange} />
                            </label>
                            <p className="small text-secondary mt-2">Tap to upload photo</p>
                        </div>
                        
                        <InputField 
                            label="Full Name" 
                            id="realName" 
                            icon={<UserIcon size={18} />}
                            placeholder="Ann Chota"
                            value={registerData.realName} 
                            onChange={handleRegisterChange} 
                            required 
                        />
                        <InputField 
                            label="Username" 
                            id="username" 
                            icon={<AtSign size={18} />}
                            placeholder="ann_c"
                            value={registerData.username} 
                            onChange={handleRegisterChange} 
                            required 
                        />
                        <InputField 
                            label="Email" 
                            id="email" 
                            type="email" 
                            icon={<Mail size={18} />}
                            placeholder="ann@example.com"
                            value={registerData.email} 
                            onChange={handleRegisterChange} 
                            required 
                        />
                        <InputField 
                            label="Password" 
                            id="password" 
                            type="password" 
                            icon={<Lock size={18} />}
                            placeholder="Min. 8 characters"
                            value={registerData.password} 
                            onChange={handleRegisterChange} 
                            required 
                        />
                        <PrimaryButton type="submit" loading={loading} className="mt-3">
                            <UserPlus size={20} />
                            Create Account
                        </PrimaryButton>
                    </motion.form>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
};

export default AuthScreen;
