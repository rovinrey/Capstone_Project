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

function BeneficiaryDashboard() {
    const [view, setView] = useState('apply'); 
    const [activeForm, setActiveForm] = useState('TUPAD');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        
        // get user profile on component mount
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/getProfile');
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                // setLoading(false);
            }   
        };

        fetchUserProfile();
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 w-full z-50 shadow-sm"> 
                <Topnav />
            </div>

            <div className="pt-20 w-full px-4">
                <WelcomeBanner text={`Welcome, ${user?.user_name || "Beneficiary"}!`} />
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
                </div>

                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">
                    {view === 'apply' ? (
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
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <ClipboardList size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">No Active Applications</h2>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">You haven't submitted any applications yet. Select "New Application" to get started.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default BeneficiaryDashboard;