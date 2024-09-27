import React from "react";
import '../index.css';
import Navbar from '../components/Navbar';
<<<<<<< HEAD

// // Import axios if you plan to use it in the future
// import axios from '../axiosConfig';

// Home component - currently serves as a placeholder - don't think we actually need it
=======
import axios from '../axiosConfig';
import { useNavigate } from "react-router-dom"
import {
    Box, FormControl, FormLabel, Select, RadioGroup, Radio, Checkbox,
    Button, Stack, CheckboxGroup, Text
} from '@chakra-ui/react';



>>>>>>> origin/main
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
            <Navbar />
            <div className="home">
<<<<<<< HEAD
                <h1>Welcome to Easy Resi</h1>
=======
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

>>>>>>> origin/main
            </div>
        </>
    );
}

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> origin/main
