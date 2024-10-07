import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';
import { ChakraProvider, Button, Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';



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

    const [progressState, setProgressState] = useState({
        percentage: null,
        isIndeterminate: true,
        color: 'blue.300',
        thickness: '12px', // Thickness of the progress bar
        size: '200px', // Size of the progress bar
    });



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
        updateProgress(null, true, 'blue.300', '200px', '12px');
        try {
            console.log("Logged in user is: " + loggedInUser)
            const response = await axios.get('/api/recommendations/'+loggedInUser); // Adjust the URL if needed
            var percent = (Math.round(response.data.data.probability_of_permanent_residency * 100) / 100);
            console.log(response);
            console.log(response.data.data.probability_of_permanent_residency);
            //findColor();

            // Update progress to 100% when request is complete
            updateProgress(percent, false, 'purple.400', '200px', '12px');
            console.log(response.data); // Handle the response as needed

        } catch (err) {
            updateProgress(100, false, 'red.400', '200px', '12px'); // Show error state
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

    const updateProgress = (percentage, isIndeterminate, color, size, thickness) => {
        setProgressState({ percentage, isIndeterminate, color, size, thickness });
    };


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
                {/* TODO: If indeterminate (while loading or not submitted? <CircularProgress {...progressMethod}>*/}
                <ChakraProvider>

                <Box display="flex" alignItems="center" justifyContent="center" height="200px">
                    {progressState.isIndeterminate ? (
                        <CircularProgress
                            isIndeterminate
                            color={progressState.color}
                            thickness={progressState.thickness}
                            size={progressState.size}
                        />
                    ) : (
                        <CircularProgress
                            value={progressState.percentage}
                            color={progressState.color}
                            thickness={progressState.thickness}
                            size={progressState.size}
                        >
                            <CircularProgressLabel>{progressState.percentage}%</CircularProgressLabel>
                        </CircularProgress>
                    )}
                </Box>
                </ChakraProvider>


            </div>
        </>
    );
};

export default Dashboard;
