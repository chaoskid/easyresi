import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';


const Dashboard = () => {

    // State to store the welcome message
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch the welcome message from the backend
    const fetchDashboardData = async () => {
        try {
            // Make a GET request to the backend endpoint
            const response = await axios.get('http://localhost:5000/api/dashboard'); // Adjust the URL if needed
            console.log(response);
            setWelcomeMessage(response.data.message);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = async () => {
        try {
            // Send POST request to logout endpoint
            const response = await axios.post('http://127.0.0.1:5000/auth/logout', {}, { withCredentials: true });
            console.log(response.data.message); // Log success message or handle accordingly
            window.location.href = '/login'; // Adjust the path to your login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    // Render the dashboard with loading, error, and data states
    return (
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
    );
};

export default Dashboard;