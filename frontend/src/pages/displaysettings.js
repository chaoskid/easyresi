import React, { useState, useEffect } from "react";
import '../index.css';
import Navbar from "../components/Navbar";
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const DisplaySettings = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const navigate = useNavigate();

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('/api/profile'); // Adjust the URL if needed
            setFormData(response.data.data);
        } catch (err) {
            console.error("Failed to load user details.");
        }
    };

    useEffect(() => {
        fetchSettingsData();
    }, []);

    const handleEditClick = () => {
        navigate('/settings');
    };

    return (
        <>
            <Navbar />
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
        </>
    );
};

export default DisplaySettings;
