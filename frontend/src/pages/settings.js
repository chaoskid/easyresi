import React, { useState, useEffect } from "react";
import '../index.css';
import Navbar from "../components/Navbar";
import axios from '../axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "../components/Footer";
import AdminNavbar from '../components/AdminNavbar';






const Settings = () => {
    const [data, setData] = useState('');
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('User Details Submitted:', formData);
        if (formData.current_password !== null || formData.current_password !== '') {
            console.log('Current password is not null or empty');
            // check if both new and confirm pw should match and not null.
            if((formData.new_password === formData.confirm_new_password) && formData.new_password != '') {           
                console.log('All good. sending to backend');   // wait for axios post request      
                const response = axios.post('/api/profile', formData); // format needed. success (200) or error (400)
                if (response.status === 200) {
                    alert('User details updated successfully');
                    console.log('User details updated successfully');
                    // navigate to the displaysettings page
                    navigate('/displaysettings', { state: { message: response.message } });
                }
                else {
                    alert('Something went wrong.');
                    console.log('Something went wrong.');
                }
            }  
            else {
                alert('Passwords do not match');
                console.log('Passwords do not match');
            }
        }
        else {
            const response = axios.post('/api/profile', formData); // format needed. success (200) or error (400)
            if (response.status === 200) {
                alert('User details updated successfully');
                console.log('User details updated successfully');
                // navigate to the displaysettings page
                navigate('/displaysettings', { state: { message: response.message } });
            }
            else {
                alert('Something went wrong.');
                console.log('Something went wrong.');
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

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                                onChange={handleChange}

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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                            />
                        </label>
                    </div>


                    <button type="submit" className="settings-button">Save Changes</button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Settings;