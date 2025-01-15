import { useState, useEffect } from 'react'; 
import UserProfile from '../components/UserProfile'; 
import api from '../services/apiService';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user'); // Use your `api` instance
        setUser(response.data); // Set user data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.error || 'Error fetching user data');
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
};

export default UserProfilePage;