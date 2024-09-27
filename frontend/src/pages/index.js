import React from "react";
import '../index.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    // Define navigate function
    const navigate = useNavigate();

    return (
        <>
            <div className="home">
                <h1>Welcome to Easy Resi</h1>
                <p>Please log in or register to get started.</p>
                <button className="login-button" onClick={() => navigate('/login')}>Login</button><br />
                <button className="register-button" onClick={() => navigate('/register')}>Register</button>
            </div>
        </>
    );
}

export default Home;