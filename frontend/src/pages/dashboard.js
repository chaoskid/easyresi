import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    // State variables for welcome message, loading status, and error handling
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch the welcome message from the backend
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/dashboard'); // Adjust the URL if needed
            console.log(response);
            setWelcomeMessage(response.data.message);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchDashboardData();
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
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div>
                        <h1>Dashboard</h1>
                        <h2>{welcomeMessage}</h2>
                        <button id="logout" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;
