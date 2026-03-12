import { useState, useEffect } from "react";
import axios from "axios";

interface Application {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    program_type: string;
    contact_number: string;
    occupation: string;
    monthly_income: number;
    status: string;
    applied_at: string;
}

function Applications() {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("All");

    useEffect(() => {
        fetchAllApplications();
    }, []);

    const fetchAllApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5000/api/forms/all");
            setApps(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredApps = filter === "All" ? apps : apps.filter(app => app.program_type === filter);

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">All Applications</h1>
            <div className="mb-4 flex gap-2">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded">
                    <option value="All">All Programs</option>
                    <option value="TUPAD">TUPAD</option>
                    <option value="SPES">SPES</option>
                    <option value="DILP">DILP</option>
                </select>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">Error: {error}</div>
            ) : (
                <table className="w-full text-left border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Applicant Name</th>
                            <th className="px-4 py-2">Program</th>
                            <th className="px-4 py-2">Contact</th>
                            <th className="px-4 py-2">Occupation</th>
                            <th className="px-4 py-2">Date Applied</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.map(app => (
                            <tr key={app.id}>
                                <td className="px-4 py-2">{app.first_name} {app.middle_name ? app.middle_name + ' ' : ''}{app.last_name}</td>
                                <td className="px-4 py-2">{app.program_type}</td>
                                <td className="px-4 py-2">{app.contact_number}</td>
                                <td className="px-4 py-2">{app.occupation || '-'}</td>
                                <td className="px-4 py-2">{new Date(app.applied_at).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{app.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Applications;
