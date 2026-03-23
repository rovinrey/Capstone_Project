import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for redirection
import axios from "axios";
import { ClipboardList, LayoutGrid, Clock, AlertCircle } from "lucide-react";

// Components & Forms
import WelcomeBanner from "../../components/Welcomebanner";
import TupadForm from "./forms/TUPADform";
import SpesForm from './forms/SpesApplicationForm';
import DilpForm from "./forms/DILPform";
import GIPform from "./forms/GIPform";
import JobSeekerForm from "./forms/JobseekersForm";
import Attendance from '../../components/Attendance';
import ApplicationStatusPanel from '../../components/ApplicationStatusPanel';
import applicationStatusAPI, { type ApplicationSubmission } from '../../api/applicationStatus.api';

function BeneficiaryDashboard() {
    const navigate = useNavigate();
    const [view, setView] = useState('apply');
    const [activeForm, setActiveForm] = useState('TUPAD');
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [statusLoading, setStatusLoading] = useState(true);
    const [applicationStatus, setApplicationStatus] = useState<{ [key: string]: string | null }>({
        TUPAD: null,
        SPES: null,
        DILP: null,
        GIP: null,
        Jobseeker: null,
    });
    const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([]);
   
    useEffect(() => {
        const fetchAllDashboardData = async () => {
            const token = localStorage.getItem('token');
            const user_name = localStorage.getItem('user_name');
            const role = localStorage.getItem('role');

            // Role-based access control
            if (!token || role !== 'beneficiary') {
                console.warn("No authentication token or invalid role, redirecting to login...");
                navigate('/login');
                return;
            }

            try {
                const userId = localStorage.getItem('user_id');

                const [profileRes, statusRes] = await Promise.allSettled([
                    axios.get(`http://localhost:5000/api/auth/getProfile?user_name=${user_name}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    applicationStatusAPI.getStatus(userId || '', token)
                ]);

                if (profileRes.status === 'fulfilled') {
                    setUser(profileRes.value.data);
                } else {
                    const status = profileRes.reason.response?.status;
                    if (status === 401 || status === 403) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    setError(status === 404 
                        ? "Profile endpoint not found. Check backend routes." 
                        : "Unable to load profile data.");
                }

                if (statusRes.status === 'fulfilled') {
                    setApplicationStatus(statusRes.value.summary || {});
                    setSubmissions(statusRes.value.submissions || []);
                }

            } catch (err) {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred while syncing your data.");
            } finally {
                setStatusLoading(false);
            }
        };

        fetchAllDashboardData();
     
    }, [navigate]);

    // Error State UI
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">System Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                        >
                            Retry Connection
                        </button>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                            }}
                            className="text-sm text-gray-500 hover:text-blue-600 font-medium"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Loading State UI
    if (statusLoading && !user) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid mb-4" />
                    <span className="text-gray-600 text-lg font-semibold">Syncing Dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="w-full px-1 sm:px-2 md:px-4">
                <WelcomeBanner text={`Welcome, ${user?.first_name || user?.user_name || 'User'}!`} />
            </div>

            <main className="pb-8 md:pb-12 w-full px-1 sm:px-2 md:px-4 lg:px-8 max-w-7xl mx-auto">
                {/* View Switcher Tabs */}
                <div className="flex gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6 mt-4 overflow-x-auto pb-2">
                    <button
                        onClick={() => setView('apply')}
                        className={`flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${view === 'apply' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                    >
                        <LayoutGrid size={18} />
                        New Application
                    </button>

                    <button
                        onClick={() => setView('status')}
                        className={`flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${view === 'status' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                    >
                        <Clock size={18} />
                        Check Status
                    </button>

                    <button
                        onClick={() => setView('attendance')}
                        className={`flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${view === 'attendance' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                    >
                        <ClipboardList size={18} />
                        Attendance
                    </button>
                </div>

                <div className="bg-white p-4 sm:p-5 md:p-8 rounded-2xl shadow-sm border border-gray-200">
                    {view === 'apply' ? (
                        <>
                            <div className="mb-6 md:mb-8">
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900">Application Portal</h1>
                                <p className="text-gray-500 text-sm mt-1">Select a program to start your application.</p>
                            </div>
                            <div className="mb-6 md:mb-10">
                                <div className="relative w-full md:max-w-md">
                                    <select
                                        value={activeForm}
                                        onChange={(e) => setActiveForm(e.target.value)}
                                        className="w-full p-3.5 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 appearance-none focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm md:text-base"
                                    >
                                        <option value="TUPAD">TUPAD (Emergency Employment)</option>
                                        <option value="SPES">SPES (Student Employment)</option>
                                        <option value="DILP">DILP (Livelihood Program)</option>
                                        <option value="GIP">GIP (Government Internship Program)</option>
                                        <option value="JOBSEEKERS">Job Seekers Assistance</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {activeForm === 'TUPAD' && <TupadForm />}
                                {activeForm === 'SPES' && <SpesForm />}
                                {activeForm === 'DILP' && <DilpForm />}
                                {activeForm === 'GIP' && <GIPform />}
                                {activeForm === 'JOBSEEKERS' && <JobSeekerForm />}
                            </div>
                        </>
                    ) : view === 'status' ? (
                        <div className="py-1 sm:py-2 md:py-4">
                            <ApplicationStatusPanel summary={applicationStatus} submissions={submissions} />
                        </div>
                    ) : (
                        <div className="py-12">
                            <Attendance />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default BeneficiaryDashboard;