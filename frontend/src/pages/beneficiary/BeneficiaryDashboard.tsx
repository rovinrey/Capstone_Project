import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle } from "lucide-react";

import WelcomeBanner from "../../components/Welcomebanner";
import RequirementsSubmissionModule from "../../components/RequirementsSubmissionModule";

function BeneficiaryDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            const user_name = localStorage.getItem('user_name');
            const role = localStorage.getItem('role');

            if (!token || role !== 'beneficiary') {
                navigate('/login');
                return;
            }

            try {
                const profileRes = await axios.get(
                    `http://localhost:5000/api/auth/getProfile`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUser(profileRes.data);
            } catch (err: any) {
                const status = err?.response?.status;
                if (status === 401 || status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                setError("Unable to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid" />
                    <span className="text-gray-500 font-medium">Loading Dashboard…</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Could not load dashboard</h2>
                    <p className="text-gray-600 mb-6 text-sm">{error}</p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                            className="text-sm text-gray-500 hover:text-blue-600 font-medium"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="w-full px-1 sm:px-2 md:px-4">
                <WelcomeBanner text={`Welcome, ${user?.first_name || user?.user_name || 'User'}!`} />
            </div>

            <main className="pb-8 md:pb-12 w-full px-1 sm:px-2 md:px-4 lg:px-8 max-w-7xl mx-auto mt-4">
                <div className="bg-white p-4 sm:p-5 md:p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements Submission Progress</h2>
                    <RequirementsSubmissionModule compact />
                </div>
            </main>
        </div>
    );
}

export default BeneficiaryDashboard;