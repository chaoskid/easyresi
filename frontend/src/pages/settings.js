import React, { useState, useEffect } from "react";
import '../index.css';
import Navbar from "../components/Navbar";
import axios from '../axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "../components/Footer";
import AdminNavbar from '../components/AdminNavbar';
import Popup from '../components/Popup';







const Settings = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [userType, setUserType] = useState('');
    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Current Password',formData.current_password)
        if (formData.current_password) {
            console.log(formData.current_password)
            console.log('Current password is not null or empty');
            console.log('new password: ', formData.new_password)
            console.log('confirm new password: ', formData.confirm_new_password)
            if(formData.new_password){
                if((formData.new_password === formData.confirm_new_password)) {        
                    console.log('All good. sending to backend');   // wait for axios post request      
                    try {
                        console.log('Trying to update with password change')
                        const response = await axios.post('/api/profile', formData); // format needed. success (200) or error (400)
                        console.log('completed update with password change', response)
                        if (response.status === 200) {
                            alert('User details updated successfully');
                            console.log('User details updated successfully');
                            // navigate to the displaysettings page
                            navigate('/displaysettings', { state: { message: response.message } });
                        }
                    }
                    catch (err) { 
                        if(err.status === 409) {
                            setError(err.response.data.message)}
                        else {
                        setError('An unexpected error occurred. Please contact administrator');
                        }
                    }
                }  
                else {
                    setError('Passwords do not match');
                    console.log('Passwords do not match');
                }
        }
        else {
            setError('Please enter new password.');
            console.log('Please enter new password.');
        }
        }
        else {
            try {
                console.log('Trying to update without password change')
                const response = await axios.post('/api/profile', formData); // format needed. success (200) or error (400)
                if (response.status === 200) {
                    alert('User details updated successfully');
                    console.log('User details updated successfully');
                    // navigate to the displaysettings page
                    navigate('/displaysettings', { state: { message: response.message } });
                    }
                } catch (err) {
                    setError('Please enter new password.');
                    console.error('Error updating data:', err);
                }

        }
    };
    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('/api/profile'); // Adjust the URL if needed
            console.log(response);
            setFormData(response.data.data);
        } catch (err) {
            // navigate('/login', { state: { message: "Please log in" } });
            // setError('Failed to load dashboard data. Please try again later.');
        } finally {
            // setLoading(false);
        }
    };


    useEffect(() => {
        fetchSettingsData();
    }, []);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        current_password: '',
        new_password: '',
        confirm_new_password: ''
     }); 

    // Update form data state
    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
        console.log('Form Data: ', formData)
    };



    return (
        <>
            {userType === 'admin' ? <AdminNavbar /> : <Navbar />}
            <div className="settings">
                <h1>Settings</h1>
                <p>Update your account details</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="first_name"
                                pattern="[a-zA-Z]*"
                                title="Please enter a valid name"
                                value={formData.first_name || ''}
                                onChange={(e) => updateFormData('first_name', e.target.value)}

                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="last_name"
                                pattern="[a-zA-Z]*"
                                title="Please enter a valid name"
                                value={formData.last_name || ''}
                                onChange={(e) => updateFormData('last_name', e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Current Password:
                            <input
                                type="password"
                                name="current_password"
                                value={formData.current_password || ''}
                                onChange={(e) => updateFormData('current_password', e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            New Password:
                            <input
                                type="password"
                                name="new_password"
                                value={formData.new_password || ''}
                                onChange={(e) => updateFormData('new_password', e.target.value)}
                            />
                        </label>
                    </div>


                    <div className="form-field">
                        <label>
                            Confirm New Password:
                            <input
                                type="password"
                                name="confirm_new_password"
                                value={formData.confirm_new_password || ''}
                                onChange={(e) => updateFormData('confirm_new_password', e.target.value)}
                            />
                        </label>
                    </div>


                    <button type="submit" className="settings-button">Save Changes</button>
                </form>
            </div>
            <p>Error: {error}</p>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default Settings;