import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from the database
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Profile Section */}
      <div className="container mt-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
          <div className="card-body text-center">
            <img
              src={user.profilePicture || 'https://via.placeholder.com/120'} // Default image
              alt={`${user.username || 'User'}'s profile`}
              className="rounded-circle mb-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
            <h3 className="card-title">{user.username || 'Chipatenii'}</h3>
            <p className="text-muted">{user.bio || 'Software Engineer | Graphic Designer'}</p>
            <p>
              Email: <span className="text-primary">{user.email || 'No email provided.'}</span>
            </p>
            {/* Add buttons to update profile */}
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserProfile;