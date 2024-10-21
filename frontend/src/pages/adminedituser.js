import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import AdminNavbar  from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import { Button } from '@chakra-ui/react';

const AdminEditUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const editUserId = sessionStorage.getItem('edit_user_id');
    const [userType, setUserType] = useState('');

    const renderNavbar = () => {
        switch (userType) {
            case 'admin':
                return <AdminNavbar />;
            case 'agent':
                return <AgentNavbar />;
            case 'applicant':
                return <Navbar />;
            default:
                return <NothingNavbar />; // Render a default or blank navbar if no user_type
        }
    };

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

    // Admin fetchlogin (apply to all admin pages)
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type !== "admin") {
                    navigate('/login', { state: { message: "User was not logged in as admin, redirecting to login..." } });
                }
            }
        } catch (err) { }
    };

    const fetchUserData = async () => {
        if (editUserId) {
            try {
                const response = await axios.get(`/api/get_user/${editUserId}`);
                setUserData(response.data);
            } catch (err) {
                setError('Failed to load user data. Please contact administrator.');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`/api/update_user/${editUserId}`, userData);
            console.log(response.data.message);
            navigate('/admindashboard'); // Redirect after successful update
        } catch (err) {
            setError('Failed to update user data. Please contact administrator.');
        }
    };

    useEffect(() => {
        fetchLogin();
        fetchUserData();
    }, []);

    return (
        <>
            {renderNavbar()}
            <div className="dashboard">
                    <div>
                        <h1>Edit User Information</h1>

                        <h2>User Information</h2>
                        {userData ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>First Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Last Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Email</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>User Type</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key={userData.user_id}>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder={userData.first_name}
                                                value={userData.first_name}
                                                onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                                            />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder={userData.last_name}
                                                value={userData.last_name}
                                                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                                            />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input
                                                type="email"
                                                placeholder={userData.email}
                                                value={userData.email}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                                    {userData.user_type === 'admin' || userData.user_type === 'Admin' ? (
                                                <input
                                                    type="text"
                                                    value={userData.user_type}
                                                    readOnly
                                                    style={{ border: 'none', backgroundColor: 'transparent' }}
                                                />
                                            ) : (
                                                <select
                                                    value={userData.user_type}
                                                    onChange={(e) => setUserData({ ...userData, user_type: e.target.value })}
                                                >
                                                    <option value="Applicant">Applicant</option>
                                                    <option value="Agent">Agent</option>
                                                </select>
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <Button colorScheme="blue" margin="3px" onClick={handleSubmit}>Submit</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p>No user data available.</p>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button colorScheme="blue" onClick={() => navigate('/admindashboard')}>Go Back</Button>
                        </div>
                    </div>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default AdminEditUser;
