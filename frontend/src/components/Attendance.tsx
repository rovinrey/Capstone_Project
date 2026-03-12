import { useEffect, useState } from "react";
import axios from "axios";

interface AttendanceRecord {
    date: string;
    status: string;
    remarks?: string;
}

const Attendance = () => {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(response.data);
        } catch (err: any) {
            setError('Failed to load attendance records.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Attendance Records</h2>
            {loading ? (
                <div>Loading attendance...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : attendance.length === 0 ? (
                <div className="text-gray-500">No attendance records found.</div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {attendance.map((record, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{record.status}</td>
                                <td className="px-6 py-4">{record.remarks || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Attendance;
