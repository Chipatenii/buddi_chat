import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
    
        try {
            console.log('Sending login request...');
            const response = await api.post('/auth/login', { username, password });
            
            console.log('API Response:', response.data);
            
            localStorage.setItem('authToken', response.data.token);
            alert('Login successful!');
            
            console.log('Navigating to homepage...');
            navigate('/'); // Redirect to homepage after success
        } catch (err) {
            console.error('Login error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleSignUp = () => {
        navigate('/register'); // Redirect to register page
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <form
                onSubmit={handleLogin}
                className="bg-white p-4 rounded shadow-sm w-100 max-w-sm"
            >
                <h1 className="h4 mb-4">Login</h1>
                {error && <p className="text-danger mb-4">{error}</p>}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-100 mb-2"
                >
                    Login
                </button>
                <button
                    type="button"
                    className="btn btn-secondary w-100"
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
