import { useState } from "react";

function DilpForm() {
    const [formData, setFormData] = useState({
        proponent_name: '', // Name of the Individual or Group
        project_title: '',
        project_type: 'Individual', // Individual or Group
        category: 'Formation', // Formation, Restoration, or Enhancement
        proposed_amount: '',
        location: '',
        contact_person: '',
        mobile_number: '',
        brief_description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting DILP Proposal:", formData);
        // Backend integration logic here
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white border-t-8 border-green-600 shadow-xl rounded-lg p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800">DILP Application Form</h2>
                    <p className="text-green-700 font-medium italic">DOLE Integrated Livelihood Program (Kabuhayan)</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Identification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Project Title</label>
                            <input type="text" name="project_title" placeholder="e.g., Rice Retailing or Sari-Sari Store" onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Proponent Name</label>
                            <input type="text" name="proponent_name" placeholder="Individual Name or Group Name" onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Project Type</label>
                            <select name="project_type" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                <option value="Individual">Individual</option>
                                <option value="Group">Group</option>
                            </select>
                        </div>
                    </div>

                    {/* Financials & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Category</label>
                            <select name="category" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                <option value="Formation">Kabuhayan Formation</option>
                                <option value="Enhancement">Kabuhayan Enhancement</option>
                                <option value="Restoration">Kabuhayan Restoration</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Proposed Grant Amount (₱)</label>
                            <input type="number" name="proposed_amount" placeholder="0.00" onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Project Brief Description</label>
                        <textarea name="brief_description" rows={4} onChange={handleChange} placeholder="Briefly explain how this livelihood project will help you..."
                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-lg transition-all transform hover:scale-[1.01] shadow-lg uppercase">
                        Submit DILP Proposal
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DilpForm;