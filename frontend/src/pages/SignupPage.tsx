import { useState } from "react";
import axios from 'axios';
import Form from "../components/forms/form";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({  
        user_name: '',
        identifier: '', // This will hold either email or phone
        password: '',
        confirmPassword: '',
        role: 'beneficiary' // Default role for signup
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }   
        setIsLoading(true);

        try {       
            await axios.post('http://localhost:5000/api/auth/signup', formData);
            navigate('/'); // Redirect to login page after successful signup
        } catch (err: any) {
            setError(err.response?.data?.message || "Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-blue-600 mt-6">
                <h3 className="text-3xl font-black text-center mb-8 uppercase tracking-tight">Create Account</h3>

                <form onSubmit={handleSignup} className="space-y-5">
                    <Form 
                        type="text" placeholder="Full Name" name="user_name" 
                        value={formData.user_name} onChange={handleChange} 
                    />
                    <Form 
                        type="text" placeholder="Email or Phone Number" name="identifier" 
                        value={formData.identifier} onChange={handleChange} 
                    />
                    <Form 
                        type="text" placeholder="Password" name="password" 
                        value={formData.password} onChange={handleChange} 
                    />
                    <Form 
                        type="password" placeholder="Confirm Password" name="confirmPassword" 
                        value={formData.confirmPassword} onChange={handleChange} 
                    />

                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? 'REGISTERING...' : 'REGISTER NOW'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account? <Link to={'/'} className="text-blue-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;