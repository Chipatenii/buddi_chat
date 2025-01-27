import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Explicit loading state
  const [error, setError] = useState(null);    // Error handling state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(`Fetching data for userId: ${userId}`);
        const response = await fetch(`/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('User data fetched:', data);
        setUser(data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.'); // Set error state
      } finally {
        setLoading(false); // Loading is done
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>; // Show explicit loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  if (!user) {
    return <div>No user data found.</div>; // Handle unexpected empty user state
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body text-center">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/120'}
            alt={`${user.username || 'User'}'s profile`}
            className="rounded-circle mb-3"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
          <h3 className="card-title">{user.username || 'No Username'}</h3>
          <p className="text-muted">{user.bio || 'No bio available'}</p>
          <p>
            Email: <span className="text-primary">{user.email || 'No email'}</span>
          </p>
          <button className="btn btn-primary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserProfile;