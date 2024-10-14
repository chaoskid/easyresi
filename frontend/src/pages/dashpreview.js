import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';
import { ChakraProvider, Button, Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';



import { useNavigate, useLocation } from 'react-router-dom';

const Dashpreview = () => {
    const navigate = useNavigate();
    // State variables for welcome message, loading status, and error handling
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [percentage, setPercentage] = useState(''); // TODO: string?
    const [customColor, setCustomColor] = useState('');


    const [value, setValue] = useState(0); // integer state



    // Location and data
    const location = useLocation();
    const locationData = location.state?.data;


    const [progressState, setProgressState] = useState({
        percentage: null,
        isIndeterminate: true,
        color: 'blue.300',
        thickness: '12px', // Thickness of the progress bar
        size: '200px', // Size of the progress bar
    });

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

    const findColor = async () => {
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

    const displayProbability = async () => {
        updateProgress(null, true, 'blue.300', '200px', '12px');
        try {
            var percent = (Math.round(locationData.data.probability_of_permanent_residency * 100) / 100);
            console.log(locationData.data.probability_of_permanent_residency);

            updateProgress(percent, false, 'purple.400', '200px', '12px');
            console.log("Location data and user id:");
            console.log(locationData.data);
            console.log(sessionStorage.getItem('user_id'));


        } catch (err) {
            updateProgress(100, false, 'red.400', '200px', '12px'); // Show error state
        }
    }

    const handleAccept = async (e) => {
        e.preventDefault();
        try {
            console.log('Success:', locationData.data.user_input_for_prefill_or_save);
            const response = await axios.post('/api/questionnaire', locationData.data.user_input_for_prefill_or_save);  // API call using axios
            if (response.status === 200) {
                navigate('/dashboard');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleRevert = async (e) => {
        e.preventDefault();
        navigate('/questionnaire', { state: { data: locationData.data.user_input_for_prefill_or_save } }); 
    }


    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
        displayProbability();
    }, []);

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
                        <h1>Preview Results</h1>
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
                    <br /><br />
                    <Button colorScheme="teal" onClick={handleAccept}>Accept Changes</Button><br /><br />
                    <Button colorScheme="teal" onClick={handleRevert}>Revert</Button>
                </ChakraProvider>


            </div>
        </>
    );
};

export default Dashpreview;
