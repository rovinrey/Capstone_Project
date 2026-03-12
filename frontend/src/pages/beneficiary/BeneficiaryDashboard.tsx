import { useEffect, useState } from "react";
import Topnav from '../../components/TopNav';
import WelcomeBanner from "../../components/Welcomebanner";
import { ClipboardList, LayoutGrid, Clock } from "lucide-react"; 
import axios from "axios";

import TupadForm from "./forms/TUPADform";
import SpesForm from './forms/SpesApplicationForm';
import DilpForm from "./forms/DILPform";
import GIPform from "./forms/GIPform";
import JobSeekerForm from "./forms/JobseekersForm";

import Attendance from '../../components/Attendance';
import ApplicationStatus from '../../components/ApplicationStatus'

function BeneficiaryDashboard() {
    const [view, setView] = useState('apply'); 
    const [activeForm, setActiveForm] = useState('TUPAD');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // get user profile on component mount
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/auth/getProfile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: 401 error', error);
                } else {
                    console.error('Error fetching user profile:', error);
                }
            }
        };
        fetchUserProfile();
    }, []);

    // get the status of the user's applications 
    const [applicationStatus, setApplicationStatus] = useState({
        TUPAD: null,
        SPES: null,
        DILP: null,
    });
    const [statusLoading, setStatusLoading] = useState(true);

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            setStatusLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/applications/status', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setApplicationStatus({
                    TUPAD: response.data?.TUPAD || null,
                    SPES: response.data?.SPES || null,
                    DILP: response.data?.DILP || null,
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: 401 error', error);
                } else {
                    setApplicationStatus({ TUPAD: null, SPES: null, DILP: null });
                    console.error("Error fetching application status:", error);
                }
            } finally {
                setStatusLoading(false);
            }
        };
        fetchApplicationStatus();
    }, []);
    
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid mb-4" />
                    <span className="text-gray-600 text-lg font-semibold">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 w-full z-50 shadow-sm"> 
                <Topnav />
            </div>

            <div className="pt-20 w-full px-4">
                <WelcomeBanner text={`Welcome, ${user?.first_name || user?.user_name || 'User'}${user?.last_name ? ' ' + user.last_name : ''}!`} />
            </div>

            <main className="pb-12 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* View Switcher Tabs */}
                <div className="flex gap-4 mb-6 mt-4">
                    <button
                        onClick={() => setView('apply')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${view === 'apply' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                    >
                        <LayoutGrid size={18} />
                        New Application
                    </button>

                    <button
                        onClick={() => setView('status')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${view === 'status' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                    >
                        <Clock size={18} />
                        Check Status
                    </button>

                    <button
                        onClick={() => setView('attendance')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${view === 'attendance' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                    >
                        <ClipboardList size={18} />
                        Attendance
                    </button>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">
                    {view === 'apply' ? (
                        // ...existing code...
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-black text-gray-900">Application Portal</h1>
                                <p className="text-gray-500 text-sm mt-1">Select a program to start your application.</p>
                            </div>
                            <div className="mb-10">
                                <div className="relative max-w-md">
                                    <select
                                        value={activeForm}
                                        onChange={(e) => setActiveForm(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 appearance-none focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
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
                        statusLoading ? (
                            <div className="text-center py-12">
                                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <ClipboardList size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Loading application status...</h2>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <ClipboardList size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Application Status</h2>
                                <div className="max-w-xs mx-auto mt-4 flex flex-col gap-4">
                                    <div className="flex items-center gap-2 justify-between">
                                        <span className="font-semibold">TUPAD:</span>
                                        <span className={`px-2 py-1 rounded ${applicationStatus.TUPAD === 'Approved' ? 'bg-green-100 text-green-700' : applicationStatus.TUPAD === 'Pending' ? 'bg-yellow-100 text-yellow-700' : applicationStatus.TUPAD === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{applicationStatus.TUPAD || 'Not Applied'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-between">
                                        <span className="font-semibold">SPES:</span>
                                        <span className={`px-2 py-1 rounded ${applicationStatus.SPES === 'Approved' ? 'bg-green-100 text-green-700' : applicationStatus.SPES === 'Pending' ? 'bg-yellow-100 text-yellow-700' : applicationStatus.SPES === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{applicationStatus.SPES || 'Not Applied'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-between">
                                        <span className="font-semibold">DILP:</span>
                                        <span className={`px-2 py-1 rounded ${applicationStatus.DILP === 'Approved' ? 'bg-green-100 text-green-700' : applicationStatus.DILP === 'Pending' ? 'bg-yellow-100 text-yellow-700' : applicationStatus.DILP === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{applicationStatus.DILP || 'Not Applied'}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : view === 'attendance' ? (
                        <div className="py-12">
                            {/* Attendance feature UI */}
                            <Attendance />
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
}

export default BeneficiaryDashboard;