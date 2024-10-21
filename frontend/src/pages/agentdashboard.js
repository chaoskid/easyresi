import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AgentNavbar from '../components/AgentNavbar';
import { Button } from '@chakra-ui/react'; // Import Button from Chakra UI

const AgentDashboard = () => {
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
                if (response.data.data.user_type !== "agent") {
                    navigate('/login', { state: { message: "User was not logged in as agent, redirecting to login..." } });
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
            // Fetch only applicants managed by the agent
            const response = await axios.get('/api/agent_applicants'); // New API endpoint
            console.log(response.data); // For debugging
            setData(response.data || []); // Set the data (applicants) received from the API
        } catch (err) {
            setError('Failed to load applicants data. Please try again later.');
        }
    };
    

    // Function to handle viewing a user
    const handleView = (user_id) => {
        sessionStorage.setItem('checking_user_id', user_id)
        navigate(`/dashboard`);
    };

    // Function to handle editing a user
    const handleUpdate = (user_id) => {
        sessionStorage.setItem('checking_user_id', user_id);
        navigate(`/questionnaire`);
    };


    useEffect(() => {
        fetchLogin();
        fetchDashboardData();
        fetchUsers();
    }, []);

    return (
        <>
            {userType === 'agent' ? <AgentNavbar /> : <Navbar />}
            <div className="dashboard">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div>
                        <h1>Dashboard</h1>
                        {/* Display Users in a Table */}
                        <h2>Your Clients</h2>
                        {data.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>First Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Last Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Email</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Actions</th> {/* New Column */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((user) => (
                                        <tr key={user.data.user_id}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.first_name}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.last_name}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.email}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                                <Button colorScheme="teal" margin="3px" onClick={() => handleView(user.data.user_id)}>View</Button>
                                                <Button colorScheme="teal" margin="3px" onClick={() => handleUpdate(user.data.user_id)}>Update</Button>
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

export default AgentDashboard;
