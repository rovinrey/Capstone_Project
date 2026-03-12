import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Calendar
} from "lucide-react";

const Reports = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Statistical Reports</h1>
                    <p className="text-gray-500 text-sm">Real-time data visualization of program performance.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all shadow-sm">
                        <Calendar size={18} />
                        Select Period
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm transition-all shadow-lg shadow-blue-100">
                        <Download size={18} />
                        Export PDF/Excel
                    </button>
                </div>
            </div>

            {/* Performance Overview Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ReportCard title="Disbursement Rate" value="92.4%" trend="+4.2%" positive={true} description="of allocated 2026 budget" />
                <ReportCard title="Active Programs" value="1" trend={undefined} positive={undefined} description="Number of active programs" />
                <ReportCard title="Success Rate" value="88.1%" trend="+1.5%" positive={true} description="Beneficiaries completed programs" />
                <ReportCard title="Avg. Payout Time" value="14 Days" trend="-2 Days" positive={true} description="from approval to release" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart Placeholder - Left 2/3 */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 size={18} className="text-blue-500" />
                            Monthly Beneficiary Growth
                        </h3>
                        <select className="text-xs font-semibold bg-gray-50 border-none rounded-lg p-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    {/* Simulated Chart Area */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[45, 60, 85, 70, 95, 110].map((height, i) => (
                            <div key={i} className="w-full group relative">
                                <div 
                                    className="bg-blue-500 group-hover:bg-blue-600 rounded-t-lg transition-all duration-500 cursor-pointer" 
                                    style={{ height: `${height}%` }}
                                >
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {height * 10} Beneficiaries
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 text-center font-bold">MON {i+1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Program Split - Right 1/3 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <PieChart size={18} className="text-purple-500" />
                        Program Distribution
                    </h3>
                    <div className="space-y-4 mt-10">
                        <DistributionItem label="TUPAD" value="65%" color="bg-blue-500" />
                        <DistributionItem label="Pangkabuhayan" value="25%" color="bg-purple-500" />
                        <DistributionItem label="SPES" value="10%" color="bg-orange-500" />
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50">
                        <p className="text-xs text-gray-400 leading-relaxed italic">
                            * TUPAD remains the highest contributor to beneficiary engagement in the current quarter.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const ReportCard = ({ title, value, trend, positive, description }) => (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-gray-900">{value}</h2>
            <span className={`flex items-center text-xs font-bold ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
                {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trend}
            </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-wider font-bold">{description}</p>
    </div>
);

const DistributionItem = ({ label, value, color }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-600">{label}</span>
            <span className="text-gray-900">{value}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full">
            <div className={`${color} h-full rounded-full`} style={{ width: value }} />
        </div>
    </div>
);

export default Reports;