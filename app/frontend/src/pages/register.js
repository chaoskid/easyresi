import React from "react";
import Navbar from '../components/Navbar';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';



const Register = () => {


    return (
        <>
            <h1> Register </h1>
            <br /><br />
            <div className="login">
                <form>
                    <p>
                        <label>Enter your email: &emsp;
                            <input
                                type="text"/>
                        </label>
                    </p>
                    <br />
                    <p>
                        <label>Enter your password: &emsp;
                            <input type="text" />
                        </label>
                    </p>
                    <br />
                    <p>
                        <label>Re-Enter your password: &emsp;
                            <input type="text" />
                        </label>
                    </p>
                    <br />
                    <p>
                        <button type="submit">Submit</button>
                    </p>
                </form>

            </div>
        </>
    );
}

// TODO: Form input submission check info w/ database allow user to login or prompt incorrect pass.
// Submission via $POST 
// Questionairre and login details to be done. 
// UI

export default Register;