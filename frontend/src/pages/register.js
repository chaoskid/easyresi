import React, { useState } from 'react';
import '../App.js';
import axios from '../axiosConfig';
import {
    Box, FormControl, FormLabel, Select, RadioGroup, Radio, Checkbox,
    Button, Stack, CheckboxGroup, Text, Input
} from '@chakra-ui/react';
//import { useNavigate } from 'react-router-dom'; // TODO NAVIGATE

const FormComponent = () => {
    // I suspect errors will come from not having all inputs declared here and then placed in handlechange setformdata - Alex

    // User and pass details for error checking
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        pass: '',
        confirmPassword: '',
        email: ''
    });

    const [error, setError] = useState('');
    //const submitbutton = document.getElementById('submit');

    // Handle form input className='input' changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation
        if (name === 'repass') {
            if (value !== formData.pass) {
                setError('Passwords do not match');
            } else {
                setError('');
            }
        }
        if (name === 'pass') {
            if (value !== formData.repass) {
                setError('Passwords do not match');
            } else {
                setError('');
            }
        }

    };

    // Handle form submission
    const handleSubmit = async (e) => {

        e.preventDefault();
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });



        // Real-time validation
        if (name === 'repass' || name === 'pass') {
            if (value === '') {
                setError('password cannot be empty')
            }
        }
        if ((formData.repass !== formData.pass) || (formData.pass !== formData.repass)) {
            setError('Passwords do not match');
        } else {
            setError('');
            console.log('Registration successful', formData);
            //navigate('/', { state: { message: 'Registered' } }); TODO NAVIGATE
            try {
                const response = await axios.post('http://127.0.0.1:5000/auth/register', formData);
                console.log(response.data);  // Handle the response from backend flask (harrison).
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
        }
    };

    return (
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
    );
};

export default FormComponent;