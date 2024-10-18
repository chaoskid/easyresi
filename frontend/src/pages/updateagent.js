// NOTE THAT THIS IS A PLACEHOLDER FILE THAT WILL BE CHANGED EVENTUALLY FOR DYNAMIC DATA

import React, { useState, useEffect } from "react";
import '../index.css';
import axios from '../axiosConfig'; // Assuming axios is configured for API requests
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { Box, Text, Button, Select } from '@chakra-ui/react';

const UpdateAgent = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});

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

    // Fetch statistics data from the backend
    const fetchAgentsAndUsers = async () => {
        try {
            const response = await axios.get('/admin/update_agents'); // API call using axios
            setData(response.data.data);
            console.log('get-api-data',data)
        } catch (error) {
            console.error('Error fetching agents and users:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/update_agents', formData);  // API call using axios
            console.log('Success:', response.data);
            if (response.status === 200) {
                //navigate('/dashpreview', { state: { data: response.data } });
            }
        } catch (error) {
            console.error('Error:', error);
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
        fetchLogin();
        fetchAgentsAndUsers();
    }, []);

    return (
        <>
            {userType === 'admin' ? <AdminNavbar /> : <Navbar />}
            <Box maxW="800px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
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
                    placeholder="Select an user"
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
        </>
    );
};

export default UpdateAgent;
