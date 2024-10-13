import React, { useEffect, useState } from "react";
import '../index.css';
import Navbar from "../components/Navbar";
import axios from '../axiosConfig';  // Assuming axios is configured for API requests
import { 
    Box, Heading, Text, Spinner, Alert, AlertIcon, Button, Divider, Stack, VStack 
} from '@chakra-ui/react';  // Chakra UI components for styling
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [userData, setUserData] = useState({}); // State to store user data
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(''); // State for error handling
    const navigate = useNavigate(); // For navigation

    // Fetch user details from the backend
    const fetchUserData = async () => {
        try {
            const response = await axios.get('/api/user-details'); // Replace with actual API
            setUserData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Unable to load your account details.');
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        // Clear session or authentication token
        sessionStorage.clear();
        navigate('/login');  // Redirect to login page
    };

    useEffect(() => {
        fetchUserData(); // Fetch user data on component mount
    }, []);

    return (
        <>
            <Navbar />
            <Box maxW="75%" mx="auto" mt={8} p={8} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="#F9FAFC">
                <Heading as="h1" mb={4} textAlign="center" color="teal.500">
                    Account Overview
                </Heading>

                {loading ? (
                    <Spinner size="xl" color="teal.500" thickness="4px" speed="0.65s" />
                ) : error ? (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                ) : (
                    <VStack spacing={6} align="start">
                        <Heading as="h2" size="md" color="gray.600">
                            Welcome, {userData.name || "User"}
                        </Heading>

                        <Text fontSize="lg">
                            <strong>Email:</strong> {userData.email}
                        </Text>
                        <Text fontSize="lg">
                            <strong>Phone:</strong> {userData.phone || "Not provided"}
                        </Text>
                        <Text fontSize="lg">
                            <strong>Address:</strong> {userData.address || "Not provided"}
                        </Text>
                        <Text fontSize="lg">
                            <strong>Account Created On:</strong> {new Date(userData.createdAt).toLocaleDateString()}
                        </Text>

                        <Divider />

                        <Heading as="h3" size="sm" color="teal.600">
                            Manage Your Account
                        </Heading>
                        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
                            <Button colorScheme="teal" variant="outline" onClick={() => navigate('/update-profile')}>
                                Update Profile
                            </Button>
                            <Button colorScheme="teal" variant="outline" onClick={() => navigate('/change-password')}>
                                Change Password
                            </Button>
                            <Button colorScheme="teal" variant="outline">
                                Manage Notifications
                            </Button>
                        </Stack>

                        <Divider />

                        <Button 
                            mt={6} 
                            colorScheme="red" 
                            onClick={handleLogout}
                            width={{ base: '100%', md: 'auto' }}
                        >
                            Logout
                        </Button>
                    </VStack>
                )}
            </Box>
        </>
    );
};

export default Account;
