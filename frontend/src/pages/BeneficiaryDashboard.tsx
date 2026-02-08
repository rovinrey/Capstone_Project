import { useState } from "react";
import TupadForm from "../components/forms/TUPADform";
import Topnav from '../components/TopNav';
import SpesForm from '../components/SPESform';
import DilpForm from "../components/forms/DILPform";
import WelcomeBanner from "../components/Welcomebanner";

function BeneficiaryDashboard() {
    const [activeForm, setActiveForm] = useState('TUPAD');

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userName = user?.fullName || 'guest';
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation - Fixed at the top */}
            <div className="fixed top-0 w-full z-50 shadow-md">
                <Topnav />
            </div>

              {/* Welcome Banner - Now properly spaced and aligned with the container */}
                <div className=" pt-20  w-full  px-4 ">
                    <WelcomeBanner text={`Welcome, ${userName}!`} />
                </div>
                

            {/* Main Content Area */}
            {/* pt-24 (96px) ensures content starts below the fixed navbar */}
            <div className="pt-4 pb-12 w-full  px-4 sm:px-6 lg:px-8">
                
              
                {/* Form Card Container */}
                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">

                    {/* Header Section */}
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Application Portal
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base mt-2">
                            Select a DOLE program below to start your application process.
                        </p>
                    </div>

                    {/* Program Selection - Clean and responsive */}
                    <div className="mb-10">
                        <label htmlFor="program-select" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            Available Programs
                        </label>
                        <div className="relative group">
                            <select
                                id="program-select"
                                value={activeForm}
                                onChange={(e) => setActiveForm(e.target.value)}
                                className="w-full md:w-3/4 lg:w-1/2 p-4 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all cursor-pointer font-bold text-gray-700 appearance-none"
                            >
                                <option value="TUPAD">TUPAD (Emergency Employment)</option>
                                <option value="SPES">SPES (Student Employment)</option>
                                <option value="DILP">DILP (Livelihood Program)</option>
                            </select>
                            {/* Custom arrow for the dropdown */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 md:right-1/4 lg:right-1/2 flex items-center px-4 text-gray-400 group-hover:text-blue-600 transition-colors">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Content Divider */}
                    <hr className="border-gray-100 mb-10" />

                    {/* Form Area with simple fade-in effect */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeForm === 'TUPAD' && <TupadForm />}
                        {activeForm === 'SPES' && <SpesForm />}
                        {activeForm === 'DILP' && <DilpForm />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BeneficiaryDashboard;