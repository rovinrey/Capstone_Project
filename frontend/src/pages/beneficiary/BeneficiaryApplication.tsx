import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutGrid, Clock } from "lucide-react";

import TupadForm from "./forms/TUPADform";
import SpesForm from "./forms/SpesOfficialForms";
import DilpForm from "./forms/DILPform";
import GIPform from "./forms/GIPform";
import JobSeekerForm from "./forms/JobseekersForm";
import SPESDocumentsModule from "../../components/SPESDocumentsModule";
import ApplicationStatusPanel from "../../components/ApplicationStatusPanel";
import applicationStatusAPI, { type ApplicationSubmission } from "../../api/applicationStatus.api";
import {
    BENEFICIARY_PROGRAMS,
    BENEFICIARY_SELECTED_PROGRAM_KEY,
    type ProgramKey,
} from '../../constants/beneficiaryPrograms';

type MainTab = 'apply' | 'status';
type SpesSubTab = 'form' | 'requirements';

function BeneficiaryApplication() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [mainTab, setMainTab] = useState<MainTab>('apply');
    const [activeProgram, setActiveProgram] = useState<ProgramKey>('TUPAD');
    const [spesSubTab, setSpesSubTab] = useState<SpesSubTab>('form');
    const [allDocsSubmitted, setAllDocsSubmitted] = useState(false);
    const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([]);

    useEffect(() => {
        localStorage.setItem(BENEFICIARY_SELECTED_PROGRAM_KEY, activeProgram);
    }, [activeProgram]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const user_name = localStorage.getItem('user_name');
            const role = localStorage.getItem('role');
            const userId = localStorage.getItem('user_id');

            if (!token || role !== 'beneficiary') {
                navigate('/login');
                return;
            }

            try {
                const [profileRes, statusRes] = await Promise.allSettled([
                    axios.get(
                        `http://localhost:5000/api/auth/getProfile?user_name=${user_name}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    ),
                    applicationStatusAPI.getStatus(userId || '', token),
                ]);

                if (profileRes.status === 'fulfilled') {
                    setUser(profileRes.value.data);
                } else {
                    const status = profileRes.reason?.response?.status;
                    if (status === 401 || status === 403) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    setError('Failed to load profile data.');
                }

                if (statusRes.status === 'fulfilled') {
                    setSubmissions(statusRes.value.submissions || []);
                }
            } catch {
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    <span className="text-sm text-gray-500 font-medium">Loading…</span>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full max-w-5xl mx-auto space-y-5">
            {/* ── Page header ── */}
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 sm:px-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Application Portal</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Apply for a PESO program or check your submission status.</p>
                </div>
                {user && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 self-start sm:self-center">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        {user.first_name || user.user_name}
                    </span>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {/* ── Main tabs ── */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setMainTab('apply')}
                        className={`relative flex items-center gap-2 flex-1 justify-center py-3.5 text-sm font-semibold transition-colors focus:outline-none ${
                            mainTab === 'apply' ? 'text-blue-700 bg-blue-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                        <LayoutGrid size={15} />
                        New Application
                        {mainTab === 'apply' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMainTab('status')}
                        className={`relative flex items-center gap-2 flex-1 justify-center py-3.5 text-sm font-semibold transition-colors focus:outline-none ${
                            mainTab === 'status' ? 'text-blue-700 bg-blue-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                        <Clock size={15} />
                        My Submissions
                        {submissions.length > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                                {submissions.length}
                            </span>
                        )}
                        {mainTab === 'status' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </button>
                </div>

                {/* ── Apply panel ── */}
                {mainTab === 'apply' && (
                    <div className="p-4 sm:p-6">
                        {/* Program selector */}
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Select Program
                            </label>
                            <div className="relative w-full sm:max-w-sm">
                                <select
                                    value={activeProgram}
                                    onChange={(e) => setActiveProgram(e.target.value as ProgramKey)}
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                >
                                    {BENEFICIARY_PROGRAMS.map((p) => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Non-SPES forms render directly */}
                        {activeProgram !== 'SPES' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {activeProgram === 'TUPAD'      && <TupadForm />}
                                {activeProgram === 'DILP'       && <DilpForm />}
                                {activeProgram === 'GIP'        && <GIPform />}
                                {activeProgram === 'JOBSEEKERS' && <JobSeekerForm />}
                            </div>
                        )}

                        {/* SPES: sub-tabs for form vs. requirements */}
                        {activeProgram === 'SPES' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex gap-1 rounded-xl bg-gray-100 p-1 mb-6 w-full sm:w-auto sm:inline-flex">
                                    <button
                                        type="button"
                                        onClick={() => setSpesSubTab('form')}
                                        className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                                            spesSubTab === 'form'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Application Form
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSpesSubTab('requirements')}
                                        className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                                            spesSubTab === 'requirements'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Requirements
                                        {allDocsSubmitted && (
                                            <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-emerald-500 align-middle" />
                                        )}
                                    </button>
                                </div>

                                {spesSubTab === 'form' && (
                                    <div>
                                        {!allDocsSubmitted && (
                                            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
                                                <svg className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-semibold text-amber-800">Upload your requirements first</p>
                                                    <p className="text-xs text-amber-600 mt-0.5">
                                                        Switch to the <strong>Requirements</strong> tab and upload all documents before submitting your application form.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <SpesForm />
                                    </div>
                                )}

                                {spesSubTab === 'requirements' && (
                                    <SPESDocumentsModule onAllSubmitted={() => setAllDocsSubmitted(true)} />
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Status panel ── */}
                {mainTab === 'status' && (
                    <div className="p-4 sm:p-6">
                        <ApplicationStatusPanel submissions={submissions} />
                    </div>
                )}
            </div>
        </section>
    );
}

export default BeneficiaryApplication;