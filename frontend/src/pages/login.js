// src/Login.js
import React, { useState } from 'react';
import { redirect } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';



function Login() {
    // Constants
    // Set axios to include credentials (cookies) with every request
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            console.log(response); // Successful response

            if (response.status = 200) { 
                navigate('/dashboard', { state: { message: 'Logged out' } });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
