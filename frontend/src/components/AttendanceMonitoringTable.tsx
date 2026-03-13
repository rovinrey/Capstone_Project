import { useState, useEffect } from "react";
import axios from "axios";

interface AttendanceRecord {
    id: number;
    programId: string;
    date: string;
    timeIn: string;
    timeOut: string;
    description: string;
}

const AttendanceMonitoringTable = () => {
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data for demonstration - replace with actual API call
    const mockData: AttendanceRecord[] = [
        { id: 1, programId: "TUPAD-001", date: "2024-03-13", timeIn: "08:00", timeOut: "17:00", description: "Regular attendance" },
        { id: 2, programId: "SPES-002", date: "2024-03-13", timeIn: "09:00", timeOut: "16:00", description: "Late arrival" },
        { id: 3, programId: "DILP-003", date: "2024-03-12", timeIn: "08:30", timeOut: "17:30", description: "Overtime work" },
        { id: 4, programId: "TUPAD-001", date: "2024-03-12", timeIn: "08:00", timeOut: "12:00", description: "Half day" },
        { id: 5, programId: "SPES-002", date: "2024-03-11", timeIn: "08:15", timeOut: "17:15", description: "On time" },
    ];

    useEffect(() => {
        fetchAttendanceRecords();
    }, []);

    const fetchAttendanceRecords = async () => {
        setLoading(true);
        setError(null);

        try {
            // Replace with actual API endpoint when available
            // const response = await axios.get("http://localhost:5000/api/attendance");
            // setAttendanceRecords(response.data);

            // Using mock data for now
            setTimeout(() => {
                setAttendanceRecords(mockData);
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to load attendance records. Please try again.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid mb-4" />
                    <span className="text-gray-600 text-lg font-semibold">Loading attendance records...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={fetchAttendanceRecords}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Attendance Monitoring</h2>
                <p className="text-sm text-gray-600 mt-1">Track beneficiary attendance across programs</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Program ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time In
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time Out
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {record.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.programId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.timeIn}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.timeOut}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {attendanceRecords.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No attendance records found.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceMonitoringTable;