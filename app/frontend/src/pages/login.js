import React from "react";
import Navbar from '../components/Navbar';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';



const Login = () => {

    const [name, setName] = useState("");
    const handleClick = (e) => {
        console.log('hello ninjas', e);
    }

    const handleClickAlex = (name, e) => {
        console.log('hello ' + name, e.target);
    }


    return (
        <>
            <h1> Log In </h1>
            <br /><br />
            <div className="login">
                <form>
                    <p>
                        <label>Enter your email: &emsp;
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
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
                        <button onClick={(e) => handleClickAlex(name, e)}>Submit</button>
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

export default Login;