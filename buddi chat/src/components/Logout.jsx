import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the stored token
        alert('You have been logged out!');
        navigate('/login'); // Redirect to login page
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
            Logout
        </button>
    );
};

export default Logout;
