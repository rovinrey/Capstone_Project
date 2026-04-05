import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Banknote,
    Calendar,
    Check,
    CheckCircle2,
    CircleAlert,
    Clock,
    Download,
    Pencil,
    Plus,
    Smartphone,
    Wallet,
    X
} from "lucide-react";

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

const PaymentPage = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");

    const [month, setMonth] = useState<string>(toMonthInputDefault());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<ReportResponse | null>(null);

    const [editingWage, setEditingWage] = useState(false);
    const [wageInput, setWageInput] = useState("");
    const [savingWage, setSavingWage] = useState(false);

    const [batches] = useState([
        { 
            id: "GC-2026-881", 
            program: "TUPAD - Sorsogon City", 
            amount: 850000, 
            recipients: 150, 
            status: "Released", 
            date: "2026-02-08",
            mode: "GCash",
            ref: "G-9921-X"
        },
        { 
            id: "CH-2026-442", 
            program: "Pangkabuhayan - Pilar", 
            amount: 150000, 
            recipients: 10, 
            status: "Scheduled", 
            date: "2026-02-12",
            mode: "Cash",
            ref: "Paymaster-01"
        },
        { 
            id: "GC-2026-902", 
            program: "TUPAD - Casiguran", 
            amount: 425000, 
            recipients: 75, 
            status: "Processing", 
            date: "2026-02-10",
            mode: "GCash",
            ref: "Pending"
        },
    ]);

    const fetchPayroll = async (selectedMonth: string) => {
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
            setError(err?.response?.data?.message || "Failed to load payroll data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayroll(month);
    }, [month]);

    const openWageEditor = () => {
        setWageInput(String(report?.dailyWage || 435));
        setEditingWage(true);
    };

    const saveWage = async () => {
        const parsed = parseFloat(wageInput);
        if (isNaN(parsed) || parsed <= 0) return;
        setSavingWage(true);
        try {
            await axios.put(
                `${API_BASE_URL}/api/forms/settings/daily-wage`,
                { daily_wage: parsed },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            setEditingWage(false);
            fetchPayroll(month);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to update daily wage.");
        } finally {
            setSavingWage(false);
        }
    };

    const reportLabel = useMemo(() => {
        if (!report?.period?.month) return month;
        const [year, monthPart] = report.period.month.split("-");
        const date = new Date(Number(year), Number(monthPart) - 1, 1);
        return date.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
    }, [report, month]);

    const exportPayroll = () => {
        if (!report) return;

        const rows: (string | number)[][] = [
            ["Attendance and Payroll Summary", reportLabel],
            ["Daily Wage", report.dailyWage],
            [],
            ["Beneficiary", "Days Worked", "Daily Wage", "Total Payout"]
        ];

        report.attendancePayrollSummary.forEach((row) => {
            rows.push([row.full_name, row.days_worked, row.daily_wage, row.total_payout]);
        });

        rows.push([]);
        rows.push(["TOTAL", report.totals.days_worked, report.dailyWage, report.totals.total_payout]);

        downloadCsv(`attendance_payroll_${report.period.month}.csv`, buildCsv(rows));
    };

    const batchStats = useMemo(() => {
        const gcashTotal = batches
            .filter((batch) => batch.mode === "GCash")
            .reduce((acc, batch) => acc + batch.amount, 0);
        const cashTotal = batches
            .filter((batch) => batch.mode === "Cash")
            .reduce((acc, batch) => acc + batch.amount, 0);

        return {
            gcashTotal,
            cashTotal,
            totalRecipients: batches.reduce((acc, batch) => acc + batch.recipients, 0)
        };
    }, [batches]);

    const avgDaysWorked = useMemo(() => {
        if (!report?.attendancePayrollSummary?.length) return 0;
        const totalDays = report.attendancePayrollSummary.reduce((acc, row) => acc + row.days_worked, 0);
        return Math.round((totalDays / report.attendancePayrollSummary.length) * 10) / 10;
    }, [report]);

    const statusClass = (status: string) => {
        if (status === "Released") return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status === "Processing") return "bg-amber-50 text-amber-700 border-amber-200";
        return "bg-slate-50 text-slate-700 border-slate-200";
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-5 md:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Payroll Operations
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Payments and Payroll</h1>
                        <p className="text-sm text-slate-600 md:text-base">
                            Review attendance-based payout, export monthly payroll, and monitor disbursement batches in one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700">
                        <Calendar size={14} />
                        <input
                            type="month"
                            value={month}
                            onChange={(event) => setMonth(event.target.value)}
                            className="outline-none"
                        />
                    </label>

                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-all hover:bg-slate-50">
                        History
                    </button>
                    <button
                        onClick={exportPayroll}
                        disabled={!report || loading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Download size={14} />
                        Export Payroll
                    </button>

                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-700 transition-all hover:bg-slate-200">
                        <Plus size={14} />
                        New Payroll
                    </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payroll Total</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPeso(report?.totals?.total_payout || 0)}</p>
                    <p className="mt-1 text-xs text-slate-500">From attendance summary</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Beneficiaries in Payroll</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{report?.attendancePayrollSummary?.length || 0}</p>
                    <p className="mt-1 text-xs text-slate-500">Current selected period</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg. Days Worked</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{avgDaysWorked}</p>
                    <p className="mt-1 text-xs text-slate-500">Per beneficiary</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Coverage Period</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{reportLabel}</p>
                    <p className="mt-1 text-xs text-slate-500">Monthly report window</p>
                </div>
            </section>

            {/* Payroll Summary */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Attendance / Payroll Summary</h2>
                        <p className="text-sm text-slate-500">Period: {reportLabel} | Formula: Days Worked x {formatPeso(report?.dailyWage || 435)}</p>
                    </div>
                    {editingWage ? (
                        <div className="inline-flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-600">₱</span>
                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={wageInput}
                                onChange={(e) => setWageInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") saveWage(); if (e.key === "Escape") setEditingWage(false); }}
                                className="w-28 rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                                autoFocus
                                disabled={savingWage}
                            />
                            <button
                                onClick={saveWage}
                                disabled={savingWage}
                                className="rounded-lg bg-emerald-600 p-1.5 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                title="Save"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setEditingWage(false)}
                                disabled={savingWage}
                                className="rounded-lg bg-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-300"
                                title="Cancel"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={openWageEditor}
                            className="inline-flex w-fit items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100 cursor-pointer"
                            title="Click to edit daily wage"
                        >
                            <Wallet size={14} />
                            Daily Wage: {formatPeso(report?.dailyWage || 435)}
                            <Pencil size={12} className="text-amber-600" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="py-6 text-sm text-slate-500">Loading payroll...</div>
                ) : error ? (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <CircleAlert size={16} className="mt-0.5" />
                        <span>{error}</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full min-w-[760px] text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Beneficiary</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Days Worked</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Daily Wage</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Total Payout</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {report?.attendancePayrollSummary?.map((row) => (
                                    <tr key={row.user_id} className="hover:bg-slate-50/70">
                                        <td className="px-4 py-3 font-medium text-slate-800">{row.full_name}</td>
                                        <td className="px-4 py-3 text-right text-slate-700">{row.days_worked}</td>
                                        <td className="px-4 py-3 text-right text-slate-700">{formatPeso(row.daily_wage)}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatPeso(row.total_payout)}</td>
                                    </tr>
                                ))}
                                {!report?.attendancePayrollSummary?.length && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                            No attendance records found for this period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="border-t border-slate-200 bg-slate-50">
                                <tr>
                                    <td className="px-4 py-3 font-semibold text-slate-900">TOTAL</td>
                                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{report?.totals?.days_worked || 0}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatPeso(report?.dailyWage || 435)}</td>
                                    <td className="px-4 py-3 text-right text-base font-semibold text-slate-900">{formatPeso(report?.totals?.total_payout || 0)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-900">Disbursement Batch Log</h3>
                    <p className="text-xs text-slate-500">Track source, status, and release details per batch.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-100 bg-slate-50">
                            <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                <th className="px-8 py-5">Payroll Batch</th>
                                <th className="px-6 py-5">Mode</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Ref / Source</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {batches.map((batch) => (
                                <tr key={batch.id} className="transition-colors hover:bg-slate-50/70">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{batch.program}</span>
                                            <span className="font-mono text-[10px] tracking-tighter text-slate-400">{batch.id} • {batch.recipients} pax • {batch.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`flex items-center gap-2 text-xs font-bold ${batch.mode === "GCash" ? "text-blue-600" : "text-emerald-600"}`}>
                                            {batch.mode === 'GCash' ? <Smartphone size={14} /> : <Banknote size={14} />}
                                            {batch.mode}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                                        ₱{batch.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(batch.status)}`}>
                                            {batch.status === "Released" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            <span>{batch.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">{batch.ref}</code>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800">
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default PaymentPage;