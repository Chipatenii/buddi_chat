import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar, Loader } from '../components/ui';
import { APP_ROUTES } from '../constants';

const ChatSidebar = ({ users = [], loading }) => {
  return (
    <aside className="chat-sidebar">
      <h2 className="sidebar-heading">Active Users</h2>
      
      {loading ? (
        <Loader variant="section" />
      ) : (
        <ul className="user-list">
          {users.map(user => (
            <li key={user.id} className="user-list-item">
              <Link 
                to={`${APP_ROUTES.PROFILE}/${user.id}`}
                className="user-link"
              >
                <Avatar
                  src={user.profilePicture}
                  name={user.name}
                  size="sm"
                />
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  {user.bio && (
                    <p className="user-bio text-truncate">{user.bio}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      {!loading && users.length === 0 && (
        <div className="empty-state">No active users</div>
      )}
    </aside>
  );
};

ChatSidebar.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
      bio: PropTypes.string
    })
  ),
  loading: PropTypes.bool.isRequired
};

ChatSidebar.defaultProps = {
  users: []
};

export default ChatSidebar;