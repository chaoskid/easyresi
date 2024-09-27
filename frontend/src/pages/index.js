import React from "react";
import '../index.css';
import Navbar from '../components/Navbar';
import axios from '../axiosConfig';
import { useNavigate } from "react-router-dom"
import {
    Box, FormControl, FormLabel, Select, RadioGroup, Radio, Checkbox,
    Button, Stack, CheckboxGroup, Text
} from '@chakra-ui/react';



const Home = () => {

    // Navigation from buttons using functions
    let navigate = useNavigate();
    const loginRoute = () => {
        
        let path = `./login`;
        navigate(path);
    }
    const registerRoute = () => {

        let path = `./register`;
        navigate(path);
    }

    return (
        <>
            <div className="home">
                <h1><strong>Welcome to Easy Resi</strong></h1>
                <p>Residency Probability and Information Made Easy!</p>
            </div>
            <div className="index-buttons-container">
                <div className="index-login-button">
                    <h2>Already have an account?</h2>
                    <Button className='login-button' mt={6} colorScheme="teal"
                        onClick={loginRoute}
                        loadingText>Login</Button>
                </div>
                <div className="index-register-button">
                    <h2>Otherwise register an account:</h2>
                    <Button
                        className='login-button' mt={6} colorScheme="teal"
                        onClick={registerRoute}
                        loadingText>Register</Button>
                </div>

            </div>
        </>
    );
}

export default Home;