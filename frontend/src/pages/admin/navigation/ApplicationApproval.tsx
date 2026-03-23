import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import axios from "axios";

interface Application {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    program_type: string;
    contact_number: string;
    address: string | null;
    status: string;
    applied_at: string;
}

const ApplicationApproval = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [selectedFilter, setSelectedFilter] = useState("Pending");

    // Fetch applications on component mount
    useEffect(() => {
        fetchApplications();
    }, [selectedFilter]);

    const role = localStorage.getItem('role');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const endpoint =
                selectedFilter === "Pending"
                    ? "http://localhost:5000/api/forms/applications/pending"
                    : `http://localhost:5000/api/forms/applications?status=${selectedFilter}`;

            const response = await axios.get(endpoint);
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            alert("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (applicationId: number) => {
        setProcessingId(applicationId);
        try {
            const response = await axios.put(
                `http://localhost:5000/api/forms/applications/${applicationId}/approve`
            );
            
            if (response.status === 200) {
                // Remove from list and show success
                setApplications(applications.filter(app => app.id !== applicationId));
                alert("Application approved successfully! Beneficiary count updated.");
                
                // Refresh list
                fetchApplications();
            }
        } catch (error) {
            console.error("Error approving application:", error);
            alert("Failed to approve application");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (applicationId: number) => {
        const reason = prompt("Enter rejection reason (optional):");
        setProcessingId(applicationId);
        
        try {
            const response = await axios.put(
                `http://localhost:5000/api/forms/applications/${applicationId}/reject`,
                { reason: reason || null }
            );
            
            if (response.status === 200) {
                setApplications(applications.filter(app => app.id !== applicationId));
                alert("Application rejected successfully");
                fetchApplications();
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
            alert("Failed to reject application");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Reviews</h1>
                <p className="text-gray-500 text-sm">Review and approve beneficiary applications</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 border-b border-gray-200">
                {["Pending", "Approved", "Rejected"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedFilter(status)}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                            selectedFilter === status
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-12">
                    <Loader className="animate-spin text-blue-600" size={32} />
                </div>
            )}

            {/* Applications Table */}
            {!loading && applications.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Applicant Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Program
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Address
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {app.first_name} {app.middle_name} {app.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {app.program_type}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {app.contact_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {app.address || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    app.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : app.status === "Approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                {app.status === "Pending" && role === 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(app.id)}
                                                            disabled={processingId === app.id}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            {processingId === app.id ? (
                                                                <Loader size={18} className="animate-spin" />
                                                            ) : (
                                                                <CheckCircle size={18} />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(app.id)}
                                                            disabled={processingId === app.id}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            {processingId === app.id ? (
                                                                <Loader size={18} className="animate-spin" />
                                                            ) : (
                                                                <XCircle size={18} />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && applications.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No {selectedFilter.toLowerCase()} applications</p>
                </div>
            )}
        </div>
    );
};

export default ApplicationApproval;
