import React, { useState } from "react";
import '../index.css';
import Navbar from "../components/Navbar";

const Settings = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('User Details Submitted:', userDetails);
    };

    return (
        <>
            <Navbar />
            <div className="settings">
                <h1>Settings</h1>
                <p>Update your account details</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={userDetails.firstName}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={userDetails.lastName}
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
                                value={userDetails.email}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={userDetails.password}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <button type="submit" className="settings-button">Save Changes</button>
                </form>
            </div>
        </>
    );
};

export default Settings;
