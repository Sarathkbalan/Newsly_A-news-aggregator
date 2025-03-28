import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import Logo from "../assets/images/logo.png";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // New state for success toggle
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
       
        try {
            const response = await axios.post('/api/login', { 
                username, 
                password 
            }, { withCredentials: true });

            if (response.status === 200) {
                setIsSuccess(true); // Set success state to true
                setError(""); // Clear any previous errors
               
                // Redirect to homepage after 2 seconds
                setTimeout(() => {
                    navigate('/homepage');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again!");
            setIsSuccess(false); // Ensure success state is false on error
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gray-100 w-full px-4 md:px-10">
           
            <div className="hidden md:flex md:w-1/2 h-[500px] lg:h-[700px] bg-green-800 rounded-tr-[250px] rounded-bl-[200px] shadow-xl shadow-green-900 flex-col items-center justify-center text-white p-6 lg:p-10">
                <p className="text-4xl lg:text-5xl font-bold text-center">Welcome Back</p>
                <p className="text-lg lg:text-2xl text-center mt-4">To Stay Connected With Us, Please Sign Up</p>
                <img className="mt-10 w-24 lg:w-32" src={Logo} alt="Logo" />
            </div>

            <div className="w-full md:w-1/2 bg-white p-6 lg:p-12 rounded-lg shadow-lg mt-6 md:mt-0">
                <h2 className="text-2xl lg:text-3xl font-bold text-center">Login</h2>

               
                {isSuccess && (
                    <div className="w-full p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center mt-4">
                        Login successful! Redirecting...
                    </div>
                )}

                
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                
                <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6">
                    <input type="text" placeholder="Username" className="w-full p-3 lg:p-4 rounded-lg bg-green-300 placeholder-gray-700 shadow-md text-base lg:text-lg" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full p-3 lg:p-4 rounded-lg bg-green-300 placeholder-gray-700 shadow-md text-base lg:text-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                    <button type="submit" className="w-full bg-green-500 text-white p-3 lg:p-4 rounded-lg hover:bg-green-600 transition text-lg lg:text-xl font-semibold">Login</button>
                </form>

                <p className="mt-4 lg:mt-6 text-center text-base lg:text-lg">
                    Don't have an account? <Link to="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

