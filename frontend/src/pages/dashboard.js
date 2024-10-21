import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Popup from '../components/Popup';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import { ChakraProvider, Box, CircularProgress, CircularProgressLabel, Button } from '@chakra-ui/react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [progressState, setProgressState] = useState({
        percentage: null,
        isIndeterminate: true,
        color: 'blue.300',
        thickness: '12px',
        size: '200px',
    });
    const [isQuestionnaireFilled, setIsQuestionnaireFilled] = useState(null); // To store the questionnaire submission status
    const [userType, setUserType] = useState('');
    const [occupations, setOccupations] = useState([]);

    const loggedInUser = sessionStorage.getItem('user_id');
    const checkingUser = sessionStorage.getItem('checking_user_id');
    console.log('checkingUSer: ',checkingUser)
    console.log('loggedInUser: ',loggedInUser)

    const renderNavbar = () => {
        switch (userType) {
            case 'admin':
                return <AdminNavbar />;
            case 'agent':
                return <AgentNavbar />;
            case 'applicant':
                return <Navbar />;
            default:
                return <NothingNavbar />; // Render a default or blank navbar if no user_type
        }
    };

    // Function to check if the questionnaire is filled
    const checkQuestionnaireSubmission = async () => {
        try {
            
            const userIdToFetch = checkingUser || loggedInUser;
            const response = await axios.get(`/api/check_questionnaire_submission/${userIdToFetch}`);
            if (response.data.type === 'success') {
                setIsQuestionnaireFilled(true);
            } else {
                setIsQuestionnaireFilled(false);
            }
        } catch (err) {
            if(err.status === 404) {
                setError('Unable to load dashboard. Please complete the permanent residency questionnaire to get recommendations')}
            else {
            setError('An unexpected error occurred while fetching data. Please contact administrator');
            }
        }
    };

    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.');
                navigate('/login', { state: { message: "User was not logged in, redirecting to login." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: "Admin detected" } });
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please contact administrator.');
        }
    };

    const fetchQuest = async () => {
        try {
            const response = await axios.get(`/api/questionnaire/${loggedInUser}`);
            setOccupations(response.data.data.occupations);
        } catch (err) {
            setError('Failed to load occupations. Please try again later.');
        }
    };

    const getJobTitleByAnzsco = (anzsco) => {
        const anzscoNumber = Number(anzsco);
        if (occupations && typeof occupations === 'object') {
            const allOccupations = Object.values(occupations).flatMap(category => category);
            for (const occupation of allOccupations) {
                if (Number(occupation.anzsco) === anzscoNumber) {
                    return occupation.occupation;
                }
            }
        }
        return 'Unknown Job Title';
    };

    const fetchProbability = async () => {
        try {
            const userIdToFetch = checkingUser || loggedInUser;
            const response = await axios.get(`/api/recommendations/${userIdToFetch}`);
            if (response.data.type === "error") {
                setError('Failed to load dashboard data. Please try again later.');
            } else {
                const percent = Math.round(response.data.data.probability_of_permanent_residency * 100) / 100;
                setData(response.data.data);
                updateProgress(percent, false, 'purple.400', '200px', '12px');
            }
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
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
        checkQuestionnaireSubmission(); // Check questionnaire submission status
    }, []);

    useEffect(() => {
        if (isQuestionnaireFilled) {
            fetchQuest();
            fetchProbability();
        }
    }, [isQuestionnaireFilled]);

    //if (isQuestionnaireFilled === null) {
    //    return <p>Loading...</p>; // Show loading while checking submission status
    //}

    return (
        <>
            {renderNavbar()}
            <div className="dashboard">
                {isQuestionnaireFilled ? (
                    <div>
                        <h1>Applicant Dashboard</h1>
                        <h2>Your Chances of Getting Permanent Residency</h2>
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
                            <br />
                        </div>
                        <h2>Probability for Other Occupations</h2>
                                {data && data.probability_of_other_jobs ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>ANZSCO</th>
                                                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Job Title</th>
                                                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Probability (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(data.probability_of_other_jobs).map(([jobId, probability]) => {
                                                const jobTitle = getJobTitleByAnzsco(jobId); // Use the anzsco code directly
                                                return (
                                                    <tr key={jobId}>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{jobId}</td>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{jobTitle}</td>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{probability}</td>
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
                            <p>No university recommendations based on rank available.</p>
                        )}
                    </div>
                ) : (
                    <Box minH="100vh" flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <h2>Please complete the permanent residency questionnaire to get recommendations</h2>
                        <Button colorScheme="teal" onClick={() => navigate('/questionnaire')}>
                            Go to Questionnaire
                        </Button>
                    </Box>
                )}
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default Dashboard;