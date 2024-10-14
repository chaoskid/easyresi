import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

import '../index.css';
import Navbar from "../components/Navbar";

const Account = () => {
    const navigate = useNavigate();

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

    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
    }, []);

    return (
        <>
            <Navbar />
            <div className="account">
                <h1>Account</h1>
                <p>
                    View your account details and manage your settings here. You can update your profile, check your 
                    application status, and access personalized recommendations based on your input.
                </p>
            </div>
        </>
    );
};

export default Account;
