// NOTE THAT THIS IS A PLACEHOLDER FILE THAT WILL BE CHANGED EVENTUALLY FOR DYNAMIC DATA - HARRISON

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import axios from '../axiosConfig'; // Assuming axios is configured for API requests
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Box, Text, Button, Select } from '@chakra-ui/react';

const Statistics = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [selectedStat, setSelectedStat] = useState('');


    // Check to see if logged in
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login'); // Adjust the URL if needed
            console.log(response);
            if (response.data.type == "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
        } catch (err) {
        } finally {
        }
    };

    // Fetch statistics data from the backend
    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/statistics'); // API call using axios
            setData(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchLogin();
        fetchStatistics(); // Fetch data on component mount
    }, []);

    return (
        <>
            <Navbar />
            <Box maxW="800px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
                <Text fontSize="2xl" mb={4}>Statistics</Text>

                {/* Dropdown for selecting statistics */}
                <Select
                    placeholder="Select a statistic"
                    onChange={(e) => setSelectedStat(e.target.value)}
                    mb={4}
                >
                    <option value="option1">Statistic Option 1</option>
                    <option value="option2">Statistic Option 2</option>
                </Select>

                {/* Display selected statistic */}
                <Button colorScheme="teal" onClick={() => console.log(selectedStat)}>
                    Show Selected Statistic
                </Button>

                {/* Display statistics data */}
                {data.length > 0 && (
                    <Box mt={4}>
                        <Text fontSize="lg">Statistics Data:</Text>
                        <pre>{JSON.stringify(data, null, 2)}</pre> {/* Pretty print data */}
                    </Box>
                )}
            </Box>
            <Footer /> 
        </>
    );
};

export default Statistics;
