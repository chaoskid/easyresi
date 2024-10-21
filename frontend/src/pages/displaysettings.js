import React, { useState, useEffect } from "react";
import { Box, Button, Container, Text, Heading, VStack, useToast, Flex } from '@chakra-ui/react';
import Navbar from "../components/Navbar";
import axios from '../axiosConfig';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

const DisplaySettings = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const navigate = useNavigate();
    const toast = useToast();

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('/api/profile'); // Adjust the URL if needed
            setFormData(response.data.data);
        } catch (err) {
            toast({
                title: "Failed to load user details.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchSettingsData();
    }, []);

    const handleEditClick = () => {
        navigate('/settings');
    };

    return (
        <>
        <div className="displaysettings">
            <Flex direction="column" minH="100vh">
                <Navbar />
                <Flex flex="1" direction="column">
                    <Container maxW="container.md" py={8} flex="1">
                        <VStack spacing={6} align="start">
                            <Heading as="h1" size="xl">Settings</Heading>
                            <Text fontSize="lg">View your account details</Text>
                            <Box w="100%" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
                                <VStack spacing={4} align="start">
                                    <Text fontWeight="bold">First Name: <Text as="span" fontWeight="normal">{formData.first_name}</Text></Text>
                                    <Text fontWeight="bold">Last Name: <Text as="span" fontWeight="normal">{formData.last_name}</Text></Text>
                                    <Text fontWeight="bold">Email: <Text as="span" fontWeight="normal">{formData.email}</Text></Text>
                                    <Button colorScheme="teal" onClick={handleEditClick}>
                                        Edit User Details
                                    </Button>
                                </VStack>
                            </Box>
                        </VStack>
                    </Container>
                </Flex>
                <Footer />
            </Flex>
            </div>
        </>
    );
};

export default DisplaySettings;
