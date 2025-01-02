import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic form validation
        if (!username || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await api.post('/auth/register', { username, email, password });
            if (response.status === 201) {
                alert('Registration successful! You can now log in.');
                navigate('/login'); // Redirect to login
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <form onSubmit={handleRegister} className="bg-white p-4 rounded shadow-sm w-100 max-w-sm">
                <h1 className="h4 mb-4">Register</h1>
                {error && <p className="text-danger mb-4">{error}</p>}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Register</button>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <span className="text-primary cursor-pointer" onClick={() => navigate('/login')}>
                        Login here
                    </span>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;