import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronDown, ChevronUp, ClipboardList, Edit3, ExternalLink, FileStack, FolderOpen } from 'lucide-react';

import SPESDocumentsModule from '../../components/SPESDocumentsModule';
import { DRAFT_STORAGE_KEY, type SpesOfficialFormKey } from './forms/SpesOfficialForms';
import {
    BENEFICIARY_PROGRAMS,
    BENEFICIARY_SELECTED_PROGRAM_KEY,
    get_program_definition,
    is_program_key,
    type ProgramKey,
} from '../../constants/beneficiaryPrograms';

// ─── Requirements definitions per program ────────────────────────────────────

interface RequirementItem {
    label: string;
    description: string;
    /** If set, this requirement can be filled out via the SPES forms page */
    spes_form_key?: SpesOfficialFormKey;
}

const PROGRAM_REQUIREMENTS: Record<ProgramKey, RequirementItem[]> = {
    SPES: [
        { label: 'SPES Form 2', description: 'Accomplished application form for the SPES program.', spes_form_key: 'form2' },
        { label: 'SPES Form 2a', description: 'Supplemental application form with family background and income details.', spes_form_key: 'form2a' },
        { label: 'SPES Form 4', description: 'Employer endorsement and work deployment form.', spes_form_key: 'form4' },
        { label: 'Passport Size Picture', description: 'Recent 1×1 or 2×2 passport-sized photo with white background.' },
        { label: 'Birth Certificate', description: 'PSA-issued or LCR-certified photocopy of your birth certificate.' },
        { label: 'Certificate of Indigency', description: 'Barangay-issued certificate of indigency.' },
        { label: 'Certificate of Registration', description: 'School-issued certificate confirming current enrollment.' },
        { label: 'Certificate of Grades', description: 'Official grade sheet or transcript from the previous semester.' },
        { label: 'PhilJobNet Registration Screenshot', description: 'Screenshot showing successful registration on the PhilJobNet portal.' },
    ],
    TUPAD: [
        { label: 'Government Issued ID', description: 'Valid government-issued ID with current address.' },
        { label: 'Barangay Certification', description: 'Certificate stating residency and displaced/disadvantaged worker status.' },
        { label: 'Application Form', description: 'Accomplished TUPAD application form provided by DOLE or PESO.' },
        { label: 'Birth Certificate', description: 'PSA-issued copy of birth certificate (if required by local unit).' },
    ],
    DILP: [
        { label: 'Valid Government ID', description: 'Government-issued identification with valid ID number.' },
        { label: 'Project Proposal', description: 'Brief description of the proposed livelihood project.' },
        { label: 'Barangay Clearance', description: 'Clearance from the barangay where the business will operate.' },
        { label: 'Business Registration', description: 'DTI or SEC registration if the enterprise is already existing.' },
    ],
    GIP: [
        { label: 'Government ID', description: 'Valid government-issued identification document.' },
        { label: 'Transcript of Records', description: 'Official transcript or certified true copy from the school.' },
        { label: 'Certificate of Graduation', description: 'Diploma or certificate of graduation from your institution.' },
        { label: 'Barangay Clearance', description: 'Clearance from your residential barangay.' },
        { label: 'NBI / Police Clearance', description: 'National Bureau of Investigation or police clearance certificate.' },
    ],
    JOBSEEKERS: [
        { label: 'Updated Resume / CV', description: 'Current resume or curriculum vitae with contact details.' },
        { label: 'Valid Government ID', description: 'Any valid government-issued identification.' },
        { label: 'Proof of Address', description: 'Barangay certificate or utility bill as proof of residence.' },
        { label: 'Certifications (if any)', description: 'TESDA, NCII, or other relevant training certifications.' },
    ],
};

// ─── SPES form completion helpers ─────────────────────────────────────────────

interface SpesDraft {
    form_2?: Record<string, string>;
    form_2a?: Record<string, string>;
    form_4?: Record<string, string>;
}

const FORM_2_REQUIRED_FIELDS = ['first_name', 'last_name', 'birth_date', 'place_of_birth', 'sex', 'civil_status', 'contact_number', 'present_address', 'permanent_address', 'school_name', 'course_or_track', 'year_level'];
const FORM_2A_REQUIRED_FIELDS = ['father_name', 'mother_name', 'monthly_family_income', 'household_members'];
const FORM_4_REQUIRED_FIELDS = ['applicant_name', 'assigned_office', 'work_assignment', 'supervisor_name', 'supervisor_contact', 'start_date', 'end_date', 'daily_schedule'];

