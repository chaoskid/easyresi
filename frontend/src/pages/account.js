import React, { useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box } from '@chakra-ui/react';

const Account = () => {
    const navigate = useNavigate();

    // Check to see if logged in
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login'); // Adjust the URL if needed
            console.log(response);
            if (response.data.type === "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
        } catch (err) {
            // Handle error
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
    }, []);

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navbar />
            <Box flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <h1>Account</h1>
                <p>
                    View your account details and manage your settings here. You can update your profile, check your 
                    application status, and access personalized recommendations based on your input.
                </p>
            </Box>
            <Footer />
        </Box>
    );
};

export default Account;

