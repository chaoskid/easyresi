import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Popup from '../components/Popup';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer'; 
import { ChakraProvider, Button, Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashpreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationData = location.state?.data;
    const [error, setError] = useState('');
    const [progressState, setProgressState] = useState({
        percentage: null,
        isIndeterminate: true,
        color: 'blue.300',
        thickness: '12px',
        size: '200px',
    });
    const [data, setData] = useState(null);
    const [occupations, setOccupations] = useState([]);
    const [userType, setUserType] = useState('');

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

    // Check if logged in
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.')
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
        } catch (err) { 
            setError('Unable to submit your responses. Please try again later');}
    };

    const updateProgress = (percentage, isIndeterminate, color, size, thickness) => {
        setProgressState({ percentage, isIndeterminate, color, size, thickness });
    };

    const displayProbability = async () => {
        updateProgress(null, true, 'blue.300', '200px', '12px');
        try {
            const percent = Math.round(locationData.data.probability_of_permanent_residency * 100) / 100;
            updateProgress(percent, false, 'purple.400', '200px', '12px');
            setData(locationData.data);
        } catch (err) {
            setError('Unable to submit your responses. Please try again later');
            updateProgress(100, false, 'red.400', '200px', '12px');
        }
    };

    const handleAccept = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/questionnaire', locationData.data.user_input_for_prefill_or_save);
            if (response.status === 200) {
                navigate('/dashboard');
            } else {
                setError('Unable to submit your responses. Please try again later');
            }
        } catch (error) {
            setError('Unable to submit your responses. Please try again later');
        }
    };

    const handleRevert = async (e) => {
        e.preventDefault();
        navigate('/questionnaire', { state: { data: locationData.data.user_input_for_prefill_or_save } });
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

    useEffect(() => {
        fetchLogin();
        fetchQuest();
        displayProbability();
    }, []);

    return (
        <>
            {userType === 'admin' ? <AdminNavbar /> : <Navbar />}
            <div className="dashboard">
                    <div>
                        <h1>Preview Results</h1>
                        {/*Display Probability in Chakra Circular Progress*/}
                        
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
                        </div>
                        <h2>Probability for Other Occupations</h2>
                        {data && data.probability_of_other_jobs ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>ANZCO</th>
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
                    </div>
            <br />
                    
                    <br /><br />
                    <Box>
                    <Button
                    sx={{
                        backgroundColor: '#008080',
                        color: '#ffffff',
                        padding: '6px 12px',
                        fontSize: '14px',
                        height: '35px',
                        fontWeight: '400',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                        marginRight: '10px',
                        border: 'none',
                        _hover: { backgroundColor: '#003366', transform: 'scale(1.05)' },
                        _focus: { outline: 'none', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' },
                    }}
                    onClick={handleAccept}
                    >
                    Accept Results
                    </Button>
                    <Button
                    sx={{
                        backgroundColor: '#008080',
                        color: '#ffffff',
                        padding: '6px 12px',
                        fontSize: '14px',
                        height: '35px',
                        fontWeight: '400',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                        marginRight: '10px',
                        border: 'none',
                        _hover: { backgroundColor: '#003366', transform: 'scale(1.05)' },
                        _focus: { outline: 'none', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' },
                    }}
                    onClick={handleRevert}
                    >
                    Revert
                    </Button>
                </Box>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default Dashpreview;


