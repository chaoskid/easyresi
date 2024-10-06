import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'


import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    // State variables for welcome message, loading status, and error handling
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [percentage, setPercentage] = useState(''); // TODO: string?
    const [customColor, setCustomColor] = useState('');

    const loggedInUser = sessionStorage.getItem('user_id');

    const [value, setValue] = useState(0); // integer state



    // Function to fetch the welcome message from the backend
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard'); // Adjust the URL if needed
            console.log(response);
            setWelcomeMessage(response.data.message);
        } catch (err) {
            navigate('/login', { state: { message: "Please log in" } });
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProbability = async () => {
        try {
            const response = await axios.get('/api/recommendations/'+loggedInUser); // Adjust the URL if needed
            console.log(response);
            setPercentage(Math.round(response.data.probability_of_permanent_residency * 100) / 100);
            findColor();
            console.log(customColor);

        } catch (err) {
        }
    }


    const findColor = async() => {
        if (percentage <= 25.00) {
            setCustomColor('red.400');
        }
        else if (percentage < 50.00 && percentage >= 24.00) {
            setCustomColor('orange.400');
        }
        else if (percentage < 75.00 && percentage >= 49.00) {
            setCustomColor('blue.400');
        }
        else if (percentage >= 75.00) {
            setCustomColor('green.400');
        }
        else {
            setCustomColor('purple.400');
        }
    }


    // Fetch data when the component mounts
    useEffect(() => {
        fetchDashboardData();
        fetchProbability();
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        try {
            const response = await axios.post('/auth/logout', {});
            console.log(response.data.message); // Log success message or handle accordingly
            window.location.href = '/login'; // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Render the dashboard with loading, error, and data states
    return (
        <>
            <Navbar />
            <div className="dashboard">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div>
                        <h1>Dashboard</h1>
                        <h2>{welcomeMessage}</h2>
                        {/*<button className="logout-button" onClick={handleLogout}>Logout</button>*/}
                    </div>


                )}
                {/* TODO: Dynamic values from prediction model */}
                {/* TODO: If indeterminate (while loading or not submitted? */}
                if (
                <CircularProgress thickness='12px' size="200px" isIndeterminate color='blue.300'>
                    <CircularProgressLabel>Erm</CircularProgressLabel>
                </CircularProgress>
                <CircularProgress value={percentage} color={customColor} thickness='12px' size="200px"  >
                    <CircularProgressLabel>{percentage}%</CircularProgressLabel>
                </CircularProgress>


            </div>
        </>
    );
};

export default Dashboard;
