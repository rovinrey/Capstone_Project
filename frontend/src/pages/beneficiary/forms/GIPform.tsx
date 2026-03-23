import React, { useState } from "react";

const JUBAN_BARANGAYS = [
    "Anog", "Aroroy", "Bacolod", "Buraburan", "Calateo", "Calmayon",
    "Carriedo", "Casay", "Cuta", "Jagusara", "Lajong", "Maalo",
    "North Poblacion", "South Poblacion", "Puting Sapa", "Saban",
    "Sipaya", "Tabon", "Timbayog", "Tughan"
];

export default function GIPRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        birthDate: "",
        age: "",
        gender: "",
        civilStatus: "",
        email: "",
        contactNo: "",
        street: "",
        barangay: "",
        school: "",
        course: "",
        yearGraduated: "",
        educationLevel: "",
        employmentStatus: "",
        skills: "",
        governmentId: "",
        emergencyName: "",
        emergencyContact: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.barangay) {
            alert("Please fill all required fields.");
            return;
        }

        setLoading(true);

        console.log("GIP Application Data:", formData);

        setTimeout(() => {
            alert("GIP Application Submitted Successfully!");
            setLoading(false);
        }, 1000);
    };

    const inputStyle =
        "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl border border-gray-100 mt-4 sm:mt-6 md:mt-8">
            <header className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900">
                    GIP REGISTRATION FORM
                </h1>
                <p className="text-gray-500">
                    Municipality of Juban - Government Internship Program
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} className={inputStyle} />
                    <input name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} className={inputStyle} />
                    <input name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={inputStyle} />
                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className={inputStyle} />
                    
                    <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} className={inputStyle}>
                    <option value="">Civil Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                </select>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={inputStyle} />
                    <input name="contactNo" placeholder="Contact Number (09...)" value={formData.contactNo} onChange={handleChange} className={inputStyle} />
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="street" placeholder="Street / House No." value={formData.street} onChange={handleChange} className={inputStyle} />
                    <select name="barangay" value={formData.barangay} onChange={handleChange} className={inputStyle}>
                        <option value="">Select Barangay *</option>
                        {JUBAN_BARANGAYS.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                {/* Education */}
                <div className="p-4 bg-gray-50 rounded-md space-y-4">
                    <h3 className="text-sm font-bold text-gray-600 uppercase">
                        Educational Background
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="school" placeholder="School Last Attended" value={formData.school} onChange={handleChange} className={inputStyle} />
                        <input name="course" placeholder="Course / Degree" value={formData.course} onChange={handleChange} className={inputStyle} />
                        <input name="yearGraduated" placeholder="Year Graduated" value={formData.yearGraduated} onChange={handleChange} className={inputStyle} />
                    </div>

                    <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className={inputStyle}>
                        <option value="">Highest Educational Attainment</option>
                        <option value="High School">High School</option>
                        <option value="Senior High">Senior High</option>
                        <option value="College Graduate">College Graduate</option>
                        <option value="Undergraduate">College Undergraduate</option>
                    </select>
                </div>

                {/* Additional Info */}
                <input name="employmentStatus" placeholder="Current Employment Status" value={formData.employmentStatus} onChange={handleChange} className={inputStyle} />

                <textarea
                    name="skills"
                    placeholder="Relevant Skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className={`${inputStyle} resize-none`}
                    rows={3}
                />

                <input name="governmentId" placeholder="Government ID Number" value={formData.governmentId} onChange={handleChange} className={inputStyle} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="emergencyName" placeholder="Emergency Contact Name" value={formData.emergencyName} onChange={handleChange} className={inputStyle} />
                    <input name="emergencyContact" placeholder="Emergency Contact Number" value={formData.emergencyContact} onChange={handleChange} className={inputStyle} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full font-bold py-3 rounded-md shadow-lg text-white transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "SUBMITTING..." : "Submit GIP Application"}
                </button>
            </form>
        </div>
    );
}