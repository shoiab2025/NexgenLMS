import { useEffect,useState } from "react";
import { getUsers } from "../../api";


const Users = () => {
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUser(response);
                setLoading(false);
            }
            catch (error) {
                setError(error.message);
                console.error("Error fetching users:", error);
            }
            finally {
                
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>List of Users</h2>
            <ul>
            {users.length > 0 ? (
                users.map((user) => (
                <li key={user._id}>
                    <strong>Username:</strong> {user.username}, <strong>Email:</strong> {user.email}
                </li>
                ))
            ) : (
                <li>No users found</li>
            )}
            </ul>
        </div>
    );
};

export default Users;
