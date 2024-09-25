import React, { useState } from 'react';
<<<<<<< HEAD
=======
import { redirect } from "react-router-dom";
>>>>>>> origin/main
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import {
    Box, FormControl, FormLabel, Select, RadioGroup, Radio, Checkbox,
    Button, Stack, CheckboxGroup, Text, Input
} from '@chakra-ui/react';

function Login() {
    // Constants
    const navigate = useNavigate();

    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            console.log(response); // Successful response

            // Check if the response status is 200
            if (response.status === 200) { 
                navigate('/', { state: { message: 'Logged in' } });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('An error occurred, please try again');
        }
    };

    return (
        <div className='login'>
<<<<<<< HEAD
            <h1><strong>Easy Resi</strong></h1>
            <p>The easy way to find your best pathway to permanent residency in Australia.</p>
            <div className='login-container'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='email-container'>
                        <label className='email'>Email:</label>
                        <input 
                            className='login-input-1'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='password-container'>
                        <label className='password'>Password:</label>
                        <input 
                            className='login-input-2'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" className='login-button'>Login</button>
                    <button 
                        type="button" 
                        className='register-button' 
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </form>
            </div>
=======
            <h1>Login</h1>
            <Box maxW="800px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
            <form onSubmit={handleSubmit}>
                <div className='email-container'>
                    <label className='email'>Email:</label>
                    <Input className='login-input-1'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='password-container'>
                    <label className='password'>Password:</label>
                    <Input className='login-input-2'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>

                {error && <div className="error">{error}</div>}
                <Button type="submit" className='login-button' loadingText>Login</Button>
                </form>
                </Box>
>>>>>>> origin/main
        </div>
    );
}

export default Login;

