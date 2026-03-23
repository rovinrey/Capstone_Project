import React, { useState } from "react";
import axios from "axios";

// 1. DRY Principle: Extract initial state outside the component so it isn't recreated on every render 
// and doesn't need to be hardcoded twice.
const INITIAL_FORM_STATE = {
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    valid_id_type: "",
    id_number: "",
    contact_number: "",
    occupation: "",
    monthly_income: "",
    gender: "",
    civil_status: "",
    age: "",
    training: "",
    educational_attainment: "",
    job_preference: "",
    name_of_beneficiary: "",
    program_type: "TUPAD",
};

function TupadForm() {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic frontend validation
        if (!formData.first_name || !formData.last_name || !formData.date_of_birth || !formData.valid_id_type || !formData.id_number) {
            alert("Please fill in all required fields!");
            return;
        }

        setLoading(true);

        try {
            // 2. Defensive Programming: Safely retrieve the user ID. 
            // Often, devs store the whole user object as JSON, not just the ID. We check for both.
            let userId = localStorage.getItem('user_id');
            
            if (!userId) {
                // Fallback: Check if they stored a user object instead
                const userObjStr = localStorage.getItem('user');
                if (userObjStr) {
                    try {
                        const parsedUser = JSON.parse(userObjStr);
                        userId = parsedUser?.id || parsedUser?.user_id;
                    } catch (parseError) {
                        console.error("Failed to parse user from local storage");
                    }
                }
            }

            if (!userId) {
                alert('Session expired or User ID not found. Please log in again.');
                // Optional: Redirect to login page here using React Router's useNavigate
                return; 
            }

            const payload = {
                ...formData,
                user_id: Number(userId),
                program_type: 'TUPAD',
                work_category: formData.occupation || null,
            };

            // 3. Environment Variables: Never hardcode localhost in production.
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            const response = await axios.post(`${API_BASE_URL}/api/forms/apply/tupad`, payload);

            console.log("Response:", response.data);
            alert("Form submitted successfully!");

            // Reset form cleanly using our constant
            setFormData(INITIAL_FORM_STATE);
            
        } catch (err: any) {
            console.error("Submission error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Internal Server Error";
            alert(`Submission failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

    return (
        <div className="py-4 sm:py-6 md:py-8 px-0 sm:px-1 md:px-2 flex justify-center items-start">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full max-w-3xl border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    TUPAD Profiling
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Please fill out the form accurately for the Pangkabuhayan program.
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    {/* Name Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" name="first_name" placeholder="First Name *" value={formData.first_name} onChange={handleChange} className={inputStyle} required />
                        <input type="text" name="last_name" placeholder="Last Name *" value={formData.last_name} onChange={handleChange} className={inputStyle} required />
                    </div>

                    <input type="text" name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} className={inputStyle} />

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className={inputStyle} required />
                        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className={inputStyle} />
                    </div>

                    <input type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} className={inputStyle} />

                    {/* Employment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className={inputStyle} />
                        <input type="number" name="monthly_income" placeholder="Monthly Income" value={formData.monthly_income} onChange={handleChange} className={inputStyle} />
                    </div>

                    {/* Identity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select name="gender" value={formData.gender} onChange={handleChange as any} className={inputStyle}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <select name="civil_status" value={formData.civil_status} onChange={handleChange as any} className={inputStyle}>
                            <option value="">Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" name="valid_id_type" placeholder="Type of ID *" value={formData.valid_id_type} onChange={handleChange} className={inputStyle} required />
                        <input type="text" name="id_number" placeholder="ID Number *" value={formData.id_number} onChange={handleChange} className={inputStyle} required />
                    </div>

                    <input type="text" name="name_of_beneficiary" placeholder="Full Name of Beneficiary" value={formData.name_of_beneficiary} onChange={handleChange} className={inputStyle} />
                    <input type="text" name="training" placeholder="Training Attended" value={formData.training} onChange={handleChange} className={inputStyle} />
                    <input type="text" name="educational_attainment" placeholder="Educational Attainment" value={formData.educational_attainment} onChange={handleChange} className={inputStyle} />
                    <input type="text" name="job_preference" placeholder="Job Preference" value={formData.job_preference} onChange={handleChange} className={inputStyle} />
                    <input type="hidden" name="program_type" value={formData.program_type} />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 w-full font-bold py-3 rounded-md shadow-md transition-all active:scale-95 text-white ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "SUBMITTING..." : "SUBMIT FORM"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TupadForm;