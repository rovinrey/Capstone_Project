import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WelcomeBanner from '../components/Welcomebanner';
import Form from "../components/forms/form";
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        role: 'beneficiary' // Default value
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
        const response = await axios.post('http://localhost:5000/login', {
            // Use 'identifier' to match the backend req.body
            identifier: credentials.username, 
            password: credentials.password
        });

        const role = response.data.role.toLowerCase(); // Ensure it's lowercase
        localStorage.setItem('role', role);

        // MATCH THESE TO YOUR App.tsx PATHS
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/beneficiary');
        }
        
    } catch (err: any) {
        setError(err.response?.data?.message || "Connection error");
    }
};

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-b-8 border-blue-700">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                    

        

                    <Form type="text" placeholder="Email or phone " name="username" value={credentials.username} onChange={handleChange} />
                    <Form type="password" placeholder="Password" name="password" value={credentials.password} onChange={handleChange} />

                    <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg mt-4">
                        LOGIN
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account? <Link to='/signup' className="text-blue-700 font-bold">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
export default Login;