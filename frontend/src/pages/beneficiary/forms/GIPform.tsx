import React, { useState } from 'react';
import Form from '../../../components/form';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const JUBAN_BARANGAYS = [
    "Anog", "Aroroy", "Bacolod", "Buraburan", "Calateo", "Calmayon", 
    "Carriedo", "Casay", "Cuta", "Jagusara", "Lajong", "Maalo", 
    "North Poblacion", "South Poblacion", "Puting Sapa", "Saban", 
    "Sipaya", "Tabon", "Timbayog", "Tughan"
];

export default function GIPRegistration() {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', middleName: '',
        birthDate: '', email: '', contactNo: '',
        barangay: '', street: '',
        school: '', course: '', yearGraduated: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/gip/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) alert("Application sent to LGU Juban!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-100 mt-10">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-blue-900">GIP REGISTRATION</h1>
                <p className="text-gray-500">Municipality of Juban - Pangkabuhayan System</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section: Identity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                    <Form name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                    <Form name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                </div>

                {/* Section: Contact & Birth */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form name="birthDate" type="date" placeholder="Birthdate" value={formData.birthDate} onChange={handleChange} />
                    <Form name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                    <Form name="contactNo" placeholder="Contact Number (09...)" value={formData.contactNo} onChange={handleChange} />
                </div>

                {/* Section: Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form name="street" placeholder="Street / House No." value={formData.street} onChange={handleChange} />
                    <select 
                        name="barangay" 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                    >
                        <option value="">Select Barangay</option>
                        {JUBAN_BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>

                {/* Section: Education */}
                <div className="p-4 bg-gray-50 rounded-md space-y-4">
                    <h3 className="text-sm font-bold text-gray-600 uppercase">Educational Attainment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form name="school" placeholder="School Last Attended" value={formData.school} onChange={handleChange} />
                        <Form name="course" placeholder="Course / Degree" value={formData.course} onChange={handleChange} />
                        <Form name="yearGraduated" placeholder="Year Graduated" value={formData.yearGraduated} onChange={handleChange} />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors shadow-lg">
                    Submit GIP Application
                </button>
            </form>
        </div>
    );
}