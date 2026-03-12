import { useState, useEffect, type JSX } from "react";
import { 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  ChevronRight, 
  MoreHorizontal,
  Briefcase,
  Hammer,
  X,
  Trash2
} from "lucide-react";
import axios from "axios";

interface Program {
    id: number;
    program_name: string;
    location: string;
    slots: number;
    filled: number;
    budget: number;
    used: number;
    status: string;
    icon?: JSX.Element;
}

const Programs = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [beneficiaryCounts, setBeneficiaryCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; programId: number | null }>({
        show: false,
        programId: null
    });
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        slots: "",
        budget: "",
        status: "Ongoing"
    });

    // Fetch programs from backend on component mount
    useEffect(() => {
        fetchPrograms();
        fetchBeneficiaryCounts();
    }, []);

    // get all programs and display in the admin UI 
        const fetchBeneficiaryCounts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/beneficiaries/count');
                // response.data is an array: [{ program_type: 'TUPAD', count: 1 }, ...]
                const counts: Record<string, number> = {};
                response.data.forEach((row: any) => {
                    counts[row.program_type] = row.count;
                });
                setBeneficiaryCounts(counts);
            } catch (error) {
                console.error('Error fetching beneficiary counts:', error);
            }
        };
    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/programs/allPrograms');
            setPrograms(response.data.map((prog: any) => ({
                id: prog.id,
                program_name: prog.program_name,
                location: prog.location,
                slots: prog.slots,
                filled: prog.filled,
                budget: prog.budget,
                used: prog.used,
                status: prog.status,
                icon: prog.program_name.includes('TUPAD') 
                    ? <Hammer className="text-orange-600" size={20} />
                    : <Briefcase className="text-purple-600" size={20} />
            })));
        } catch (error) {
            console.error("Error fetching programs:", error);
        } finally {
            setLoading(false);
        }
    };

    const createProgram = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: "",
            location: "",
            slots: "",
            budget: "",
            status: "Ongoing"
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5000/api/programs', {
                name: formData.name,
                location: formData.location,
                slots: parseInt(formData.slots),
                budget: parseInt(formData.budget),
                status: formData.status
            });

            if (response.status === 201) {
                // Add new program to the list
                const newProgram = response.data.program;
                setPrograms([...programs, {
                    ...newProgram,
                    program_name: newProgram.name,
                    icon: formData.name.includes('TUPAD')
                        ? <Hammer className="text-orange-600" size={20} />
                        : <Briefcase className="text-purple-600" size={20} />
                }]);
                closeModal();
                alert("Program created successfully!");
            }
        } catch (error) {
            console.error("Error creating program:", error);
            alert("Failed to create program");
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteConfirm = (programId: number) => {
        setDeleteConfirm({ show: true, programId });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ show: false, programId: null });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.programId !== null) {
            try {
                await axios.delete(`http://localhost:5000/api/programs/${deleteConfirm.programId}`);
                setPrograms(programs.filter(prog => prog.id !== deleteConfirm.programId));
                closeDeleteConfirm();
                alert("Program deleted successfully!");
            } catch (error) {
                console.error("Error deleting program:", error);
                alert("Failed to delete program");
            }
        }
    };
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Program Management</h1>
                    <p className="text-gray-500 text-sm">Monitor budget utilization and beneficiary allocation.</p>
                </div>
                <button 
                    onClick={createProgram}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-100">
                    <Plus size={18} />
                    Create New Program
                </button>
            </div>

            {/* Program Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <p className="text-gray-500">Loading programs...</p>
                </div>
            ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {programs.map((prog) => {
                    const beneficiaryCount = beneficiaryCounts[prog.program_name] || 0;
                    const progress = (beneficiaryCount / prog.slots) * 100;
                    const budgetProgress = (prog.used / prog.budget) * 100;

                    return (
                        <div key={prog.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        {prog.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{prog.program_name}</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} /> Starts: Feb 2026 • {prog.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        prog.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {prog.status}
                                    </span>
                                    <button
                                        onClick={() => openDeleteConfirm(prog.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Delete Program"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Beneficiary Slots Progress */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500 font-medium">Beneficiary Slots</span>
                                        <span className="text-gray-900 font-bold">{beneficiaryCount} / {prog.slots}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Budget Utilization Progress */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500 font-medium">Budget Utilization</span>
                                        <span className="text-gray-900 font-bold">₱{prog.used.toLocaleString()}</span>
                                     </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                            style={{ width: `${budgetProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                        +42
                                    </div>
                                </div>
                                <button className="text-blue-600 font-bold text-sm flex items-center hover:gap-2 transition-all">
                                    Manage Program <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            )}

            {/* Empty State */}
            {!loading && programs.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No programs yet. Create one to get started!</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="text-red-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Program?</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to delete this program? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={closeDeleteConfirm}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Program Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Create New Program</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Program Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., TUPAD - Emergency Employment"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., District 1, Sorsogon"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Slots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Slots
                                </label>
                                <input
                                    type="number"
                                    name="slots"
                                    value={formData.slots}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 500"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget (₱)
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2500000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                        submitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {submitting ? 'Creating...' : 'Create Program'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programs;