import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit for file upload

const RegisterPage = () => {
    const [form, setForm] = useState({
        realName: '',
        username: '',
        password: '',
        email: '',
        profilePicture: null,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value, files } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [id]: files ? files[0] : value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { realName, username, email, password, profilePicture } = form;

        if (!realName || !username || !email || !password || !profilePicture) {
            setError('All fields are required');
            return;
        }

        if (profilePicture.size > MAX_FILE_SIZE) {
            setError('Profile picture must be smaller than 2 MB');
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
                alert('Registration successful! You can now log in.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <form onSubmit={handleRegister} className="bg-white p-4 rounded shadow-sm w-100 max-w-sm">
                <h1 className="h4 mb-4">Register</h1>
                {error && <p className="text-danger mb-4">{error}</p>}
                {Object.keys(form).map((key) => (
                    <div className="mb-3" key={key}>
                        <label htmlFor={key} className="form-label">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())}
                        </label>
                        <input
                            id={key}
                            type={key === 'password' ? 'password' : key === 'profilePicture' ? 'file' : 'text'}
                            className="form-control"
                            value={key !== 'profilePicture' ? form[key] : undefined}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
