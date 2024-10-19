import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import { Button } from '@chakra-ui/react'; // Import Button from Chakra UI

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [data, setData] = useState([]); // Ensure this is initialized as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userType, setUserType] = useState('');

    // Admin fetchlogin (apply to all admin pages)
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type !== "admin") {
                    navigate('/login', { state: { message: "User was not logged in as admin, redirecting to login..." } });
                }
            }
        } catch (err) { }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
            setWelcomeMessage(response.data.message);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/get_all_records');
            console.log(response.data); // For debugging
            const sortedData = response.data.sort((a, b) => a.data.user_id - b.data.user_id); // Sort by user_id
            setData(sortedData || []);  // Ensure correct path based on your API response
        } catch (err) {
            setError('Failed to load user data. Please try again later.');
        }
    };

    // Function to handle viewing a user
    const handleView = (user_id) => {
        navigate(`/user/${user_id}`);
    };

    // Function to handle editing a user
    const handleEdit = (user_id) => {
        sessionStorage.setItem('edit_user_id', user_id);
        navigate(`/adminedituser`);
    };

    const handleDelete = async (user_id) => {
        try {
            const response = await axios.delete(`/api/delete_user/${user_id}`); // Use backticks here
            console.log(response.data); // Handle the response as needed
            fetchUsers(); // Refresh the user data
        } catch (err) {
            console.error('Error while deleting user:', err.response ? err.response.data : err);
            setError('Failed to delete user. Please try again later.');
        }
    };

    useEffect(() => {
        fetchLogin();
        fetchDashboardData();
        fetchUsers();
    }, []);

    return (
        <>
            {userType === 'admin' ? <AdminNavbar /> : <Navbar />}
            <div className="dashboard">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div>
                        <h1>Dashboard</h1>
                        {/* Display Users in a Table */}
                        <h2>User Entries</h2>
                        {data.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>First Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Last Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Email</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>User Type</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Actions</th> {/* New Column */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((user) => (
                                        <tr key={user.data.user_id}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.first_name}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.last_name}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.email}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.user_type}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                                {/* <Button colorScheme="teal" margin="3px" onClick={() => handleView(user.data.user_id)}>View</Button> */}
                                                {/* View button is commented out for now, to disable viewing user details */}
                                                <Button colorScheme="teal" margin="3px" onClick={() => handleEdit(user.data.user_id)}>Edit</Button>
                                                <Button colorScheme="teal" margin="3px" onClick={() => handleDelete(user.data.user_id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No user data available.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminDashboard;
