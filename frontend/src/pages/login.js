// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@chakra-ui/react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            if (response.data.success) { // Check if success from backend erorr throw (harrison)
                alert('Login successful');
                // Redirect or handle successful login
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <div className='login'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='email-container'>
                    <label className='email'>Email:</label>
                    <input className='login-input-1'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='password-container'>
                    <label className='password'>Password:</label>
                    <input className='login-input-2'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <Button type="submit" className='login-button' loadingText>Login</Button>
            </form>
        </div>
    );
}

export default Login;
