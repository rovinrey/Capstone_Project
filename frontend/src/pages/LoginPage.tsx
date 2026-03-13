import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        role: "beneficiary"
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    identifier: credentials.username,
                    password: credentials.password
                }
            );

            const role = response.data.role.toLowerCase();
            localStorage.setItem("role", role);
            localStorage.setItem("token", response.data.token); // Store JWT token
            localStorage.setItem("user_name", response.data.user.user_name); // Store user_name for profile

            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/beneficiary");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Connection error"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-b-8 border-blue-700">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Sign In
                </h3>

                {error && (
                    <div className="text-red-500 text-center text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Email or Phone */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Email or Phone"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg mt-4 transition active:scale-95"
                    >
                        LOGIN
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-700 font-bold hover:underline"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;