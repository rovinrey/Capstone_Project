import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BeneficiaryApplication() {
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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Application</h1>
            <p>Welcome to the Application page. Here you can manage your applications.</p>
            {user && (
                <div className="mt-4">
                    <p>User: {user.user_name}</p>
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default BeneficiaryApplication;