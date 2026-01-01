import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar, Loader } from '../components/ui';
import { APP_ROUTES } from '../constants';

const ChatSidebar = ({ users = [], loading }) => {
  return (
    <div className="h-100 d-flex flex-column p-4 overflow-auto custom-scrollbar">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h6 className="fw-bold m-0 text-secondary uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>Active Members</h6>
        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
            {users.length}
        </span>
      </div>
      
      {loading ? (
        <div className="flex-center py-5">
            <Loader size="md" />
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {users.map(user => (
            <Link 
              key={user.id} 
              to={`/profile/${user.id}`}
              className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none hover-bg transition-smooth border border-transparent hover-border-color"
            >
                <div className="position-relative">
                    <Avatar
                        src={user.profilePicture}
                        name={user.username || user.name}
                        size="md"
                        border
                    />
                    <div className="position-absolute bottom-0 end-0 bg-accent rounded-circle border border-2 border-surface-low" style={{ width: 12, height: 12 }} />
                </div>
                <div className="overflow-hidden">
                    <div className="fw-semibold text-white small text-truncate">{user.username || user.name}</div>
                    <div className="text-secondary opacity-50 text-truncate" style={{ fontSize: '0.65rem' }}>Active now</div>
                </div>
            </Link>
          ))}
          {!loading && users.length === 0 && (
            <div className="text-center py-5 opacity-50 small">No active users</div>
          )}
        </div>
      )}
    </div>
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
