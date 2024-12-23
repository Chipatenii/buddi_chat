import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ChatSidebar = ({ users }) => {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 border-r border-gray-300">
      <h2 className="text-xl font-bold mb-4">Active Users</h2>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li key={index} className="p-2 bg-white rounded-md shadow hover:bg-blue-100">
            <Link to={`/profile/${user.id}`}>{user.name}</Link>
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
