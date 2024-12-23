import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/apiService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', { username, email, password });
            if (response.status === 201) {
                alert('Registration successful! You can now log in.');
                navigate('/'); // Redirect to login
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded shadow-md max-w-sm w-full"
            >
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        className="mt-1 block w-full px-4 py-2 border rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="mt-1 block w-full px-4 py-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="mt-1 block w-full px-4 py-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Register
                </button>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        Login here
                    </span>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
