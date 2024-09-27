import React, { useState } from 'react';
import '../App.js';
import axios from '../axiosConfig';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import {
    Box, FormControl, FormLabel, Select, RadioGroup, Radio, Checkbox,
    Button, Stack, CheckboxGroup, Text, Input
} from '@chakra-ui/react';
//import { useNavigate } from 'react-router-dom'; // TODO NAVIGATE
>>>>>>> origin/main

const FormComponent = () => {
    // State to store user input and errors
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        pass: '',
        repass: '',
    });
    const [error, setError] = useState('');
<<<<<<< HEAD
    const navigate = useNavigate();
=======
    //const submitbutton = document.getElementById('submit');
>>>>>>> origin/main

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation for passwords
        if (name === 'repass' || name === 'pass') {
            if (value !== formData.pass && name === 'repass') {
                setError('Passwords do not match');
            } else if (value === '') {
                setError('Password cannot be empty');
            } else {
                setError('');
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

<<<<<<< HEAD
        // Check password match
        if (formData.repass !== formData.pass) {
=======


        // Real-time validation
        if (name === 'repass' || name === 'pass') {
            if (value === '') {
                setError('password cannot be empty')
            }
        }
        if ((formData.repass !== formData.pass) || (formData.pass !== formData.repass)) {
>>>>>>> origin/main
            setError('Passwords do not match');
            return;
        } else {
            setError('');
<<<<<<< HEAD
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/register', formData);
            console.log(response.data); // Handle response from backend
            navigate('/', { state: { message: 'Registered' } }); // Navigate after successful registration
        } catch (error) {
            console.error('There was an error submitting the form!', error);
            setError('An error occurred while registering. Please try again.'); // Set error message on catch
=======
            console.log('Registration successful', formData);
            //navigate('/', { state: { message: 'Registered' } }); TODO NAVIGATE
            try {
                const response = await axios.post('http://localhost:5000/auth/register', formData);
                console.log(response.data);  // Handle the response from backend flask (harrison).
                if (response.status = 200) { 
                    window.location.href = '/login';
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
>>>>>>> origin/main
        }
    };

    return (
<<<<<<< HEAD
        <form className='register' onSubmit={handleSubmit}>
            <h1><strong>Easy Resi</strong></h1>
            <p>The easy way to find your best pathway to permanent residency in Australia.</p>
            <h2>Register</h2>
            
            <label className='fname'>
                First Name:
                <input
                    className='input'
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='lname'>
                Last Name:
                <input
                    className='input'
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='email'>
                Email:
                <input
                    className='input'
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='password'>
                Password:
                <input
                    className='input'
                    type="password"
                    name="pass"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='re-password'>
                Re-Enter Password:
                <input
                    className='input'
                    type="password"
                    name="repass"
                    value={formData.repass}
                    onChange={handleChange}
                    required
                />
            </label>

            {error && <p className="error-message">{error}</p>}

            <button className='register-button' type="submit">Submit</button>
            <button className='login-button' type="button" onClick={() => navigate('/login')}>Login</button>
        </form>
=======
        <div className='register'>
            <h1>Register</h1>
            <Box maxW="800px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
                <form onSubmit={handleSubmit}>
                    <div className='firstname-container'>
                        <label className='fname'>
                            First Name:
                        </label>
                        <input className='input'
                            type="text"
                            name="fname"
                            value={formData.fname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <br />
                    <label className='lname'>
                        Last Name:
                        <input className='input'
                            type="text"
                            name="lname"
                            value={formData.lname}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label className='email'>
                        Email:
                        <input className='input'
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label className='password'>
                        Password:
                        <input className='input'
                            type="text"
                            name="pass"
                            value={formData.pass}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label className='re-password'>
                        Re-Enter Password:
                        <input className='input'
                            type="text"
                            name="repass"
                            value={formData.repass}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {error && <p className="error-message">{error}</p>}
                    <button className='register-button' type="submit">Submit</button>
                </form>
            </Box>
        </div>
>>>>>>> origin/main
    );
};

export default FormComponent;
