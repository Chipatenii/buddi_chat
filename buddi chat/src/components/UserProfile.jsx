import React, { useState } from 'react';

const UserProfile = () => {
  const [username, setUsername] = useState('John Doe');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfileUpdate = () => {
    alert('Profile updated successfully!');
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-picture">
        {profilePicture ? (
          <img src={profilePicture} alt="Profile" />
        ) : (
          <div className="placeholder">No Picture</div>
        )}
        <input
          type="file"
          onChange={(e) => setProfilePicture(URL.createObjectURL(e.target.files[0]))}
        />
      </div>
      <div className="profile-details">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleProfileUpdate}>Update Profile</button>
    </div>
  );
};

export default UserProfile;
