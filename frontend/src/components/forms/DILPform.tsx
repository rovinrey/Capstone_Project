import { useState } from "react";
import { dilpAPI } from "../../api/dilp.api";

interface FormData {
    proponent_name: string;
    project_title: string;
    project_type: string;
    category: string;
    proposed_amount: string;
    location: string;
    contact_person: string;
    mobile_number: string;
    brief_description: string;
}

function DilpForm() {
    const [formData, setFormData] = useState<FormData>({
        proponent_name: '',
        project_title: '',
        project_type: 'Individual',
        category: 'Formation',
        proposed_amount: '',
        location: '',
        contact_person: '',
        mobile_number: '',
        brief_description: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validate required fields
            if (!formData.proponent_name.trim()) {
                setError("Proponent name is required");
                setLoading(false);
                return;
            }
            if (!formData.project_title.trim()) {
                setError("Project title is required");
                setLoading(false);
                return;
            }
            if (!formData.proposed_amount) {
                setError("Proposed amount is required");
                setLoading(false);
                return;
            }

            // Submit to backend
            const response = await dilpAPI.submitDilpApplication({
                proponent_name: formData.proponent_name,
                project_title: formData.project_title,
                project_type: formData.project_type,
                category: formData.category,
                proposed_amount: parseFloat(formData.proposed_amount),
                location: formData.location,
                contact_person: formData.contact_person,
                mobile_number: formData.mobile_number,
                brief_description: formData.brief_description,
            });

            setSuccess(true);
            console.log("DILP Application submitted successfully:", response);

            // Reset form
            setFormData({
                proponent_name: '',
                project_title: '',
                project_type: 'Individual',
                category: 'Formation',
                proposed_amount: '',
                location: '',
                contact_person: '',
                mobile_number: '',
                brief_description: '',
            });

            // Show success message for 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            console.error("Error submitting DILP proposal:", err);
            setError(err.response?.data?.message || err.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white border-t-8 border-green-600 shadow-xl rounded-lg p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800">DILP Application Form</h2>
                    <p className="text-green-700 font-medium italic">DOLE Integrated Livelihood Program (Kabuhayan)</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 font-medium">✓ Your DILP application has been submitted successfully!</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">✗ {error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Identification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Project Title</label>
                            <input 
                                type="text" 
                                name="project_title" 
                                value={formData.project_title}
                                placeholder="e.g., Rice Retailing or Sari-Sari Store" 
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Proponent Name</label>
                            <input 
                                type="text" 
                                name="proponent_name" 
                                value={formData.proponent_name}
                                placeholder="Individual Name or Group Name" 
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Project Type</label>
                            <select 
                                name="project_type" 
                                value={formData.project_type}
                                onChange={handleChange} 
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Individual">Individual</option>
                                <option value="Group">Group</option>
                            </select>
                        </div>
                    </div>

                    {/* Financials & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Category</label>
                            <select 
                                name="category" 
                                value={formData.category}
                                onChange={handleChange} 
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Formation">Kabuhayan Formation</option>
                                <option value="Enhancement">Kabuhayan Enhancement</option>
                                <option value="Restoration">Kabuhayan Restoration</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Proposed Grant Amount (₱)</label>
                            <input 
                                type="number" 
                                name="proposed_amount" 
                                value={formData.proposed_amount}
                                placeholder="0.00" 
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Location and Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Location/Address</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location}
                                placeholder="Project location" 
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Contact Person</label>
                            <input 
                                type="text" 
                                name="contact_person" 
                                value={formData.contact_person}
                                placeholder="Full name" 
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Mobile Number</label>
                        <input 
                            type="tel" 
                            name="mobile_number" 
                            value={formData.mobile_number}
                            placeholder="09XX-XXX-XXXX" 
                            onChange={handleChange}
                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Project Brief Description</label>
                        <textarea 
                            name="brief_description" 
                            value={formData.brief_description}
                            rows={4} 
                            onChange={handleChange} 
                            placeholder="Briefly explain how this livelihood project will help you..."
                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-black py-4 rounded-lg transition-all transform hover:scale-[1.01] shadow-lg uppercase"
                    >
                        {loading ? 'Submitting...' : 'Submit DILP Proposal'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DilpForm;