function is_section_complete(data: Record<string, string> | undefined, required_fields: string[]): boolean {
    if (!data) return false;
    return required_fields.every((field) => (data[field] ?? '').trim() !== '');
}

function read_spes_draft(): SpesDraft | null {
    try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function get_spes_form_completion(draft: SpesDraft | null): Record<SpesOfficialFormKey, boolean> {
    return {
        form2: is_section_complete(draft?.form_2, FORM_2_REQUIRED_FIELDS),
        form2a: is_section_complete(draft?.form_2a, FORM_2A_REQUIRED_FIELDS),
        form4: is_section_complete(draft?.form_4, FORM_4_REQUIRED_FIELDS),
    };
}

function has_spes_form_data(draft: SpesDraft | null, key: SpesOfficialFormKey): boolean {
    const map: Record<SpesOfficialFormKey, Record<string, string> | undefined> = {
        form2: draft?.form_2,
        form2a: draft?.form_2a,
        form4: draft?.form_4,
    };
    const data = map[key];
    if (!data) return false;
    return Object.values(data).some((v) => (v ?? '').trim() !== '');
}

function BeneficiaryRequirements() {
    const navigate = useNavigate();
    const [search_params, set_search_params] = useSearchParams();
    const initial_program = useMemo(() => {
        const program_from_query = search_params.get('program');
        if (is_program_key(program_from_query)) {
            return program_from_query;
        }

        const saved_program = localStorage.getItem(BENEFICIARY_SELECTED_PROGRAM_KEY);
        if (is_program_key(saved_program)) {
            return saved_program;
        }

        return 'SPES' as ProgramKey;
    }, [search_params]);

    const [selected_program, set_selected_program] = useState<ProgramKey>(initial_program);
    const [checklist_open, set_checklist_open] = useState<ProgramKey | null>(null);

    // ── SPES form completion tracking ────────────────────────────────────────
    const [spes_completion, set_spes_completion] = useState<Record<SpesOfficialFormKey, boolean>>(() =>
        get_spes_form_completion(read_spes_draft())
    );

    const refresh_spes_completion = useCallback(() => {
        set_spes_completion(get_spes_form_completion(read_spes_draft()));
    }, []);

    // Re-check completion when the page regains focus (user comes back from form)
    useEffect(() => {
        window.addEventListener('focus', refresh_spes_completion);
        return () => window.removeEventListener('focus', refresh_spes_completion);
    }, [refresh_spes_completion]);

    // Also re-check when search_params change (navigated back)
    useEffect(() => {
        refresh_spes_completion();
    }, [search_params, refresh_spes_completion]);

    const navigate_to_spes_form = (form_key: SpesOfficialFormKey) => {
        navigate(`/beneficiary/spes-forms?form=${form_key}&from=requirements`);
    };

    const toggle_checklist = (program_key: ProgramKey) => {
        set_checklist_open((prev) => (prev === program_key ? null : program_key));
    };

    useEffect(() => {
        const program_from_query = search_params.get('program');
        if (is_program_key(program_from_query) && program_from_query !== selected_program) {
            set_selected_program(program_from_query);
        }
    }, [search_params, selected_program]);

    useEffect(() => {
        localStorage.setItem(BENEFICIARY_SELECTED_PROGRAM_KEY, selected_program);
        set_search_params((previous_params) => {
            const next_params = new URLSearchParams(previous_params);
            next_params.set('program', selected_program);
            return next_params;
        }, { replace: true });
    }, [selected_program, set_search_params]);

    const selected_program_definition = get_program_definition(selected_program);

    return (
        <section className="w-full max-w-6xl mx-auto space-y-5">

            {/* ── Header and Program Info ──
            <div className="rounded-3xl border border-gray-200 bg-white px-5 py-5 sm:px-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                            <FolderOpen size={14} />
                            Beneficiary Requirements Workspace
                        </div>
                        <h1 className="mt-3 text-xl sm:text-2xl font-bold text-gray-900">Requirements by Program</h1>
                        <p className="mt-1.5 max-w-2xl text-sm text-gray-500">
                            Switch between programs to view the requirement submitter available for your current beneficiary application.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 lg:max-w-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Selected Program</p>
                        <p className="mt-1 text-base font-bold text-gray-900">{selected_program_definition.short_label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500">{selected_program_definition.description}</p>
                    </div>
                </div>
            </div>
             */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Programs</p>
                            <h2 className="mt-1 text-lg font-bold text-gray-900">Requirements Navigation</h2>
                        </div>


                        {/* ── Check Requirements Buttons ── */}
                        <div className="mt-3 space-y-2">
                            {BENEFICIARY_PROGRAMS.map((program) => {
                                const is_open = checklist_open === program.value;
                                const requirements = PROGRAM_REQUIREMENTS[program.value];
                                const count = requirements.length;

                                return (
                                    <div key={`checklist-${program.value}`}>
                                        <button
                                            type="button"
                                            onClick={() => toggle_checklist(program.value)}
                                            className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                                                is_open
                                                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                                    is_open ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <ClipboardList size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold">{program.short_label}</span>
                                                    <span className="ml-2 text-xs text-gray-500">{count} requirement{count !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                            {is_open ? (
                                                <ChevronUp size={16} className="text-blue-500" />
                                            ) : (
                                                <ChevronDown size={16} className="text-gray-400" />
                                            )}
                                        </button>

                                        {is_open && (
                                            <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/50 p-4 animate-in fade-in duration-200">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
                                                    Required Documents for {program.short_label}
                                                </p>
                                                <ul className="space-y-2">
                                                    {requirements.map((req, index) => {
                                                        const is_form_item = !!req.spes_form_key;
                                                        const form_key = req.spes_form_key;
                                                        const is_complete = form_key ? spes_completion[form_key] : false;
                                                        const has_data = form_key ? has_spes_form_data(read_spes_draft(), form_key) : false;

                                                        return (
                                                            <li
                                                                key={index}
                                                                className={`flex items-start gap-2.5 rounded-lg px-3 py-2 border transition-all ${
                                                                    is_complete
                                                                        ? 'bg-emerald-50 border-emerald-200'
                                                                        : is_form_item
                                                                            ? 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-sm cursor-pointer'
                                                                            : 'bg-white border-blue-100'
                                                                }`}
                                                                onClick={is_form_item && form_key ? () => navigate_to_spes_form(form_key) : undefined}
                                                                role={is_form_item ? 'button' : undefined}
                                                                tabIndex={is_form_item ? 0 : undefined}
                                                                onKeyDown={is_form_item && form_key ? (e) => { if (e.key === 'Enter' || e.key === ' ') navigate_to_spes_form(form_key); } : undefined}
                                                            >
                                                                {/* Status icon */}
                                                                <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                                                    is_complete
                                                                        ? 'bg-emerald-500 text-white'
                                                                        : 'bg-blue-100 text-blue-600'
                                                                }`}>
                                                                    <CheckCircle2 size={12} />
                                                                </span>

                                                                {/* Content */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className={`text-sm font-medium ${
                                                                            is_complete ? 'text-emerald-800' : 'text-gray-800'
                                                                        }`}>{req.label}</span>

                                                                        {is_form_item && is_complete && (
                                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                                                <CheckCircle2 size={10} />
                                                                                Complete
                                                                            </span>
                                                                        )}
                                                                        {is_form_item && !is_complete && has_data && (
                                                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                                                                <Edit3 size={10} />
                                                                                In Progress
                                                                            </span>
                                                                        )}
                                                                        {is_form_item && !is_complete && !has_data && (
                                                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                                                                <ExternalLink size={10} />
                                                                                Fill Out
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{req.description}</p>
                                                                </div>

                                                                {/* Action hint for form items */}
                                                                {is_form_item && (
                                                                    <span className={`mt-0.5 flex-shrink-0 text-xs font-medium ${
                                                                        is_complete ? 'text-emerald-600' : 'text-blue-600'
                                                                    }`}>
                                                                        {is_complete ? 'Edit' : 'Open'} →
                                                                    </span>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {selected_program === 'SPES' ? (
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                                You are viewing the document submitter for the <span className="font-semibold">SPES</span> program.
                            </div>
                            <SPESDocumentsModule />
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm ring-1 ring-inset ring-gray-200">
                                <FileStack size={24} />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                {selected_program_definition.short_label} requirements submitter is not available yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                                The navigation is ready for this program, but the beneficiary-facing requirements uploader has not been implemented yet. Once the module is built, it can be mounted here without changing the sidebar or page structure.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default BeneficiaryRequirements;