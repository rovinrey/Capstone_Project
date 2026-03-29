import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Download, X, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

// ─── Types ───────────────────────────────────────────────────
interface Beneficiary {
    beneficiary_id: number;
    user_id: number | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    extension_name: string | null;
    birth_date: string;
    gender: string;
    civil_status: string;
    contact_number: string | null;
    address: string;
    is_active: number;
    application_id: number | null;
    program_type: string | null;
    application_status: string | null;
    approval_date: string | null;
    applied_at: string | null;
}

interface BeneficiaryFormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    extension_name: string;
    birth_date: string;
    gender: string;
    civil_status: string;
    contact_number: string;
    address: string;
    program_type: string;
}

interface BeneficiaryDetails {
    application: Record<string, any>;
    details: {
        tupad: Record<string, any> | null;
        spes: Record<string, any> | null;
        dilp: Record<string, any> | null;
        gip: Record<string, any> | null;
        jobseeker: Record<string, any> | null;
    };
}

const PROGRAM_OPTIONS = [
    { value: "", label: "Select Program" },
    { value: "tupad", label: "TUPAD" },
    { value: "spes", label: "SPES" },
    { value: "dilp", label: "DILP" },
    { value: "gip", label: "GIP" },
    { value: "job_seekers", label: "Job Seekers" },
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const CIVIL_STATUS_OPTIONS = ["Single", "Married", "Widowed", "Separated"];
const ROWS_PER_PAGE = 10;

const emptyForm: BeneficiaryFormData = {
    first_name: "",
    middle_name: "",
    last_name: "",
    extension_name: "",
    birth_date: "",
    gender: "",
    civil_status: "",
    contact_number: "",
    address: "",
    program_type: "",
};

// ─── Component ───────────────────────────────────────────────
const BeneficiaryPage = () => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState("");
    const [programFilter, setProgramFilter] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Add / Edit modal
    const [showFormModal, setShowFormModal] = useState(false);
    const [formData, setFormData] = useState<BeneficiaryFormData>({ ...emptyForm });
    const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
    const [formSaving, setFormSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);
    const [deleting, setDeleting] = useState(false);

    // View details modal
    const [selectedDetails, setSelectedDetails] = useState<BeneficiaryDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ─── Fetch ──────────────────────────────────────────
    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/beneficiaries/admin/all`, {
                headers: getAuthHeaders(),
            });
            setBeneficiaries(Array.isArray(res.data) ? res.data : []);
        } catch (err: any) {
            console.error(err);
            // Fallback to the original endpoint
            try {
                const fallback = await axios.get(`${API_BASE_URL}/api/beneficiaries`);
                const rows = Array.isArray(fallback.data) ? fallback.data : [];
                setBeneficiaries(rows);
            } catch {
                setError("Failed to load beneficiaries. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ─── Filtering & Pagination ─────────────────────────
    const filtered = useMemo(() => {
        let list = beneficiaries;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((b) => {
                const fullName = `${b.first_name || ""} ${b.middle_name || ""} ${b.last_name || ""}`.toLowerCase();
                const contact = (b.contact_number || "").toLowerCase();
                const address = (b.address || "").toLowerCase();
                return fullName.includes(q) || contact.includes(q) || address.includes(q);
            });
        }

        if (programFilter) {
            list = list.filter((b) => b.program_type === programFilter);
        }

        return list;
    }, [beneficiaries, searchQuery, programFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, programFilter]);

    // ─── Form handlers ──────────────────────────────────
    const openAddModal = () => {
        setEditingBeneficiary(null);
        setFormData({ ...emptyForm });
        setFormError(null);
        setShowFormModal(true);
    };

    const openEditModal = (b: Beneficiary) => {
        setEditingBeneficiary(b);
        setFormData({
            first_name: b.first_name || "",
            middle_name: b.middle_name || "",
            last_name: b.last_name || "",
            extension_name: b.extension_name || "",
            birth_date: b.birth_date ? b.birth_date.split("T")[0] : "",
            gender: b.gender || "",
            civil_status: b.civil_status || "",
            contact_number: b.contact_number || "",
            address: b.address || "",
            program_type: b.program_type || "",
        });
        setFormError(null);
        setShowFormModal(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSaving(true);
        setFormError(null);

        try {
            if (editingBeneficiary) {
                // Update
                await axios.put(
                    `${API_BASE_URL}/api/beneficiaries/admin/${editingBeneficiary.beneficiary_id}`,
                    {
                        ...formData,
                        application_id: editingBeneficiary.application_id,
                    },
                    { headers: getAuthHeaders() }
                );
            } else {
                // Create
                await axios.post(
                    `${API_BASE_URL}/api/beneficiaries/admin`,
                    formData,
                    { headers: getAuthHeaders() }
                );
            }

            setShowFormModal(false);
            await fetchBeneficiaries();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save beneficiary.";
            setFormError(msg);
        } finally {
            setFormSaving(false);
        }
    };

    // ─── Delete handler ─────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await axios.delete(
                `${API_BASE_URL}/api/beneficiaries/admin/${deleteTarget.beneficiary_id}`,
                { headers: getAuthHeaders() }
            );
            setDeleteTarget(null);
            await fetchBeneficiaries();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete beneficiary.");
        } finally {
            setDeleting(false);
        }
    };

    // ─── View details handler ───────────────────────────
    const openDetails = async (applicationId: number) => {
        setDetailsLoading(true);
        setDetailsError(null);
        setSelectedDetails(null);

        try {
            const res = await axios.get(`${API_BASE_URL}/api/beneficiaries/${applicationId}/details`);
            setSelectedDetails(res.data);
        } catch {
            setDetailsError("Failed to load beneficiary details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    // ─── Export handler ─────────────────────────────────
    const handleExport = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/beneficiaries`, { responseType: "blob" });
            // If backend returns json (array), build a CSV client-side
            if (res.headers["content-type"]?.includes("json")) {
                const data = Array.isArray(res.data) ? res.data : [];
                if (data.length === 0) return;
                const headers = Object.keys(data[0]);
                const csv = [
                    headers.join(","),
                    ...data.map((row: any) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "beneficiaries.csv";
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch {
            alert("Export failed.");
        }
    };

    // ─── Helpers ────────────────────────────────────────
    const toLabel = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const fullName = (b: Beneficiary) =>
        `${b.first_name || ""} ${b.middle_name || ""} ${b.last_name || ""}${b.extension_name ? " " + b.extension_name : ""}`.replace(/\s+/g, " ").trim() || "N/A";

    const renderObjectSection = (title: string, data: Record<string, any> | null) => {
        if (!data) return null;
        const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== "");
        if (entries.length === 0) return null;
        return (
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">{title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {entries.map(([key, value]) => (
                        <div key={key} className="text-sm">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider">{toLabel(key)}</p>
                            <p className="font-semibold text-gray-800 break-words">{String(value)}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    // ─── Render ─────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Beneficiary Management</h1>
                    <p className="text-sm text-gray-500">Manage and track all registered beneficiaries across programs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm"
                    >
                        <Download size={18} />
                        Export
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 font-medium text-sm"
                    >
                        <Plus size={18} />
                        Add Beneficiary
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, contact, or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All Programs</option>
                        <option value="tupad">TUPAD</option>
                        <option value="spes">SPES</option>
                        <option value="dilp">DILP</option>
                        <option value="gip">GIP</option>
                        <option value="job_seekers">Job Seekers</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading beneficiaries...</div>
                ) : error ? (
                    <div className="p-6 text-red-600 text-center">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="p-6 text-gray-500 text-center">
                        {beneficiaries.length === 0
                            ? "No beneficiaries yet. Click 'Add Beneficiary' to create one."
                            : "No beneficiaries match your search."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Address</th>
                                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Program</th>
                                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Gender</th>
                                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginated.map((b) => (
                                    <tr key={b.beneficiary_id} className="hover:bg-blue-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">{fullName(b)}</span>
                                            {b.birth_date && (
                                                <span className="block text-xs text-gray-400 mt-0.5">
                                                    Born: {new Date(b.birth_date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{b.contact_number || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium max-w-[200px] truncate">{b.address || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600">
                                                {b.program_type ? toLabel(b.program_type) : "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{b.gender || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {b.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {b.application_id && (
                                                    <button
                                                        onClick={() => openDetails(b.application_id!)}
                                                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(b)}
                                                    className="p-2 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(b)}
                                                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>
                        Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length} beneficiaries
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>
                        <span className="px-3 py-1 text-gray-700 font-medium">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ────────── Add / Edit Modal ────────── */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-gray-200 shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">
                                    {editingBeneficiary ? "Edit Beneficiary" : "Add Beneficiary"}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {editingBeneficiary ? "Update beneficiary information" : "Fill in details to register a new beneficiary"}
                                </p>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-5 space-y-5">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>
                            )}

                            {/* Name row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
                                    <input
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Middle Name</label>
                                    <input
                                        name="middle_name"
                                        value={formData.middle_name}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name *</label>
                                    <input
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Extension & Birth date */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Extension (Jr, Sr, III)</label>
                                    <input
                                        name="extension_name"
                                        value={formData.extension_name}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Birth Date *</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
                                    <input
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleFormChange}
                                        placeholder="09xxxxxxxxx"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Gender, Civil Status, Program */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        {GENDER_OPTIONS.map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Civil Status *</label>
                                    <select
                                        name="civil_status"
                                        value={formData.civil_status}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="">Select Status</option>
                                        {CIVIL_STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Program</label>
                                    <select
                                        name="program_type"
                                        value={formData.program_type}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        {PROGRAM_OPTIONS.map((p) => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Address *</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    required
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSaving}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium text-sm shadow-md shadow-blue-100"
                                >
                                    {formSaving ? "Saving..." : editingBeneficiary ? "Update Beneficiary" : "Add Beneficiary"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ────────── Delete Confirmation ────────── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Beneficiary</h3>
                        <p className="text-sm text-gray-600 mb-1">
                            Are you sure you want to delete <span className="font-semibold">{fullName(deleteTarget)}</span>?
                        </p>
                        <p className="text-xs text-red-500 mb-5">
                            This action cannot be undone. All related attendance records will also be removed.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 font-medium text-sm shadow-md shadow-red-100"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ────────── Details Modal ────────── */}
            {(detailsLoading || selectedDetails || detailsError) && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-gray-200 shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Beneficiary Application Details</h3>
                                <p className="text-xs text-gray-500">Complete data submitted by the user</p>
                            </div>
                            <button
                                onClick={() => { setSelectedDetails(null); setDetailsError(null); setDetailsLoading(false); }}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            {detailsLoading && <p className="text-sm text-gray-600">Loading details...</p>}
                            {detailsError && <p className="text-sm text-red-600">{detailsError}</p>}
                            {!detailsLoading && !detailsError && selectedDetails && (
                                <>
                                    {renderObjectSection("Application Information", selectedDetails.application)}
                                    {renderObjectSection("TUPAD Form Data", selectedDetails.details.tupad)}
                                    {renderObjectSection("SPES Form Data", selectedDetails.details.spes)}
                                    {renderObjectSection("DILP Form Data", selectedDetails.details.dilp)}
                                    {renderObjectSection("GIP Form Data", selectedDetails.details.gip)}
                                    {renderObjectSection("Jobseeker Form Data", selectedDetails.details.jobseeker)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeneficiaryPage;