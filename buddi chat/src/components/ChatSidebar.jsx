import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ChatSidebar = ({ users = [] }) => {
  return (
    <aside className="bg-light h-100 p-4 border-end border-secondary">
      <h2 className="h4 fw-bold mb-4">Active Users</h2>
      <ul className="list-unstyled">
        {users.map((user) => (
          <li key={user.id} className="p-2 bg-white rounded shadow-sm mb-2">
            <Link to={`/profile/${user.id}`} className="text-decoration-none">
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
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