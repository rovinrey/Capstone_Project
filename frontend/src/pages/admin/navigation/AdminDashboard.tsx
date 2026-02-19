import { useState, useEffect } from "react";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import StatCard from "../../../components/Card";
import axios from "axios";

interface Application {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    program_type: string;
    contact_number: string;
    occupation: string;
    monthly_income: number;
    status: string;
    created_at: string;
}

function AdminDashboard() {

    // cards
    const [stats, setStats] = useState({
        total_beneficiaries: 0, 
        active_programs: 0,
        total_distributed: 0,
        employment_rate: 0
    });
    
    const [recentApps, setRecentApps] = useState<Application[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchRecentApplications();
        fetchBeneficiaryCount();
    }, []);
    
    const fetchRecentApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5000/api/forms/recent?limit=10");
            setRecentApps(response.data);
        } catch (err: any) {
            console.error("Error fetching recent applications:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBeneficiaryCount = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/beneficiaries/count");
            setStats(prev => ({ ...prev, total_beneficiaries: res.data.count }));
        } catch (err) {
            console.error("Error fetching beneficiary count", err);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    // application status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'Rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    
    const handleApprove = async (id: number) => {
        setProcessingId(id);
        try {
            const res = await axios.put(`http://localhost:5000/api/forms/applications/${id}/approve`);
            if (res.status === 200) {
                setRecentApps(recentApps.filter(app => app.id !== id));
                alert("Application approved successfully");
                fetchRecentApplications();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to approve application");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt("Rejection reason (optional):");
        setProcessingId(id);
        try {
            const res = await axios.put(`http://localhost:5000/api/forms/applications/${id}/reject`, { reason: reason || null });
            if (res.status === 200) {
                setRecentApps(recentApps.filter(app => app.id !== id));
                alert("Application rejected");
                fetchRecentApplications();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to reject application");
        } finally {
            setProcessingId(null);
        }
    };
    return (
        <>
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">System overview and application monitoring</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Beneficiaries" value={stats.total_beneficiaries.toLocaleString()} trend="0%" trendLabel="this week" />
                <StatCard title="Active Programs" value={stats.active_programs.toString()} trend="Active" trendLabel="Programs" />
                <StatCard title="Total Distributed" value={`₱${stats.total_distributed.toLocaleString()}`} trend="0%" trendLabel="vs last month" />
                <StatCard title="Employment Rate" value={`${stats.employment_rate}%`} trend="0%" trendLabel="growth" />
            </div>

            {/* Recent Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border_gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
                    <button
                        onClick={() => window.location.assign('/applications')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        View All
                    </button>
                </div>

                {loading ? (
                    <div className="p-6 flex justify-center items-center">
                        <Loader className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-600">
                        <p>Error loading applications: {error}</p>
                    </div>
                ) : recentApps.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <p>No applications yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Applicant Name</th>
                                    <th className="px-6 py-4">Program</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Occupation</th>
                                    <th className="px-6 py-4">Date Applied</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {app.first_name} {app.middle_name ? app.middle_name + ' ' : ''}{app.last_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-semibold">
                                                {app.program_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {app.contact_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {app.occupation || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(app.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {app.status === 'Pending' ? (
                                                <div className="flex justify-center gap-2">
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
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminDashboard;