import { useState } from "react";
import { 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download,
  ArrowRight,
  Plus
} from "lucide-react";

const PaymentPage = () => {
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Disbursement Logs</h1>
                    <p className="text-sm text-gray-500 tracking-tight">Managing GCash transfers and on-site Cash payouts.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                        History
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                        <Plus size={18} />
                        New Payroll
                    </button>
                </div>
            </div>

            {/* Payment Mode Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GCash Stats */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg shadow-blue-100 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Smartphone size={24} />
                        </div>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded uppercase">Digital Payout</span>
                    </div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Total GCash Released</p>
                    <h3 className="text-3xl font-black mt-1">₱1,275,000</h3>
                </div>

                {/* Cash Stats */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <Banknote size={24} />
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase">On-site Payout</span>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Cash Disbursed</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1">₱450,000</h3>
                </div>
            </div>

            {/* Payroll Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                                <th className="px-8 py-5">Payroll Batch</th>
                                <th className="px-6 py-5">Mode</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Ref / Source</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {batches.map((batch) => (
                                <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{batch.program}</span>
                                            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{batch.id} • {batch.recipients} pax</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`flex items-center gap-2 text-xs font-bold ${batch.mode === 'GCash' ? 'text-blue-600' : 'text-emerald-600'}`}>
                                            {batch.mode === 'GCash' ? <Smartphone size={14} /> : <Banknote size={14} />}
                                            {batch.mode}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-black text-gray-900 text-sm">
                                        ₱{batch.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            {batch.status === 'Released' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Clock size={14} className="text-yellow-500" />}
                                            <span className="text-xs font-bold text-gray-700">{batch.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold uppercase">{batch.ref}</code>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-all">
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;