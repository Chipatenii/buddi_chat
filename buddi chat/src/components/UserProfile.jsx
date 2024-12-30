import PropTypes from 'prop-types';

const UserProfile = ({ user }) => {
  return (
    <div className="container p-4">
      <h2 className="h3 fw-bold mb-4">User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserProfile;