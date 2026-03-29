import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export type SpesOfficialFormKey = 'form2' | 'form2a' | 'form4';

// spes form 2 - personal info, family background, educational background
interface Form2Data {
    first_name: string;
    middle_name: string;
    last_name: string;
    birth_date: string;
    place_of_birth: string;
    sex: string;
    civil_status: string;
    contact_number: string;
    email_address: string;
    present_address: string;
    permanent_address: string;
    citizenship: string;
    social_media: string;
    type_of_student: string;
    parent_status: string;
    education_level: string;
    school_name: string;
    course_or_track: string;
    year_level: string;
}

interface Form2AData {
    father_name: string;
    father_occupation: string;
    father_contact: string;
    mother_name: string;
    mother_occupation: string;
    mother_contact: string;
    monthly_family_income: string;
    household_members: string;
    is_4ps_beneficiary: string;
    indigency_status: string;
}

interface Form4Data {
    applicant_name: string;
    assigned_office: string;
    work_assignment: string;
    supervisor_name: string;
    supervisor_contact: string;
    start_date: string;
    end_date: string;
    daily_schedule: string;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export const DRAFT_STORAGE_KEY = 'spes_official_forms_draft_v1';

const tab_styles = {
    active: 'bg-white text-slate-900 shadow-sm',
    idle: 'text-slate-500 hover:text-slate-700',
};

const input_style =
    'w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm';
const label_style = 'block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider';

function SpesOfficialForms() {
    const [search_params] = useSearchParams();
    const navigate = useNavigate();
    const from_requirements = search_params.get('from') === 'requirements';
    const initial_tab = (search_params.get('form') as SpesOfficialFormKey) || 'form2';

    const [active_form, set_active_form] = useState<SpesOfficialFormKey>(initial_tab);
    const [submit_state, set_submit_state] = useState<SubmitState>('idle');
    const [submit_message, set_submit_message] = useState('');

    const [form_2, set_form_2] = useState<Form2Data>({
        first_name: '',
        middle_name: '',
        last_name: '',
        birth_date: '',
        place_of_birth: '',
        sex: '',
        civil_status: '',
        contact_number: '',
        email_address: '',
        present_address: '',
        permanent_address: '',
        citizenship: 'Filipino',
        social_media: '',
        type_of_student: 'Student',
        parent_status: 'Living together',
        education_level: 'Tertiary',
        school_name: '',
        course_or_track: '',
        year_level: '',
    });

    const [form_2a, set_form_2a] = useState<Form2AData>({
        father_name: '',
        father_occupation: '',
        father_contact: '',
        mother_name: '',
        mother_occupation: '',
        mother_contact: '',
        monthly_family_income: '',
        household_members: '',
        is_4ps_beneficiary: 'No',
        indigency_status: 'Yes',
    });

    const [form_4, set_form_4] = useState<Form4Data>({
        applicant_name: '',
        assigned_office: '',
        work_assignment: '',
        supervisor_name: '',
        supervisor_contact: '',
        start_date: '',
        end_date: '',
        daily_schedule: '',
    });

    const tabs = useMemo(
        () => [
            { key: 'form2' as SpesOfficialFormKey, label: 'SPES Form 2' },
            { key: 'form2a' as SpesOfficialFormKey, label: 'SPES Form 2A' },
            { key: 'form4' as SpesOfficialFormKey, label: 'SPES Form 4' },
        ],
        []
    );

    useEffect(() => {
        const stored_draft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!stored_draft) return;

        try {
            const parsed_draft = JSON.parse(stored_draft);
            if (parsed_draft.form_2) set_form_2((prev) => ({ ...prev, ...parsed_draft.form_2 }));
            if (parsed_draft.form_2a) set_form_2a((prev) => ({ ...prev, ...parsed_draft.form_2a }));
            if (parsed_draft.form_4) set_form_4((prev) => ({ ...prev, ...parsed_draft.form_4 }));
        } catch {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        const draft = { form_2, form_2a, form_4 };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }, [form_2, form_2a, form_4]);

    const is_form_2_complete = Boolean(
        form_2.first_name.trim() &&
            form_2.last_name.trim() &&
            form_2.birth_date &&
            form_2.place_of_birth.trim() &&
            form_2.sex &&
            form_2.civil_status &&
            form_2.contact_number.trim() &&
            form_2.present_address.trim() &&
            form_2.permanent_address.trim() &&
            form_2.school_name.trim() &&
            form_2.course_or_track.trim() &&
            form_2.year_level.trim()
    );

    const is_form_2a_complete = Boolean(
        form_2a.father_name.trim() &&
            form_2a.mother_name.trim() &&
            form_2a.monthly_family_income.trim() &&
            form_2a.household_members.trim()
    );

    const is_form_4_complete = Boolean(
        form_4.applicant_name.trim() &&
            form_4.assigned_office.trim() &&
            form_4.work_assignment.trim() &&
            form_4.supervisor_name.trim() &&
            form_4.supervisor_contact.trim() &&
            form_4.start_date &&
            form_4.end_date &&
            form_4.daily_schedule.trim()
    );

    const completion_count = [is_form_2_complete, is_form_2a_complete, is_form_4_complete].filter(Boolean).length;
    const completion_pct = Math.round((completion_count / 3) * 100);
    const can_final_submit = is_form_2_complete && is_form_2a_complete && is_form_4_complete;

    const submit_form_2 = (event: React.FormEvent) => {
        event.preventDefault();
        set_submit_state('idle');
        set_submit_message('SPES Form 2 draft saved. Continue to Form 2A.');
        set_active_form('form2a');
    };

    const submit_form_2a = (event: React.FormEvent) => {
        event.preventDefault();
        set_submit_state('idle');
        set_submit_message('SPES Form 2A draft saved. Continue to Form 4.');
        set_active_form('form4');
    };

    const submit_form_4 = (event: React.FormEvent) => {
        event.preventDefault();
        set_submit_state('idle');
        set_submit_message('SPES Form 4 draft saved. You can now submit your SPES application.');
    };

    const handle_final_submit = async () => {
        if (!can_final_submit) return;

        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');

        if (!token) {
            set_submit_state('error');
            set_submit_message('You are not logged in. Please log in again.');
            return;
        }

        set_submit_state('submitting');
        set_submit_message('Submitting your SPES application...');

        try {
            const submission_payload = {
                user_id: user_id ? Number(user_id) : undefined,
                place_of_birth: form_2.place_of_birth,
                citizenship: form_2.citizenship,
                social_media_account: form_2.social_media,
                civil_status: form_2.civil_status,
                sex: form_2.sex,
                type_of_student: form_2.type_of_student,
                parent_status: form_2.parent_status,
                father_name: form_2a.father_name,
                father_occupation: form_2a.father_occupation,
                father_contact: form_2a.father_contact,
                mother_maiden_name: form_2a.mother_name,
                mother_occupation: form_2a.mother_occupation,
                mother_contact: form_2a.mother_contact,
                education_level: form_2.education_level,
                name_of_school: form_2.school_name,
                degree_earned_course: form_2.course_or_track,
                year_level: form_2.year_level,
                present_address: form_2.present_address,
                permanent_address: form_2.permanent_address,
                // Stored as metadata if backend is extended later
                form2_meta: {
                    first_name: form_2.first_name,
                    middle_name: form_2.middle_name,
                    last_name: form_2.last_name,
                    birth_date: form_2.birth_date,
                    contact_number: form_2.contact_number,
                    email_address: form_2.email_address,
                },
                form2a_meta: {
                    monthly_family_income: form_2a.monthly_family_income,
                    household_members: form_2a.household_members,
                    is_4ps_beneficiary: form_2a.is_4ps_beneficiary,
                    indigency_status: form_2a.indigency_status,
                },
                form4_meta: {
                    applicant_name: form_4.applicant_name,
                    assigned_office: form_4.assigned_office,
                    work_assignment: form_4.work_assignment,
                    supervisor_name: form_4.supervisor_name,
                    supervisor_contact: form_4.supervisor_contact,
                    start_date: form_4.start_date,
                    end_date: form_4.end_date,
                    daily_schedule: form_4.daily_schedule,
                },
            };

            const response = await fetch('http://localhost:5000/api/forms/apply/spes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(submission_payload),
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            set_submit_state('success');
            set_submit_message('SPES application submitted successfully. You can track status in My Submissions.');
            localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {
            set_submit_state('error');
            set_submit_message('Unable to submit right now. Please review your details and try again.');
        }
    };

    return (
        <div className="w-full bg-[radial-gradient(circle_at_top_left,_#dbeafe,_#f8fafc_45%,_#e2e8f0)] p-3 sm:p-4 md:p-6 rounded-2xl">
            <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-slate-200">
                {from_requirements && (
                    <button
                        type="button"
                        onClick={() => navigate('/beneficiary/requirements?program=SPES')}
                        className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Requirements
                    </button>
                )}
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">SPES Official Forms</h1>
                    <p className="text-slate-600 mt-1 text-sm">Complete SPES Form 2, Form 2A, and Form 4 below.</p>
                </header>

                <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Completion Progress</span>
                        <span className="text-xs font-bold text-slate-800">{completion_count}/3 forms</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-2.5 rounded-full bg-slate-900 transition-all duration-300" style={{ width: `${completion_pct}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Draft is auto-saved while you type.</p>
                </div>

                {submit_message && (
                    <div
                        className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium border ${
                            submit_state === 'error'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : submit_state === 'success'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                    >
                        {submit_message}
                    </div>
                )}

                <div className="flex gap-1 rounded-xl bg-slate-100 p-1 mb-6 w-full sm:w-auto sm:inline-flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => set_active_form(tab.key)}
                            className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                                active_form === tab.key ? tab_styles.active : tab_styles.idle
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {active_form === 'form2' && (
                    <form className="space-y-6" onSubmit={submit_form_2}>
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Form 2: Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className={label_style}>First Name *</label>
                                    <input required value={form_2.first_name} onChange={(e) => set_form_2((prev) => ({ ...prev, first_name: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Middle Name</label>
                                    <input value={form_2.middle_name} onChange={(e) => set_form_2((prev) => ({ ...prev, middle_name: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Last Name *</label>
                                    <input required value={form_2.last_name} onChange={(e) => set_form_2((prev) => ({ ...prev, last_name: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Birth Date *</label>
                                    <input type="date" required value={form_2.birth_date} onChange={(e) => set_form_2((prev) => ({ ...prev, birth_date: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Place of Birth *</label>
                                    <input required value={form_2.place_of_birth} onChange={(e) => set_form_2((prev) => ({ ...prev, place_of_birth: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Sex *</label>
                                    <select required value={form_2.sex} onChange={(e) => set_form_2((prev) => ({ ...prev, sex: e.target.value }))} className={input_style}>
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={label_style}>Civil Status *</label>
                                    <select required value={form_2.civil_status} onChange={(e) => set_form_2((prev) => ({ ...prev, civil_status: e.target.value }))} className={input_style}>
                                        <option value="">Select...</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={label_style}>Contact Number *</label>
                                    <input required value={form_2.contact_number} onChange={(e) => set_form_2((prev) => ({ ...prev, contact_number: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Email Address</label>
                                    <input type="email" value={form_2.email_address} onChange={(e) => set_form_2((prev) => ({ ...prev, email_address: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Citizenship</label>
                                    <input value={form_2.citizenship} onChange={(e) => set_form_2((prev) => ({ ...prev, citizenship: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Social Media</label>
                                    <input value={form_2.social_media} onChange={(e) => set_form_2((prev) => ({ ...prev, social_media: e.target.value }))} className={input_style} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Present Address *</label>
                                    <input required value={form_2.present_address} onChange={(e) => set_form_2((prev) => ({ ...prev, present_address: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Permanent Address *</label>
                                    <input required value={form_2.permanent_address} onChange={(e) => set_form_2((prev) => ({ ...prev, permanent_address: e.target.value }))} className={input_style} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Type of Student *</label>
                                    <select value={form_2.type_of_student} onChange={(e) => set_form_2((prev) => ({ ...prev, type_of_student: e.target.value }))} className={input_style}>
                                        <option value="Student">Student</option>
                                        <option value="ALS student">ALS student</option>
                                        <option value="out-of-school (OSY)">Out-of-School (OSY)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={label_style}>Parent Status *</label>
                                    <select value={form_2.parent_status} onChange={(e) => set_form_2((prev) => ({ ...prev, parent_status: e.target.value }))} className={input_style}>
                                        <option value="Living together">Living together</option>
                                        <option value="Solo Parent">Solo Parent</option>
                                        <option value="Separated">Separated</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={label_style}>Education Level *</label>
                                    <select value={form_2.education_level} onChange={(e) => set_form_2((prev) => ({ ...prev, education_level: e.target.value }))} className={input_style}>
                                        <option value="Elementary">Elementary</option>
                                        <option value="Secondary">Secondary</option>
                                        <option value="Tertiary">Tertiary</option>
                                        <option value="Tech-Voc">Tech-Voc</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>School Name *</label>
                                    <input required value={form_2.school_name} onChange={(e) => set_form_2((prev) => ({ ...prev, school_name: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Course/Track *</label>
                                    <input required value={form_2.course_or_track} onChange={(e) => set_form_2((prev) => ({ ...prev, course_or_track: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Year Level *</label>
                                    <input required value={form_2.year_level} onChange={(e) => set_form_2((prev) => ({ ...prev, year_level: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                        </section>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white tracking-wide transition-all hover:bg-black active:scale-[0.99]">
                                Save and Continue to Form 2A
                            </button>
                        </div>
                    </form>
                )}

                {active_form === 'form2a' && (
                    <form className="space-y-6" onSubmit={submit_form_2a}>
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Form 2A: Family and Income Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={label_style}>Father's Name *</label>
                                    <input required value={form_2a.father_name} onChange={(e) => set_form_2a((prev) => ({ ...prev, father_name: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Father's Occupation</label>
                                    <input value={form_2a.father_occupation} onChange={(e) => set_form_2a((prev) => ({ ...prev, father_occupation: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Mother's Name *</label>
                                    <input required value={form_2a.mother_name} onChange={(e) => set_form_2a((prev) => ({ ...prev, mother_name: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Mother's Occupation</label>
                                    <input value={form_2a.mother_occupation} onChange={(e) => set_form_2a((prev) => ({ ...prev, mother_occupation: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Father's Contact</label>
                                    <input value={form_2a.father_contact} onChange={(e) => set_form_2a((prev) => ({ ...prev, father_contact: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Mother's Contact</label>
                                    <input value={form_2a.mother_contact} onChange={(e) => set_form_2a((prev) => ({ ...prev, mother_contact: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Monthly Family Income *</label>
                                    <input required type="number" min="0" value={form_2a.monthly_family_income} onChange={(e) => set_form_2a((prev) => ({ ...prev, monthly_family_income: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Number of Household Members *</label>
                                    <input required type="number" min="1" value={form_2a.household_members} onChange={(e) => set_form_2a((prev) => ({ ...prev, household_members: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>4Ps Beneficiary *</label>
                                    <select value={form_2a.is_4ps_beneficiary} onChange={(e) => set_form_2a((prev) => ({ ...prev, is_4ps_beneficiary: e.target.value }))} className={input_style}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={label_style}>Has Certificate of Indigency *</label>
                                    <select value={form_2a.indigency_status} onChange={(e) => set_form_2a((prev) => ({ ...prev, indigency_status: e.target.value }))} className={input_style}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white tracking-wide transition-all hover:bg-black active:scale-[0.99]">
                                Save and Continue to Form 4
                            </button>
                        </div>
                    </form>
                )}

                {active_form === 'form4' && (
                    <form className="space-y-6" onSubmit={submit_form_4}>
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Form 4: Work Assignment and Endorsement</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={label_style}>Applicant Name *</label>
                                    <input required value={form_4.applicant_name} onChange={(e) => set_form_4((prev) => ({ ...prev, applicant_name: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Assigned Office/Establishment *</label>
                                    <input required value={form_4.assigned_office} onChange={(e) => set_form_4((prev) => ({ ...prev, assigned_office: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="mt-5">
                                <label className={label_style}>Work Assignment *</label>
                                <input required value={form_4.work_assignment} onChange={(e) => set_form_4((prev) => ({ ...prev, work_assignment: e.target.value }))} className={input_style} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Supervisor Name *</label>
                                    <input required value={form_4.supervisor_name} onChange={(e) => set_form_4((prev) => ({ ...prev, supervisor_name: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Supervisor Contact *</label>
                                    <input required value={form_4.supervisor_contact} onChange={(e) => set_form_4((prev) => ({ ...prev, supervisor_contact: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                                <div>
                                    <label className={label_style}>Start Date *</label>
                                    <input required type="date" value={form_4.start_date} onChange={(e) => set_form_4((prev) => ({ ...prev, start_date: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>End Date *</label>
                                    <input required type="date" value={form_4.end_date} onChange={(e) => set_form_4((prev) => ({ ...prev, end_date: e.target.value }))} className={input_style} />
                                </div>
                                <div>
                                    <label className={label_style}>Daily Schedule *</label>
                                    <input required placeholder="e.g. 8:00 AM - 5:00 PM" value={form_4.daily_schedule} onChange={(e) => set_form_4((prev) => ({ ...prev, daily_schedule: e.target.value }))} className={input_style} />
                                </div>
                            </div>
                        </section>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white tracking-wide transition-all hover:bg-black active:scale-[0.99]">
                                Save SPES Form 4
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 border-t border-slate-200 pt-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Final Submission</p>
                            <p className="text-xs text-slate-500">
                                Complete all three forms before submitting your SPES application.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handle_final_submit}
                            disabled={!can_final_submit || submit_state === 'submitting'}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white tracking-wide transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submit_state === 'submitting' ? 'Submitting...' : 'Submit SPES Application'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpesOfficialForms;
