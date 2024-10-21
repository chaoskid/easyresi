import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import '../index.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminNavbar from '../components/AdminNavbar';


const Account = () => {
    const navigate = useNavigate();
    
    const [error, setError] = useState('');

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

    const [userType, setUserType] = useState('');


    // Admin fetchlogin (apply to all admin pages)
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login...')
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
            }
        } catch (err) { 
            setError('Unexpected error occured. Please contact administrator')
        }
    };


    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
    }, []);

    return (
        <>
            {userType === 'admin' ? <AdminNavbar /> : <Navbar />}
            <div className="account">
                <h1>Account</h1>
                <p>
                    View your account details and manage your settings here. You can update your profile, check your 
                    application status, and access personalized recommendations based on your input.
                </p>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default Account;
