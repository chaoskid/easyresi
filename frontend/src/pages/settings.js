import React from "react";
import '../index.css';
import Navbar from "../components/Navbar";

const Settings = () => {
    return (
        <>
            <Navbar />
            <div className="settings">
                <h1>Settings</h1>
                <p>View Settings here</p>
            </div>
        </>
    );
};

export default Settings;
