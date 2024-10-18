import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

import '../index.css';
import Navbar from "../components/Navbar";
import AdminNavbar from '../components/AdminNavbar';

const Settings = () => {
    const navigate = useNavigate();

    const [userType, setUserType] = useState('');


    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
            }
        } catch (err) { }
    };


    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
    }, []);
    return (
        <>
            {userType === 'admin' ? <AdminNavbar /> : <Navbar />}

            <div className="settings">
                <h1>Settings</h1>
                <p>View Settings here</p>
            </div>
        </>
    );
};

export default Settings;
