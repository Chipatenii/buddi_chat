import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ChatSidebar = ({ users = [] }) => {
  return (
    <aside className="bg-light h-100 p-4 border-end border-secondary">
      <h2 className="h4 fw-bold mb-4 text-primary">Active Users</h2>
      {users.length > 0 ? (
        <ul className="list-unstyled">
          {users.map((user) => (
            <li key={user.id} className="p-2 bg-white rounded shadow-sm mb-2 d-flex align-items-center">
              <div className="d-flex align-items-center">
                <div className="avatar bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <Link to={`/profile/${user.id}`} className="text-decoration-none text-dark fw-bold">
                  {user.name}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No active users found.</p>
      )}
    </aside>
  );
};

ChatSidebar.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChatSidebar;