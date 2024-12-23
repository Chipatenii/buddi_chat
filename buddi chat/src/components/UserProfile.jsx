
import PropTypes from 'prop-types';

const UserProfile = ({ user }) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">User Profile</h2>
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
