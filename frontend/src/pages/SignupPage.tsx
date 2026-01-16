import { useState } from "react";
import Form from "../components/form";
import { Link, useNavigate } from "react-router-dom";
import WelcomeBanner from '../components/Welcomebanner';

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation for your Defense
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Registering user:", formData);
        // This is where you will fetch() your Django signup API
        alert("Account created successfully!");
        navigate('/'); // Send them back to login
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            <div className="mb-6 text-center">
                <WelcomeBanner text={"TUPAD and Pangkabuhayan Management System"} />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-blue-600">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Create Account</h3>
                    <p className="text-gray-500 text-sm mt-2">Join the TUPAD Management Portal</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    <Form
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    
                    <Form
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Form
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
                    >
                        REGISTER NOW
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        Already have an account? {" "}
                        <Link to={'/'} className="text-blue-600 font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;