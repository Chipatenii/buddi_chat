import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

const RegisterPage = () => {
    const [realName, setRealName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate that all fields are filled
        if (!realName || !username || !email || !password || !profilePicture) {
            setError('All fields are required');
            return; // Stop the submission if validation fails
        }

        const formData = new FormData();
        formData.append('realName', realName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profilePicture', profilePicture);

        try {
            setLoading(true); // Show loading
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
            setError(errorMessage);  // Update error message
        } finally {
            setLoading(false); // Hide loading
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <form
                onSubmit={handleRegister}
                className="bg-white p-4 rounded shadow-sm w-100 max-w-sm"
            >
                <h1 className="h4 mb-4">Register</h1>
                {error && <p className="text-danger mb-4">{error}</p>}
                <div className="mb-3">
                    <label htmlFor="realName" className="form-label">Real Name</label>
                    <input
                        id="realName"
                        type="text"
                        className="form-control"
                        value={realName}
                        onChange={(e) => setRealName(e.target.value)}
                    />
                </div>
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
                <div className="mb-3">
                    <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                    <input
                        id="profilePicture"
                        type="file"
                        className="form-control"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading} // Disable while loading
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <span
                        className="text-primary cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Login here
                    </span>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;