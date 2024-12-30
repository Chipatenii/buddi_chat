import PropTypes from 'prop-types';

const UserList = ({ users }) => {
    return (
        <div className="p-4">
            <h2 className="h5 fw-bold">User List</h2>
            <ul className="list-unstyled">
                {users.map((user, index) => (
                    <li key={index} className="text-dark">{user.name}</li>
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