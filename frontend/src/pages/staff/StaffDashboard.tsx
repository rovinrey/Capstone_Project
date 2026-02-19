import React from 'react';
import { LayoutDashboard, Users, ClipboardList } from 'lucide-react';
import StatCard from '../../components/Card';

export default function StaffDashboard() {
    const stats = {
        tasks_pending: 0,
        reviews_today: 0,
        escalations: 0,
        resolved: 0,
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-gray-500">Worklist and reviews for staff users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Tasks Pending" value={stats.tasks_pending.toString()} trend="+0" trendLabel="today" />
                <StatCard title="Reviews Today" value={stats.reviews_today.toString()} trend="+0" trendLabel="today" />
                <StatCard title="Escalations" value={stats.escalations.toString()} trend="-" trendLabel="open" />
                <StatCard title="Resolved" value={stats.resolved.toString()} trend="+0" trendLabel="today" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Open Worklist</button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md">Completed Reviews</button>
                </div>
            </div>
        </div>
    );
}
