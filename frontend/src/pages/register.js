import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const FormComponent = () => {
    // I suspect errors will come from not having all inputs declared here and then placed in handlechange setformdata - Alex

    // User and pass details for error checking
    const [formData, setFormData] = useState({
        username: '',
        pass: '',
        confirmPassword: '',
        name: '',
        email: ''
    });

    const [error, setError] = useState('');
    const submitbutton = document.getElementById('submit');

    // Handle form input changes
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
            if (value == '') {
                setError('password cannot be empty')
            }
        }
        if ((formData.repass !== formData.pass) || (formData.pass !== formData.repass)) {
            setError('Passwords do not match');
        } else {
            setError('');
            console.log('Registration successful', formData);

            try {
                const response = await axios.post('http://127.0.0.1:5000/api/register', formData);
                console.log(response.data);  // Handle the response from backend flask (harrison)
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Last Name:
                <input
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type="text"
                    name="pass"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Re-enter Password:
                <input
                    type="text"
                    name="repass"
                    value={formData.repass}
                    onChange={handleChange}
                    required
                />
            </label>
            {error && <p className="error-message">{error}</p>}

            < br />
            < br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default FormComponent;