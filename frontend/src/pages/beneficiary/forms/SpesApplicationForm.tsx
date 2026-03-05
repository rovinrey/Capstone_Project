import React, { useState } from "react";

interface SPESFormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    age: number | string;
    gender: string;
    civil_status: string;
    address: string;
    contact_number: string;
    email: string;
    school: string;
    course: string;
    year_level: string;
    gwa: number | string;
    parent_name: string;
    parent_occupation: string;
    family_income: number | string;

}

const SPESApplication: React.FC = () => {
    const [formData, setFormData] = useState<SPESFormData>({
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth:"",
        age: "",
        gender: "",
        civil_status: "",
        address: "",
        contact_number: "",
        email: "",
        school: "",
        course: "",
        year_level: "",
        gwa: "",
        parent_name: "",
        parent_occupation: "",
        family_income: "",
        
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const resetForm = () => {
        setFormData({
            first_name: "",
            middle_name: "",
            last_name: "",
            date_of_birth: "",
            age: "",
            gender: "",
            civil_status: "",
            address: "",
            contact_number: "",
            email: "",
            school: "",
            course: "",
            year_level: "",
            gwa: "",
            parent_name: "",
            parent_occupation: "",
            family_income: "",
          
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/forms/apply/spes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error("Failed to submit application");
            }

            alert("Application Submitted Successfully!");
            resetForm();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error submitting application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle =
        "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        SPES Application Form
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Fill out all required details carefully.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    {/* Personal Info */}
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name *"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                     <input
                        type="text"
                        name="middle_name"
                        placeholder="Middle Name *"
                        value={formData.middle_name}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                     <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name *"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={inputStyle}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <select
                            name="civil_status"
                            value={formData.civil_status}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            <option value="">Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        name="address"
                        placeholder="Complete Address"
                        value={formData.address}
                        onChange={handleChange}
                        className={inputStyle}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="contact_number"
                            placeholder="Contact Number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>

                    {/* Education */}
                    <input
                        type="text"
                        name="school"
                        placeholder="School/University *"
                        value={formData.school}
                        onChange={handleChange}
                        className={inputStyle}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="course"
                            placeholder="Course/Program"
                            value={formData.course}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <input
                            type="text"
                            name="year_level"
                            placeholder="Year Level"
                            value={formData.year_level}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>

                    <input
                        type="number"
                        name="gwa"
                        placeholder="Current GWA"
                        value={formData.gwa}
                        onChange={handleChange}
                        className={inputStyle}
                    />

                    {/* Family Info */}
                    <input
                        type="text"
                        name="parent_name"
                        placeholder="Parent/Guardian Name"
                        value={formData.parent_name}
                        onChange={handleChange}
                        className={inputStyle}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="parent_occupation"
                            placeholder="Parent Occupation"
                            value={formData.parent_occupation}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <input
                            type="number"
                            name="family_income"
                            placeholder="Family Monthly Income"
                            value={formData.family_income}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>

                    {/* Status Category 
                    <select
                        name="status_category"
                        value={formData.status_category}
                        onChange={handleChange}
                        className={inputStyle}
                    >
                        <option value="">Select Status Category *</option>
                        <option value="Indigent">Indigent</option>
                        <option value="Child of OFW">Child of OFW</option>
                        <option value="Displaced Worker">Child of Displaced Worker</option>
                        <option value="Solo Parent">Child of Solo Parent</option>
                    </select>
                    */}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 w-full font-semibold py-3 rounded-md shadow-md text-white transition active:scale-95 ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "SUBMITTING..." : "Submit Application"}
                    </button>
                </form>

                <footer className="mt-6 text-center text-xs text-gray-400 italic">
                    "Acceptance depends on qualification and available slots."
                </footer>
            </div>
        </div>
    );
};

export default SPESApplication;
