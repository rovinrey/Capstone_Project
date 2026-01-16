import { useState } from "react";
import Form from "../components/form";
import { Link, useNavigate } from "react-router-dom";
import WelcomeBanner from '../components/Welcomebanner';

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
/*
    const mockAccounts = [
        {
            // admin account
            username: 'admin',
            password: 'admin123',
        }
            // beneficiary account
    ]
            */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Attempting login with:', credentials);


        
        // Add your Django Auth logic here later
        alert("Login Successful! Redirecting to Dashboard...");
        navigate('/dashboard'); // Example redirect
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            {/* Logo or Header Section */}
            <div className="mb-8 text-center">
                <WelcomeBanner text={"TUPAD and Pangkabuhayan Management System"} />
            </div>

            {/* Login Card */}
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-b-8 border-blue-700">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center underline decoration-blue-500">
                    Sign In to Portal
                </h3>

                <form onSubmit={handleLogin} className="space-y-4">
                    <Form
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                    
                    <Form
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />

                    <button 
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-md mt-4"
                    >
                        LOGIN
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Don't have an account? {" "}
                        <Link to={'/signup'} className="text-blue-700 font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer Note */}
            <p className="mt-8 text-gray-400 text-xs text-center">
                Official Management System &copy; 2026 
                <br /> Department of Labor and Employment
            </p>
        </div>
    );
}

export default Login;