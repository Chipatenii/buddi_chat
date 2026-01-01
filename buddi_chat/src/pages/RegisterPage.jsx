import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Upload, LogIn, Plus } from 'lucide-react';
import api from '../services/apiService';
import { Button, Input } from '../components/ui';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit

const RegisterPage = () => {
    const [form, setForm] = useState({
        realName: '',
        username: '',
        password: '',
        email: '',
        profilePicture: null,
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value, files } = e.target;
        if (files) {
            const file = files[0];
            setForm(prev => ({ ...prev, [id]: file }));
            setPreview(URL.createObjectURL(file));
        } else {
            setForm(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.profilePicture) {
            setError('Please upload a profile picture');
            return;
        }

        if (form.profilePicture.size > MAX_FILE_SIZE) {
            setError('Image must be smaller than 2 MB');
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));

        try {
            setLoading(true);
            const response = await api.post('/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-center min-vh-100 py-5 px-4 bg-dark"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-5 w-100" 
                style={{ maxWidth: '500px' }}
            >
                <div className="text-center mb-5">
                    <div className="p-3 rounded-circle bg-primary bg-opacity-10 d-inline-flex mb-3">
                        <UserPlus size={40} className="text-primary" />
                    </div>
                    <h2 className="fw-bold">Create Account</h2>
                    <p className="text-muted small">Join our secure messaging community</p>
                </div>

                <form onSubmit={handleRegister}>
                    {error && (
                        <div className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger mb-4">
                            {error}
                        </div>
                    )}

                    <div className="text-center mb-4">
                        <label htmlFor="profilePicture" className="cursor-pointer position-relative d-inline-block">
                            <div 
                                className="rounded-circle overflow-hidden bg-surface-dark border border-secondary" 
                                style={{ width: 100, height: 100, borderStyle: 'dashed' }}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    <div className="w-100 h-100 flex-center text-muted">
                                        <Upload size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 shadow-sm">
                                <Plus size={16} className="text-white" />
                            </div>
                            <input
                                id="profilePicture"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleInputChange}
                            />
                        </label>
                        <p className="small text-muted mt-2">Upload Profile Photo</p>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Input label="Full Name" id="realName" value={form.realName} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <Input label="Username" id="username" value={form.username} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <Input label="Email Address" id="email" type="email" value={form.email} onChange={handleInputChange} required />
                    <Input label="Password" id="password" type="password" value={form.password} onChange={handleInputChange} required />

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-100 py-3 mt-3 mb-2"
                    >
                        Register
                    </Button>

                    <div className="text-center mt-4">
                        <span className="text-muted small">Already have an account? </span>
                        <Link to="/login" className="text-primary small text-decoration-none fw-semibold d-inline-flex align-items-center gap-1">
                            <LogIn size={14} />
                            Log In
                        </Link>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default RegisterPage;
