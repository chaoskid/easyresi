import React from "react";
import "../index.css";
import Navbar from '../components/Navbar';
import axios from '../axiosConfig';

const About = () => {
    return (
        <>
            <div className="about">
                <h1>About</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium ex voluptate non veniam recusandae ad illum, ducimus, aut amet repellendus blanditiis maiores! Quo consectetur voluptatem veritatis? Obcaecati magni molestias necessitatibus.</p>
            </div>
        </>
    );
};

export default About;