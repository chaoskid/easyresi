import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

import "../index.css";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const About = () => {
    const navigate = useNavigate();

    // Check to see if logged in
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login'); // Adjust the URL if needed
            console.log(response);
            if (response.data.type == "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
        } catch (err) {
        } finally {
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
    }, []);


    return (
        <>
            <Navbar />
            <div className="about">
                <div className="about-header">
                    <h1>About Easy Resi</h1>
                    <p>
                        Easy Resi is a user-friendly web-based platform designed to assist skilled migrants in navigating 
                        the complex process of obtaining permanent residence (PR) in Australia. By leveraging up-to-date 
                        immigration data and a personalised recommendation algorithm, Easy Resi provides users with 
                        tailored pathways that align with their unique skills, experience, and preferences.
                    </p>
                </div>

                <hr className="orange-hr" />

                <h1>What We Do</h1>
                <p>
                    Our mission is to simplify the journey to permanent residence for skilled migrants by offering a 
                    comprehensive, step-by-step guide based on individual profiles. Easy Resi helps users identify 
                    the most suitable and efficient study-to-PR pathways, reducing the guesswork and uncertainty in 
                    the migration process.
                </p>

                <hr className="orange-hr" />

                <div className="key-features">
                    <h1>Key Features</h1>
                    <p>
                        Easy Resi offers a range of key features to enhance the user experience:
                    </p>
                    <ul>
                        <li>
                            <strong>Personalised Recommendations:</strong><br />
                            Generates customised PR pathway suggestions by analysing user inputs such as skills, work experience, English proficiency, and location preferences.
                        </li>
                        <li>
                            <strong>Comprehensive Questionnaire:</strong><br />
                            Allows users to complete a detailed questionnaire to build their profiles, enabling the system to offer accurate and relevant recommendations.
                        </li>
                        <li>
                            <strong>Current Data Integration:</strong><br />
                            Integrates the latest skilled occupation lists and immigration data, ensuring users receive the most up-to-date information on their PR options.
                        </li>
                        <li>
                            <strong>Probability Calculation:</strong><br />
                            Uses an advanced algorithm to calculate the likelihood of receiving a PR invitation based on the user’s profile, helping them make informed decisions.
                        </li>
                        <li>
                            <strong>Optimised Recommendations:</strong><br />
                            Provides course and location recommendations optimised for the quickest and easiest path to PR, along with detailed cost and duration estimates.
                        </li>
                        <li>
                            <strong>Comparison Tool:</strong><br />
                            Allows users to compare the top recommended pathways, making it easier to choose the best option for their circumstances.
                        </li>
                    </ul>
                </div>

                <div className="serve">
                    <h1>Who We Serve</h1>
                    <p>
                        Easy Resi serves a variety of user groups, including:
                    </p>
                    <ul>
                        <li>
                            <strong>Prospective Skilled Migrants:</strong><br />
                            Create profiles, explore tailored PR pathways, and access comprehensive information on costs and timelines.
                        </li>
                        <li>
                            <strong>Migration Agents:</strong><br />
                            Create accounts to view anonymised statistics and provide feedback on recommendations, enhancing their ability to assist clients.
                        </li>
                        <li>
                            <strong>Education Providers:</strong><br />
                            Submit course details and view anonymised interest statistics, helping align their offerings with the needs of prospective students.
                        </li>
                    </ul>
                    <div className="serve-image">
                        <img src="/images/skilledMigrant.png" alt="Skilled Migrant" className="about-image" />
                    </div>
                </div>

                <div className="commitment">
                    <hr className="orange-hr2" />
                    <h1>Our Commitment</h1>
                    <p>
                        At Easy Resi, we understand that the journey to permanent residence can be overwhelming. We are committed to 
                        providing accurate, accessible, and transparent guidance, though we always advise consulting with professional 
                        migration agents for personalised advice. While we strive to ensure the highest quality and reliability, we 
                        acknowledge that immigration policies are subject to change and recommend users stay informed of the latest updates.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
