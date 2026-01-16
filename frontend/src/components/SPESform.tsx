import { useState } from "react";

function SpesForm() {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        gender: '',
        civil_status: 'Single',
        contact_number: '',
        email: '',
        address: '',
        school_name: '',
        course_degree: '',
        is_indigent: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-blue-800">SPES Application Form</h2>
                    <p className="text-gray-600">Special Program for Employment of Students</p>
                </div>

                <form className="space-y-6">
                    {/* Section: Personal Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input type="text" name="middle_name" placeholder="Middle Name" onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                    </div>

                    {/* Section: Contact & Bio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Birthday</label>
                            <input type="date" name="birthday" onChange={handleChange} 
                                className="w-full p-2 border border-gray-300 rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Gender</label>
                            <select name="gender" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Section: Education */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-2">Education</h3>
                        <div className="space-y-4">
                            <input type="text" name="school_name" placeholder="Name of School" onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded" />
                            <input type="text" name="course_degree" placeholder="Course / Year Level" onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded">
                        <input type="checkbox" name="is_indigent" id="indigent" onChange={handleChange} 
                            className="h-5 w-5 text-blue-600" />
                        <label htmlFor="indigent" className="text-sm text-blue-800 font-medium">
                            The applicant belongs to an indigent family (No Income)
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg">
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SpesForm;