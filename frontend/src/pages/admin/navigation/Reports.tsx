import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Calendar, FileSpreadsheet, Printer, Users, UserCheck, CircleAlert } from "lucide-react";

type ApplicantSummary = {
    male: number;
    female: number;
    total: number;
};

type BeneficiaryProfileRow = {
    application_id: number;
    user_id: number;
    full_name: string;
    address: string;
    birth_date: string | null;
    gender: string | null;
};

type PayrollRow = {
    user_id: number;
    full_name: string;
    days_worked: number;
    daily_wage: number;
    total_payout: number;
};

type ReportResponse = {
    period: {
        month: string;
        startDate: string;
        endDate: string;
    };
    sprs: {
        applicantsRegistered: ApplicantSummary;
        placementsAssisted: number;
    };
    beneficiaryProfile: BeneficiaryProfileRow[];
    attendancePayrollSummary: PayrollRow[];
    totals: {
        days_worked: number;
        total_payout: number;
    };
    dailyWage: number;
};

const formatPeso = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    }).format(amount || 0);

const formatDate = (value: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit"
    });
};

const toMonthInputDefault = () => new Date().toISOString().slice(0, 7);

const buildCsv = (rows: (string | number)[][]) => {
    return rows
        .map((row) =>
            row
                .map((cell) => {
                    const escaped = String(cell ?? "").replace(/"/g, '""');
                    return `"${escaped}"`;
                })
                .join(",")
        )
        .join("\n");
};

const downloadCsv = (fileName: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

const Reports = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");

    const [month, setMonth] = useState<string>(toMonthInputDefault());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<ReportResponse | null>(null);

    const fetchReport = async (selectedMonth: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ReportResponse>(
                `${API_BASE_URL}/api/forms/reports/tupad-monthly`,
                {
                    params: { month: selectedMonth },
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined
                }
            );
            setReport(response.data);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load monthly report.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport(month);
    }, [month]);

    const reportLabel = useMemo(() => {
        if (!report?.period?.month) return month;
        const [year, monthPart] = report.period.month.split("-");
        const date = new Date(Number(year), Number(monthPart) - 1, 1);
        return date.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
    }, [report, month]);

    const exportAnnexD = () => {
        if (!report) return;
        const rows: (string | number)[][] = [
            ["TUPAD Beneficiary Profile (Annex D)", reportLabel],
            [],
            ["Full Name", "Address", "Birthdate", "Gender"]
        ];

        report.beneficiaryProfile.forEach((row) => {
            rows.push([
                row.full_name || "N/A",
                row.address || "N/A",
                formatDate(row.birth_date),
                row.gender || "N/A"
            ]);
        });

        downloadCsv(`annex_d_${report.period.month}.csv`, buildCsv(rows));
    };

    const printReport = () => {
        window.print();
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 print:space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-5 md:p-6 print:hidden">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Monthly Compliance Report
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                            PESO Juban TUPAD Reporting
                        </h1>
                        <p className="text-sm text-slate-600 md:text-base">
                            Clean monthly view of SPRS, Annex D beneficiary profile, and attendance payroll summary for DOLE submission.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                            <Calendar size={16} className="text-slate-500" />
                            <span className="text-slate-500">Period</span>
                            <input
                                type="month"
                                value={month}
                                onChange={(event) => setMonth(event.target.value)}
                                className="bg-transparent font-semibold text-slate-800 outline-none"
                            />
                        </label>

                        <button
                            onClick={exportAnnexD}
                            disabled={!report || loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FileSpreadsheet size={16} />
                            Annex D
                        </button>

                        <button
                            onClick={printReport}
                            disabled={!report || loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Printer size={16} />
                            Print / PDF
                        </button>
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                    <div className="mb-5 h-6 w-56 animate-pulse rounded bg-slate-200" />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                    </div>
                    <p className="mt-5 text-sm text-slate-500">Loading report data...</p>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                    <div className="flex items-start gap-3">
                        <CircleAlert size={18} className="mt-0.5" />
                        <div>
                            <p className="font-semibold">Unable to load report</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            ) : !report ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No report data available.</div>
            ) : (
                <>
                    <section className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">SPRS Summary</h2>
                                <p className="text-sm text-slate-500">Reporting period: {reportLabel}</p>
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Statistical Performance Reporting System</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <MetricCard icon={<Users size={16} />} tone="blue" label="Applicants Registered (Male)" value={report.sprs.applicantsRegistered.male} />
                            <MetricCard icon={<Users size={16} />} tone="violet" label="Applicants Registered (Female)" value={report.sprs.applicantsRegistered.female} />
                            <MetricCard icon={<Users size={16} />} tone="slate" label="Applicants Registered (Total)" value={report.sprs.applicantsRegistered.total} />
                            <MetricCard icon={<UserCheck size={16} />} tone="emerald" label="Placements / Assisted" value={report.sprs.placementsAssisted} />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">TUPAD Beneficiary Profile (Annex D)</h2>
                                <p className="text-sm text-slate-500">Current approved batch for TUPAD.</p>
                            </div>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                                {report.beneficiaryProfile.length} beneficiaries
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full min-w-[680px] text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Address</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Birthdate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {report.beneficiaryProfile.map((row) => (
                                        <tr key={`${row.application_id}-${row.user_id}`} className="hover:bg-slate-50/70">
                                            <td className="px-4 py-3 font-medium text-slate-800">{row.full_name || "N/A"}</td>
                                            <td className="px-4 py-3 text-slate-700">{row.address || "N/A"}</td>
                                            <td className="px-4 py-3 text-slate-700">{formatDate(row.birth_date)}</td>
                                        </tr>
                                    ))}
                                    {report.beneficiaryProfile.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                                No approved TUPAD beneficiaries for this period.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </>
            )}
        </div>
    );
};

type MetricCardProps = {
    icon: React.ReactNode;
    tone: "blue" | "violet" | "slate" | "emerald";
    label: string;
    value: number;
};

const MetricCard = ({ icon, tone, label, value }: MetricCardProps) => {
    const tones = {
        blue: "border-blue-200 bg-blue-50 text-blue-700",
        violet: "border-violet-200 bg-violet-50 text-violet-700",
        slate: "border-slate-200 bg-slate-50 text-slate-700",
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-700"
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${tones[tone]}`}>
                    {icon}
                </span>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{value}</p>
        </div>
    );
};

export default Reports;