import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function Login() {
    // Constants
    const navigate = useNavigate();

    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [userType, setUserType] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password });
            console.log(response); // Successful response
            console.log(response.data.data.user_type);
            setUserType(response.data.data.user_type);
            console.log(userType);
            
            // Check if the response status is 200
            if (response.status === 200) {
                sessionStorage.setItem('user_id', response.data.data.user_id);
                console.log(sessionStorage.getItem('user_id'));


                console.log("AHAHHAAHHA");
                console.log(userType);

                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: 'Logged in' } });
                }
                else if (response.data.data.user_type === "applicant") {
                    navigate('/dashboard', { state: { message: 'Logged in' } });
                }
            } else {
                setError(response.data.message); // show this on a popup - bottom right
            }
        } catch (error) {
            setError('Incorrect password');
            alert('Incorrect password');
        }
    };

    return (
        <div className='login'>
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
                    {error && <div className="login_error" >{error}</div>}
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
        </div>
    );
}

export default Login;

