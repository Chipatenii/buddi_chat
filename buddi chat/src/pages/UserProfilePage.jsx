import { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import api from '../services/apiService';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user data...');
        const response = await api.get('/user'); // Adjust API endpoint if needed
        console.log('User data fetched:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.error || 'Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <UserProfile userId={user?.id || ''} />
    </div>
  );
};

export default UserProfilePage;