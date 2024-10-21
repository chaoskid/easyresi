import React, { useState, useEffect } from "react";
import { Box, Button, Container, Text, Heading, VStack, FormControl, FormLabel, Input, useToast, Flex } from '@chakra-ui/react';
import Navbar from "../components/Navbar"; // Make sure Navbar is correctly imported and styled
import AdminNavbar from '../components/AdminNavbar';
import Footer from "../components/Footer"; // Make sure Footer is correctly imported and styled
import Popup from '../components/Popup';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    });

    const handleClosePopup = () => {
        setError('');
    };

    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/profile', formData);
            if (response.status === 200) {
                toast({
                    title: "User details updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/displaysettings', { state: { message: response.data.message } });
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('/api/profile');
            setFormData(response.data.data);
        } catch (err) {
            setError('Failed to load user data');
        }
    };

    useEffect(() => {
        fetchSettingsData();
    }, []);

    return (
        <>
            <Flex direction="column" minH="100vh">
                {/* Navbar at the top */}
                {userType === 'admin' ? <AdminNavbar /> : <Navbar />}

                {/* Main content area */}
                <Flex flex="1" direction="column" justify="center" align="center" py={10}>
                    <Container maxW="container.md">
                        <VStack spacing={6} align="start">
                            <Heading as="h1" size="xl">Settings</Heading>
                            <Text fontSize="lg">Update your account details</Text>
                            <Box w="100%" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
                                <VStack spacing={4} align="start">
                                    <FormControl>
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => updateFormData('first_name', e.target.value)}
                                            pattern="[a-zA-Z]*"
                                            title="Please enter a valid name"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => updateFormData('last_name', e.target.value)}
                                            pattern="[a-zA-Z]*"
                                            title="Please enter a valid name"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateFormData('email', e.target.value)}
                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                            title="Please enter a valid email address"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Current Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={formData.current_password}
                                            onChange={(e) => updateFormData('current_password', e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>New Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={formData.new_password}
                                            onChange={(e) => updateFormData('new_password', e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={formData.confirm_new_password}
                                            onChange={(e) => updateFormData('confirm_new_password', e.target.value)}
                                        />
                                    </FormControl>

                                    <Button colorScheme="teal" type="submit" onClick={handleSubmit}>
                                        Save Changes
                                    </Button>
                                </VStack>
                            </Box>
                        </VStack>
                        {error && <Text color="red.500">Error: {error}</Text>}
                        <Popup error={error} onClose={handleClosePopup} />
                    </Container>
                </Flex>

                {/* Footer at the bottom */}
                <Footer />
            </Flex>
        </>
    );
};

export default Settings;

