import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AdminNavbar  from '../components/AdminNavbar';
import { ChakraProvider, Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

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

    const [userType, setUserType] = useState('');
    const [occupations, setOccupations] = useState([]);


    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: "Admin detected" } });
                }
            }
        } catch (err) { }
    };
    const fetchQuest = async () => {
        try {
            const response = await axios.get('/api/questionnaire');
            setOccupations(response.data.data.occupations);
        } catch (err) {
            setError('Failed to load occupations. Please try again later.');
        }
    };
    const getJobTitleByAnzsco = (anzsco) => {
        // Convert the input anzsco to a number
        const anzscoNumber = Number(anzsco);

        // Check if occupations is an object
        if (occupations && typeof occupations === 'object') {
            // Use flatMap to create a flattened array of occupations
            const allOccupations = Object.values(occupations).flatMap(category => category);

            // Loop through all occupations to find the corresponding anzsco code
            for (const occupation of allOccupations) {
                // Convert the occupation's anzsco to a number for comparison
                if (Number(occupation.anzsco) === anzscoNumber) {
                    //console.log(occupation.jobTitle);
                    return occupation.occupation; // Return the job title if found
                }
            }
        }
        return 'Unknown Job Title'; // Fallback if no match is found
    };
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
            setWelcomeMessage(response.data.message);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProbability = async () => {
        try {
            const response = await axios.get(`/api/recommendations/${loggedInUser}`);
            const percent = Math.round(response.data.data.probability_of_permanent_residency * 100) / 100;
            setData(response.data.data);
            updateProgress(percent, false, 'purple.400', '200px', '12px');
        } catch (err) {
            updateProgress(100, true, 'blue.400', '200px', '12px');
        }
    };

    const updateProgress = (percentage, isIndeterminate, color, size, thickness) => {
        setProgressState({ percentage, isIndeterminate, color, size, thickness });
    };

    useEffect(() => {
        fetchLogin();
        fetchQuest();
        fetchDashboardData();
        fetchProbability();
    }, []);

    return (
        <>
            {userType === 'admin' ? <AdminNavbar /> : <Navbar />}
            <div className="dashboard">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div>
                        <h1>Dashboard</h1>
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
                                {data && data.probability_of_other_jobs ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Job ID</th>
                                                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Probability (%)</th>
                                                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Job Title</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(data.probability_of_other_jobs).map(([jobId, probability]) => {
                                                const jobTitle = getJobTitleByAnzsco(jobId); // Use the anzsco code directly
                                                return (
                                                    <tr key={jobId}>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{jobId}</td>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{probability}</td>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{jobTitle}</td>
                                                    </tr>
                                                );
                                            })}
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
                                    {Object.entries(data.probability_of_other_states)
                                        .sort(([, probA], [, probB]) => probB - probA) // Sort by probability descending
                                        .map(([state, probability]) => (
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

                        {/*Cost of Living Annual Fee*/} 
                        <h2>Cost of Living Annual Fee</h2> 
                        {data && data.cost_of_living ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Cost of Living</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Annual Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data.cost_of_living).map(([key, value]) => {
                                        const displayKey = key === 'min_cost' ? 'Minimum Cost' : key === 'max_cost' ? 'Maximum Cost' : key;
                                        return (
                                            <tr key={key}>
                                                <td style={{ border: '1px solid black', padding: '8px' }}>{displayKey}</td>
                                                <td style={{ border: '1px solid black', padding: '8px' }}>${value}</td>
                                            </tr>
                                        );
                                    })}                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for cost of living annual fee.</p> 
                        )} 
                        
                        
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;
