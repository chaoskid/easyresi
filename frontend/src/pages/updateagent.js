import React, { useState, useEffect } from "react";
import '../index.css';
import axios from '../axiosConfig'; // Assuming axios is configured for API requests
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import AdminNavbar from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import { Box, Text, Button, Select } from '@chakra-ui/react';

const UpdateAgent = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');

    const renderNavbar = () => {
        switch (userType) {
            case 'admin':
                return <AdminNavbar />;
            case 'agent':
                return <AgentNavbar />;
            case 'applicant':
                return <Navbar />;
            default:
                return <NothingNavbar />; // Render a default or blank navbar if no user_type
        }
    };
    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };


    // Admin fetchlogin (apply to all admin pages)
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.')
                navigate('/login', { state: { message: "User was not logged in, redirecting to login." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type !== "admin") {
                    setError('unauthorized Access. Please log in as administrator.')
                    navigate('/login', { state: { message: "User was not logged in as admin, redirecting to login..." } });
                }
            }
        } catch (err) { 
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    // Fetch statistics data from the backend
    const fetchAgentsAndUsers = async () => {
        try {
            const response = await axios.get('/admin/update_agents'); // API call using axios
            setData(response.data.data);
            console.log('get-api-data', data);
        } catch (error) {
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/update_agents', formData);  // API call using axios
            console.log('Success:', response.data);
            if (response.status === 200) {
                navigate('/admindashboard', { state: { data: response.data } });
            }
        } catch (error) {
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    // Function to update form data state
    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    useEffect(() => {
        fetchAgentsAndUsers();
        fetchLogin();
    }, []);

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {renderNavbar()}
            <Box 
                display="block" 
                width="800px" 
                mx="auto" 
                mt={8} 
                mb="auto" // Allow this box to take up space but not push the footer down
                p={6} 
                borderWidth="1px" 
                borderRadius="lg" 
                boxShadow="lg" 
                bg="white" 
                flexShrink="0" // Prevents the box from growing unnecessarily
            >
                <form onSubmit={handleFormSubmit}>
                    <Text fontSize="2xl" mb={4}>Update Users to Agent</Text>

                    {/* Dropdown for selecting statistics */}
                    <Select
                        placeholder="Select an agent"
                        onChange={(e) => updateFormData("agent_id", e.target.value)}
                        mb={4}
                    >
                        {data.agents && data.agents.length > 0 ? (
                            data.agents.map(agent => (
                                <option key={agent.user_id} value={agent.user_id}>
                                    {`${agent.firstname} ${agent.lastname}`}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading agents...</option>
                        )}
                    </Select>

                    {/* Dropdown for selecting statistics */}
                    <Select
                        placeholder="Select a user"
                        onChange={(e) => updateFormData("user_id", e.target.value)}
                        mb={4}
                    >
                        {data.users && data.users.length > 0 ? (
                            data.users.map(user => (
                                <option key={user.user_id} value={user.user_id}>
                                    {`${user.firstname} ${user.lastname}`}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading users...</option>
                        )}
                    </Select>

                    {/* Display selected statistic */}
                    <Button colorScheme="teal" type="submit">
                        Update Agent
                    </Button>
                </form>
            </Box>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </Box>
    );
};

export default UpdateAgent;

