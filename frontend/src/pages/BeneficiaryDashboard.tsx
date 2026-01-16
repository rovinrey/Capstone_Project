import { useState } from "react";
import TupadForm from "../components/TUPADform";
import Topnav from '../components/TopNav';
import SpesForm from '../components/SPESform';
import DilpForm from "../components/DILPform";

function BeneficiaryDashboard() {
    const [activeForm, setActiveForm] = useState('TUPAD');

    return (
        <div className="">
            <Topnav />
            
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Application Portal</h1>
                        <p className="text-gray-500 text-sm mt-1">Select a program to start your application.</p>
                    </div>

                    {/* Styled Dropdown Selection */}
                    <div className="mb-10">
                        <label htmlFor="program-select" className="block text-sm font-semibold text-gray-700 mb-2">
                            Available Programs
                        </label>
                        <select 
                            id="program-select"
                            value={activeForm}
                            onChange={(e) => setActiveForm(e.target.value)}
                            className="w-full md:w-1/2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium text-gray-700"
                        >
                            <option value="TUPAD">TUPAD (Emergency Employment)</option>
                            <option value="SPES">SPES (Student Employment)</option>
                            <option value="DILP">DILP (Livelihood Program)</option>
                        </select>
                    </div>

                    {/* Conditional Rendering Area */}
                    <div className="mt-6 border-t pt-8">
                        {activeForm === 'TUPAD' && (
                            <div className="animate-fadeIn">
                                <TupadForm />
                            </div>
                        )}
                        {activeForm === 'SPES' && (
                            <div className="animate-fadeIn">
                                <SpesForm />
                            </div>
                        )}
                        {activeForm === 'DILP' && (
                            <div className="animate-fadeIn">
                                <DilpForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BeneficiaryDashboard;