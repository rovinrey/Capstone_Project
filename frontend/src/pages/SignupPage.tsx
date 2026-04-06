import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NAME_REGEX = /^[a-zA-Z\s.\-']+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function SignupPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_name: "",
        identifier: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = (): string | null => {
        const trimmedName = formData.user_name.trim();
        const trimmedIdentifier = formData.identifier.trim();

        if (!trimmedName || !trimmedIdentifier || !formData.password || !formData.confirmPassword) {
            return "Please fill in all fields.";
        }

        if (trimmedName.length < 2 || trimmedName.length > 100) {
            return "Full name must be between 2 and 100 characters.";
        }

        if (!NAME_REGEX.test(trimmedName)) {
            return "Full name contains invalid characters.";
        }

        if (!PASSWORD_REGEX.test(formData.password)) {
            return "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
        }

        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match.";
        }

        return null;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/auth/signup`, {
                user_name: formData.user_name.trim(),
                identifier: formData.identifier.trim(),
                password: formData.password,
                role: "beneficiary",
            });

            setSuccess("Account created successfully! Redirecting to login…");
            setFormData({ user_name: "", identifier: "", password: "", confirmPassword: "" });

            setTimeout(() => navigate("/login", { replace: true }), 1500);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Unable to connect. Please try again.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass =
        "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-blue-600 mt-6">
                <h3 className="text-3xl font-black text-center mb-8 uppercase tracking-tight text-gray-800">
                    Create Account
                </h3>

                {error && (
                    <div role="alert" className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
                        {error}
                    </div>
                )}

                {success && (
                    <div role="status" className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-medium">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5" noValidate>
                    <div>
                        <label htmlFor="user_name" className="sr-only">Full Name</label>
                        <input
                            id="user_name"
                            type="text"
                            name="user_name"
                            placeholder="Full Name"
                            value={formData.user_name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            maxLength={100}
                            disabled={isLoading}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="identifier" className="sr-only">Email or Phone Number</label>
                        <input
                            id="identifier"
                            type="text"
                            name="identifier"
                            placeholder="Email or Phone Number"
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            maxLength={254}
                            disabled={isLoading}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password (min. 8 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            maxLength={128}
                            disabled={isLoading}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            maxLength={128}
                            disabled={isLoading}
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "REGISTERING…" : "REGISTER NOW"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;