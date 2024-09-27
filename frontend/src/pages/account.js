import React from "react";
import '../index.css';
import Navbar from "../components/Navbar";

const Account = () => {
    return (
        <>
            <Navbar />
            <div className="account">
                <h1>Account</h1>
                <p>
                    View your account details and manage your settings here. You can update your profile, check your 
                    application status, and  access personalized recommendations based on your input.
                </p>
            </div>
        </>
    );
};

export default Account;
