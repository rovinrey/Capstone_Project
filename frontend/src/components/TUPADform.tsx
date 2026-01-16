import { useState } from "react";
import Form from "./form";

function TupadForm() {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        valid_id: '',   
        id_number: '',       
        contact_number: '',   
        occupation: '',   
        monthly_income: '',   
        gender: '',  
        civil_status: '',   
        age: '',    
        name_of_beneficiary: '',   
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const API_URL = "http://127.0.0.1:8000/api/register/"; 
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) alert("Data Sent Successfully!");
            else alert("Failed to send data.");
        } catch (error) {
            alert("Error connecting to Backend!");
        }
    };

    return (
        /* Tailwind: Gray background, centered card, shadow effect */
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">TUPAD Profiling</h2>
                <p className="text-sm text-gray-500 mb-6">Please fill out the form accurately for the Pangkabuhayan program.</p>
                
                <div className="grid grid-cols-1 gap-4">
                    {/* Input Groups */}
                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                        <Form placeholder="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                    </div>

                    <Form placeholder="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="Birthday" name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
                        <Form placeholder="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                    </div>

                    <Form placeholder="Contact Number" name="contact_number" value={formData.contact_number} onChange={handleChange} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                        <Form placeholder="Monthly Income" name="monthly_income" type="number" value={formData.monthly_income} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form placeholder="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                        <Form placeholder="Civil Status" name="civil_status" value={formData.civil_status} onChange={handleChange} />
                    </div>

                    <Form placeholder="Full Name of Beneficiary" name="name_of_beneficiary" value={formData.name_of_beneficiary} onChange={handleChange} />

                    {/* Submit Button */}
                    <button 
                        onClick={handleSubmit} 
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-md transition-all active:scale-95"
                    >
                        SUBMIT REGISTRATION
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TupadForm;