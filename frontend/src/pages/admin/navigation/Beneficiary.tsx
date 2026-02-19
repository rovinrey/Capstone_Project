import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, MoreVertical, Edit, Eye } from "lucide-react";
import axios from "axios";

interface Beneficiary {
    id: number;
    fullName?: string;
    name?: string;       // older schema
    phone?: string;
    contact?: string;
    email?: string;
    barangay?: string;
    barangay_id?: number;
    program_type?: string;
    program?: string;
    approved_at?: string;
    status?: string;
}

const BeneficiaryPage = () => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // fetch beneficiaries (approved applications) from API
    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get("http://localhost:5000/api/beneficiaries"); // backend endpoint to fetch beneficiaries
            console.log("beneficiaries fetched", response.data);
            setBeneficiaries(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load beneficiaries. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Beneficiary Management</h1>
                    <p className="text-sm text-gray-500">Manage and track all registered beneficiaries across programs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm">
                        <Download size={18} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 font-medium text-sm">
                        <Plus size={18} />
                        Add Beneficiary
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or contact..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option>All Programs</option>
                        <option>TUPAD</option>
                        <option>Pangkabuhayan</option>
                    </select>
                    <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option>All Barangays</option>
                        <option>Poblacion</option>
                        <option>San Jose</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center">
                        Loading beneficiaries...
                    </div>
                ) : error ? (
                    <div className="p-6 text-red-600 text-center">
                        {error}
                    </div>
                ) : beneficiaries.length === 0 ? (
                    <div className="p-6 text-gray-500 text-center">
                        No beneficiaries yet. Approve applications to populate this list.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Program</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Approved</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {beneficiaries.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">
                                                {b.fullName || b.name || "-"}
                                            </span>
                                            {b.email && (
                                                <span className="text-xs text-gray-500">
                                                    {b.email}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {b.phone || b.contact || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600">
                                            {b.program_type || b.program || "-"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {b.approved_at ? new Date(b.approved_at).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {beneficiaries.length} beneficiaries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryPage;