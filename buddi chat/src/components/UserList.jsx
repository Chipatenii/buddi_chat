import PropTypes from 'prop-types';

const UserList = ({ users }) => {
    return (
        <div className="p-4 border border-secondary rounded bg-white shadow-sm">
            <h2 className="h5 fw-bold mb-3">User List</h2>
            <ul className="list-unstyled">
                {users.map((user, index) => (
                    <li key={index} className="text-dark mb-2">{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

UserList.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default UserList;