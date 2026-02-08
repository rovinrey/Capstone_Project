import { useState } from "react";
import axios from 'axios';
import Form from "../components/forms/form"; 
import { Link, useNavigate } from "react-router-dom";
import WelcomeBanner from '../components/Welcomebanner';

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        identifier: '', // Changed 'email' to 'identifier' to handle both
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!formData.fullName.trim() || !formData.identifier.trim() || 
            !formData.password.trim() || !formData.confirmPassword.trim()) {
            alert('Fields cannot be empty!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // --- LOGIC TO SEPARATE EMAIL AND PHONE ---
        const isEmail = formData.identifier.includes('@');
        const payload = {
            fullName: formData.fullName,
            password: formData.password,
            // If it has an '@', send it as email. If not, send it as phone.
            email: isEmail ? formData.identifier : null,
            phone: !isEmail ? formData.identifier : null
        };

        try {
            const response = await axios.post('http://localhost:5000/signup', payload);

            if (response.status === 201) {
                alert("Account created successfully!");
                navigate('/'); 
            }
        } catch (error: any) {
            console.error("Signup error details:", error.response?.data);
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-blue-600 mt-6">
                <h3 className="text-3xl font-black text-center mb-8 uppercase tracking-tight">Create Account</h3>
                
                <form onSubmit={handleSignup} className="space-y-5">
                    <Form type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                    
                    {/* name="identifier" matches the state key */}
                    <Form type="text" placeholder="Email or Phone Number" name="identifier" value={formData.identifier} onChange={handleChange} />
                    
                    <Form type="text" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                    <Form type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg">
                        REGISTER NOW
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