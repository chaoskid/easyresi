import React from "react";
import '../index.css';
import Navbar from '../components/Navbar';

// // Import axios if you plan to use it in the future
// import axios from '../axiosConfig';

// Home component - currently serves as a placeholder - don't think we actually need it
const Home = () => {
    return (
        <>
            <Navbar />
            <div className="home">
                <h1>Welcome to Easy Resi</h1>
            </div>
        </>
    );
}

export default Home;
