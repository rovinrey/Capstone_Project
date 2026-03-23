import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BeneficiaryAttendance() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const user_name = localStorage.getItem('user_name');
            const role = localStorage.getItem('role');

            if (!token || role !== 'beneficiary') {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/auth/getProfile?user_name=${user_name}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (err) {
                setError('Failed to load user data');
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <section className="w-full max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Attendance</h1>
                <p className="text-sm sm:text-base text-gray-600">Welcome to the Attendance page. Here you can view your attendance records.</p>
                {user && (
                    <div className="mt-5 rounded-lg bg-gray-50 border border-gray-200 p-4">
                        <p className="text-sm text-gray-700">User: <span className="font-semibold">{user.user_name}</span></p>
                    </div>
                )}
                {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </div>
        </section>
    );
}

export default BeneficiaryAttendance;