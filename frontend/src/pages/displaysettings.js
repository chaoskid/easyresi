import React, { useState, useEffect } from "react";
import '../index.css';
import Navbar from "../components/Navbar";
import AgentNavbar from '../components/AgentNavbar';
import AdminNavbar from '../components/AdminNavbar';
import NothingNavbar from '../components/NothingNavbar';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

import Popup from '../components/Popup'; 

const DisplaySettings = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const navigate = useNavigate();
    
    const [error, setError] = useState('');const [userType, setUserType] = useState('');

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

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

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('/api/profile'); // Adjust the URL if needed
            setFormData(response.data.data);
        } catch (err) {
            setError('An unexpected error occurred fetching user details.. Please contact administrator');
        }
    };

    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.')
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
            }
        } catch (err) { 
            setError('Unable to submit your responses. Please try again later');}
    };

    useEffect(() => {
        fetchLogin();
        fetchSettingsData();
    }, []);

    const handleEditClick = () => {
        navigate('/settings');
    };

    return (
        <>
            {renderNavbar()}
            <div className="display-settings">
                <h1>Settings</h1>
                <p>View your account details</p>
                <div className="form-container">
                
                <label>First Name: {formData.first_name}</label>
                <label>Last Name: {formData.last_name}</label>
                <label>Email: {formData.email}</label>
                <button onClick={handleEditClick} className="settings-button">Edit User Details</button>
                </div>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default DisplaySettings;
