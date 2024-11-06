import React, { useState } from 'react';
import './login.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [userType, setUserType] = useState('student');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if(userType==='admin' && password==='admin'){
            navigate('/admin/departments')
        }
        else{
            try {
                const response = await axios.post('http://localhost:5000/api/login', {
                    userType,
                    userId,
                    password
                });
    
                if (response.data.success) {
                    if (response.data.userType === 'student') {
                        navigate(`/student/dashboard/${response.data.userId}`);
                    } else if (response.data.userType === 'instructor') {
                        navigate(`/instructor/dashboard/${response.data.userId}`);
                    }
                } else {
                    alert('Invalid credentials');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('Server error, please try again later');
            }
        }
    };

    return (
        <div className="login-container">
            <h1 className="heading">Login</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <select
                    className="login-select"
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                </select>

                {userType !== 'admin' && (
                    <>
                        <label className="login-label" htmlFor="userId">User ID:</label>
                        <input
                            className="login-input"
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                    </>
                )}

                <label className="login-label" htmlFor="password">Password:</label>
                <input
                    className="login-input"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="submit-btn" type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;