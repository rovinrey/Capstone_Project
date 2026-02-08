import React, { useState } from "react";
import Form from "./form"; // Ensure this component correctly forwards 'name', 'value', and 'onChange'
import axios from 'axios';

function TupadForm() {
    // 1. Form state initialized to match your MySQL column names
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        valid_id_type: '',
        id_number: '',
        contact_number: '',
        occupation: '',
        monthly_income: '',
        gender: '',
        civil_status: '',
        age: '',
        name_of_beneficiary: '',
        program_type: 'TUPAD',
    });

    const [loading, setLoading] = useState(false);

    // 2. Handle input changes (converts numbers for MySQL decimal/int types)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'number' ? (value === "" ? "" : Number(value)) : value 
        });
    };

    // 3. Form submission 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation: Ensure "Null: NO" fields are present
        if (!formData.first_name || !formData.last_name || !formData.birthday) {
            alert("Please fill in all required fields (Name and Birthday).");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/forms/apply/tupad', formData);
            console.log('Response from backend:', response.data);
            alert('Form submitted successfully!');
            
            // Optional: Reset form after success
            setFormData({
                first_name: '', middle_name: '', last_name: '', birthday: '',
                valid_id_type: '', id_number: '', contact_number: '',
                occupation: '', monthly_income: '', gender: '',
                civil_status: '', age: '', name_of_beneficiary: '',
                program_type: 'TUPAD'
            });
        } catch (err: any) {
            // Improved error logging to catch MySQL messages
            console.error('Submission error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || "Internal Server Error";
            alert(`Submission failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-10 px-4 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">TUPAD Profiling</h2>
                <p className="text-sm text-gray-500 mb-6">Please fill out the form accurately for the Pangkabuhayan program.</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    {/* Name Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="First Name *" name="first_name" value={formData.first_name} onChange={handleChange} />
                        <Form placeholder="Last Name *" name="last_name" value={formData.last_name} onChange={handleChange} />
                    </div>

                    <Form placeholder="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} />

                    {/* Personal Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="Birthday *" name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
                        <Form placeholder="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                    </div>

                    <Form placeholder="Contact Number" name="contact_number" value={formData.contact_number} onChange={handleChange} />

                    {/* Employment/Income */}
                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                        <Form placeholder="Monthly Income" name="monthly_income" type="number" value={formData.monthly_income} onChange={handleChange} />
                    </div>

                    {/* Identity/Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="Gender (Male/Female)" name="gender" value={formData.gender} onChange={handleChange} />
                        <Form placeholder="Civil Status" name="civil_status" value={formData.civil_status} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form 
                            placeholder="Type of ID" 
                            name="valid_id_type" 
                            value={formData.valid_id_type} 
                            onChange={handleChange} 
                        />
                        <Form 
                            placeholder="ID Number" 
                            name="id_number" 
                            value={formData.id_number} 
                            onChange={handleChange} 
                        />
                    </div>

                    <Form placeholder="Full Name of Beneficiary" name="name_of_beneficiary" value={formData.name_of_beneficiary} onChange={handleChange} />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 w-full font-bold py-3 rounded-md shadow-md transition-all active:scale-95 text-white ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'SUBMITTING...' : 'SUBMIT FORM'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TupadForm;