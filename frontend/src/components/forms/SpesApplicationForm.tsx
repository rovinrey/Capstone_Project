import React, { useState } from 'react';
import Form from './form'; 

const SPESApplication: React.FC = () => {
    // Single state object para malinis (Object-oriented heart)
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        school: '',
        gpa: '',
        status: '' // e.g., Indigent, Displaced Worker
    });

    // Universal Change Handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Data Submitted to System:", formData);
        alert("Application Sent! Sana ma-approve, hindi gaya ng feelings mo.");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">SPES Application Form</h1>
                    <p className="text-gray-500 text-sm">Fill out the details to apply for the program.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Gamit ang custom Form component mo */}
                    <Form 
                        name="fullName"
                        placeholder="Full Name (e.g. Juan Dela Cruz)"
                        value={formData.fullName}
                        onChange={handleChange}
                    />

                    <div className="flex gap-4">
                        <Form 
                            name="age"
                            type="number"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                        <Form 
                            name="gpa"
                            type="number"
                            placeholder="Current GPA"
                            value={formData.gpa}
                            onChange={handleChange}
                        />
                    </div>

                    <Form 
                        name="school"
                        placeholder="School/University"
                        value={formData.school}
                        onChange={handleChange}
                    />

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors shadow-md active:scale-95"
                    >
                        Submit Application
                    </button>
                </form>

                <footer className="mt-6 text-center text-xs text-gray-400 italic">
                    "Application results may vary. Acceptance not guaranteed, just like in love."
                </footer>
            </div>
        </div>
    );
};

export default SPESApplication;