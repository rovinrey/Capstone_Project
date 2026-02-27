import React, { useState } from "react";
import axios from "axios";
import Form from "../../../components/form";

interface FormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    birthday: string;
    age: string;
    gender: string;
    civil_status: string;
    contact_number: string;
    school_name: string;
    course_year: string;
    gwa: string;
    is_indigent: boolean;
}

const initialState: FormData = {
    first_name: "",
    middle_name: "",
    last_name: "",
    birthday: "",
    age: "",
    gender: "",
    civil_status: "",
    contact_number: "",
    school_name: "",
    course_year: "",
    gwa: "",
    is_indigent: false,
};

const SPESApplication: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialState);

    // ✅ Auto calculate age
    const calculateAge = (birthday: string) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age.toString();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        const finalValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;

        if (name === "birthday") {
            setFormData((prev) => ({
                ...prev,
                birthday: value,
                age: calculateAge(value),
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    // ✅ Basic validation
    const validateForm = () => {
        if (!formData.first_name || !formData.last_name)
            return "Full name is required.";

        if (!formData.school_name)
            return "School name is required.";

        if (!formData.gender)
            return "Gender is required.";

        if (parseFloat(formData.gwa) < 1 || parseFloat(formData.gwa) > 5)
            return "GWA must be between 1.00 and 5.00.";

        if (parseInt(formData.age) < 15)
            return "Applicant must be at least 15 years old.";

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE}/forms/apply/spes`,
                formData
            );

            console.log(response.data);
            setSuccess(true);
            setFormData(initialState);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Failed to send application."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-10">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        SPES Application Form
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Please provide accurate information for evaluation.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
                        Application sent successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
                        <Form name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
                        <Form name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />

                        <Form name="age" placeholder="Age (Auto-calculated)" value={formData.age} onChange={handleChange} disabled />

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500 ml-1">
                                Birthday
                            </label>
                            <Form name="birthday" type="date" value={formData.birthday} onChange={handleChange} required />
                        </div>

                        <Form name="contact_number" placeholder="Contact Number (09...)" value={formData.contact_number} onChange={handleChange} required />
                    </div>

                    {/* Academic Info */}
                    <div className="border-t pt-4 mt-4">
                        <h2 className="text-sm font-bold text-blue-600 mb-3 uppercase">
                            Academic Information
                        </h2>

                        <Form name="school_name" placeholder="Full School Name" value={formData.school_name} onChange={handleChange} required />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Form name="course_year" placeholder="Course & Year (e.g. BSIT 3)" value={formData.course_year} onChange={handleChange} required />
                            <Form name="gwa" type="number" step="0.01" placeholder="Current GWA" value={formData.gwa} onChange={handleChange} required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all shadow-md active:scale-95 disabled:bg-blue-300"
                    >
                        {loading ? "Submitting..." : "Submit SPES Application"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SPESApplication;