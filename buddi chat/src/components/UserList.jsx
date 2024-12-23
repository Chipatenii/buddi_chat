
import PropTypes from 'prop-types';

const UserList = ({ users }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">User List</h2>
            <ul className="space-y-2">
                {users.map((user, index) => (
                    <li key={index} className="text-gray-700">{user.name}</li>
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
