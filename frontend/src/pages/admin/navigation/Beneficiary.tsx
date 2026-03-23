import { useState, useEffect } from "react";
import { Plus, Search, Download, X } from "lucide-react";
import axios from "axios";
import AttendanceMonitoringTable from "../../../components/AttendanceMonitoringTable";

interface Beneficiary {
    id: number;
    application_id?: number;
    first_name?: string;
    middle_name?: string | null;
    last_name?: string;
    full_name?: string;
    contact_number?: string;
    email?: string;
    address?: string | null;
    program_type?: string;
    approval_date?: string;
    status?: string;
}

interface BeneficiaryDetails {
    application: Record<string, any>;
    details: {
        tupad: Record<string, any> | null;
        spes: Record<string, any> | null;
        dilp: Record<string, any> | null;
        gip: Record<string, any> | null;
        jobseeker: Record<string, any> | null;
    };
}

const BeneficiaryPage = () => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<BeneficiaryDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);


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

    const toLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const renderObjectSection = (title: string, data: Record<string, any> | null) => {
        if (!data) {
            return null;
        }

        const entries = Object.entries(data).filter(([, value]) => value !== null && value !== undefined && value !== '');
        if (entries.length === 0) {
            return null;
        }

        return (
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">{title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {entries.map(([key, value]) => (
                        <div key={key} className="text-sm">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider">{toLabel(key)}</p>
                            <p className="font-semibold text-gray-800 break-words">{String(value)}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const openDetails = async (applicationId: number) => {
        setDetailsLoading(true);
        setDetailsError(null);
        setSelectedDetails(null);

        try {
            const response = await axios.get(`http://localhost:5000/api/beneficiaries/${applicationId}/details`);
            setSelectedDetails(response.data);
        } catch (err) {
            console.error(err);
            setDetailsError('Failed to load beneficiary details.');
        } finally {
            setDetailsLoading(false);
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
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Address</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Program</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Approved</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {beneficiaries.map((b) => (
                                <tr
                                    key={b.id}
                                    className="hover:bg-blue-50/60 transition-colors cursor-pointer"
                                    onClick={() => openDetails(b.application_id || b.id)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">
                                                {b.full_name || `${b.first_name || ''} ${b.middle_name || ''} ${b.last_name || ''}`.replace(/\s+/g, ' ').trim() || "N/A"}
                                            </span>
                                            {b.email && (
                                                <span className="text-xs text-gray-500">
                                                    {b.email}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {b.contact_number || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {b.address || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600">
                                            {b.program_type || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                                            Approved
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {b.approval_date ? new Date(b.approval_date).toLocaleDateString() : "N/A"}
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

            {/* Attendance Monitoring Section */}
            <div className="mt-8">
                <AttendanceMonitoringTable />
            </div>

            {(detailsLoading || selectedDetails || detailsError) && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-gray-200 shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Beneficiary Application Details</h3>
                                <p className="text-xs text-gray-500">Complete data submitted by the user</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedDetails(null);
                                    setDetailsError(null);
                                    setDetailsLoading(false);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {detailsLoading && <p className="text-sm text-gray-600">Loading details...</p>}
                            {detailsError && <p className="text-sm text-red-600">{detailsError}</p>}
                            {!detailsLoading && !detailsError && selectedDetails && (
                                <>
                                    {renderObjectSection('Application Information', selectedDetails.application)}
                                    {renderObjectSection('TUPAD Form Data', selectedDetails.details.tupad)}
                                    {renderObjectSection('SPES Form Data', selectedDetails.details.spes)}
                                    {renderObjectSection('DILP Form Data', selectedDetails.details.dilp)}
                                    {renderObjectSection('GIP Form Data', selectedDetails.details.gip)}
                                    {renderObjectSection('Jobseeker Form Data', selectedDetails.details.jobseeker)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeneficiaryPage;