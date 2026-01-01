import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import api from '../services/apiService';
import { Button, Input } from '../components/ui';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            await api.post('/auth/login', { username, password });
            navigate('/'); 
        } catch (err) {
            console.error('Login error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-center min-vh-100 px-4 bg-dark"
        >
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card p-5 w-100" 
                style={{ maxWidth: '450px' }}
            >
                <div className="text-center mb-5">
                    <div className="p-3 rounded-circle bg-primary bg-opacity-10 d-inline-flex mb-3">
                        <LogIn size={40} className="text-primary" />
                    </div>
                    <h2 className="fw-bold">Welcome Back</h2>
                    <p className="text-muted small">Enter your credentials to access your chat</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger mb-4">
                            {error}
                        </div>
                    )}
                    
                    <Input
                        label="Username"
                        placeholder="john_doe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-100 py-3 mb-3"
                    >
                        Login
                    </Button>

                    <div className="text-center mt-4">
                        <span className="text-muted small">Don't have an account? </span>
                        <Link to="/register" className="text-primary small text-decoration-none fw-semibold d-inline-flex align-items-center gap-1">
                            <UserPlus size={14} />
                            Create Account
                        </Link>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default LoginPage;
