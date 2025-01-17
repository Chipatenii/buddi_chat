import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apiService'; // Adjust import as per your project structure

const RegisterPage = () => {
    const [realName, setRealName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate that all fields are filled
        if (!realName || !username || !email || !password || !profilePicture) {
            setError('All fields are required');
            return;
        }

        const formData = new FormData();
        formData.append('realName', realName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profilePicture', profilePicture);

        try {
            setLoading(true);
            const response = await api.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Registration successful! You can now log in.');
                navigate('/login'); // Redirect to login
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input type="text" value={realName} onChange={(e) => setRealName(e.target.value)} placeholder="Real Name" required />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} required />
            <button type="submit" disabled={loading}>Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default RegisterPage;