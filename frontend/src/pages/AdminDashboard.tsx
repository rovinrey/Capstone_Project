import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/Card";

function AdminDashboard() {
    const [stats, setStats] = useState({
        total_beneficiaries: 0, // Mock data for now
        active_programs: 0,
        total_distributed: 0,
        employment_rate: 0
    });

    const [recentApps, setRecentApps] = useState([  
        { id: 1, name: "Juan Dela Cruz", program: "TUPAD", status: "Pending", date: "2026-01-14" },
        { id: 2, name: "Maria Clara", program: "SPES", status: "Approved", date: "2026-01-13" },
        { id: 3, name: "Jose Rizal", program: "DILP", status: "Under Review", date: "2026-01-12" },
    ]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Stays on the left */}

            <main className="flex-1 p-8">
                {/* Header section */}
                <div className="mb-8">
                    <h1 className=" font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-900">System overview and application monitoring</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Beneficiaries" value={stats.total_beneficiaries.toLocaleString()} trend="+12" trendLabel="this week" />
                    <StatCard title="Active Programs" value={stats.active_programs.toString()} trend="Active" trendLabel="Programs" />
                    <StatCard title="Total Distributed" value={`₱${stats.total_distributed.toLocaleString()}`} trend="+5.4%" trendLabel="vs last month" />
                    <StatCard title="Employment Rate" value={`${stats.employment_rate}%`} trend="+2%" trendLabel="growth" />
                </div>

                {/* Recent Applications Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Applicant Name</th>
                                    <th className="px-6 py-4">Program</th>
                                    <th className="px-6 py-4">Date Applied</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-semibold">
                                                {app.program}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{app.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition">
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;