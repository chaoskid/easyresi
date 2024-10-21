import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Popup from '../components/Popup';
import { ChakraProvider, Button, Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progressState, setProgressState] = useState({
        percentage: null,
        isIndeterminate: true,
        color: 'blue.300',
        thickness: '12px',
        size: '200px',
    });

    const loggedInUser = sessionStorage.getItem('user_id');

    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError(response.data.message)
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
        } catch (err) { 
            setError('An unexpected error occurred');
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
            setWelcomeMessage(response.data.message);
            if (response.data.type === "error") {
                setError('Failed to load dashboard data. Please try again later.')
            }
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProbability = async () => {
        try {
            //const response = await axios.get(`/api/recommendations/${loggedInUser}`);
            const response = await axios.get(`/api/recommendations/15`);
            console.log('response.data.message',response.data.message)
            if (response.data.type === "error") {
                setError('Failed to load dashboard data. Please try again later.')
                console.log('response.data.message',response.data.message)
                console.log('error: ',error)
            }
            else{
            const percent = Math.round(response.data.data.probability_of_permanent_residency * 100) / 100;
            setData(response.data.data);
            updateProgress(percent, false, 'purple.400', '200px', '12px');
            }
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.')
            updateProgress(100, true, 'red.400', '200px', '12px');
        }
    };

    const updateProgress = (percentage, isIndeterminate, color, size, thickness) => {
        setProgressState({ percentage, isIndeterminate, color, size, thickness });
    };

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };


    useEffect(() => {
        fetchLogin();
        fetchDashboardData();
        fetchProbability();
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard">
                    <div>
                        <h1>Dashboard</h1>
                        <h2>{welcomeMessage}</h2>

                        {/*Display Probability in Chakra Circular Progress*/}

                        <div>
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

                        {/* Probability of Other Jobs */}
                        <h2>Probability of Other Jobs</h2>
                        {data && data.probability_of_other_jobs ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Job ID</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Probability (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data.probability_of_other_jobs).map(([jobId, probability]) => (
                                        <tr key={jobId}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{jobId}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{probability}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for probabilities of other jobs.</p>
                        )}

                        {/* Probability of Other States */}
                        <h2>Probability of Other States</h2>
                        {data && data.probability_of_other_states ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>State</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Probability (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data.probability_of_other_states).map(([state, probability]) => (
                                        <tr key={state}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{state}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{probability}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for probabilities of other states.</p>
                        )}

                        {/* Probability of Permanent Residency */}
                        <h2>Probability of Permanent Residency</h2>
                        <div>{data ? `Probability: ${data.probability_of_permanent_residency}%` : 'No data available.'}</div>

                        {/* University Recommendations Based on Fee */}
                        <h2>University Recommendations Based on Fee</h2>
                        {data && data.uni_recommendations_based_on_fee ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Course</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>University</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Fee</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Duration (Years)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.uni_recommendations_based_on_fee.map((uni, index) => (
                                        <tr key={index}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{uni.course}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{uni.uni}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>${uni.fee}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{uni.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No university recommendations based on fee available.</p>
                        )}

                        {/* University Recommendations Based on Rank */}
                        <h2>University Recommendations Based on Rank</h2>
                        {data && data.uni_recommendations_based_on_rank ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Course</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>University</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Rank</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Fee</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Duration (Years)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.uni_recommendations_based_on_rank.map((uni, index) => (
                                        <tr key={index}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{uni.course}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{uni.uni}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{uni.uni_rank}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>${uni.fee}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{uni.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No university recommendations based on rank available.</p>
                        )}
                    </div>
            
            

            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default Dashboard;
