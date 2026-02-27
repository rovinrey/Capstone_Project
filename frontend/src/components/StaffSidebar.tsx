import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  AlertCircle, 
  Calendar, 
  TrendingUp,
  LogOut 
} from 'lucide-react';
import { logout as clearAuth } from '../utils/auth';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function StaffSidebar() {

    const staffMenuItems = [
        { name: "Dashboard", path: "/staff", icon: <LayoutDashboard size={18} /> },
        { name: "Beneficiaries", path: "/beneficiary-management", icon: <Users size={18} /> },
        { name: "Attendance", path: "/attendance", icon: <Calendar size={18} /> },
        { name: "Issues", path: "/issues", icon: <AlertCircle size={18} /> },
        { name: "Performance", path: "/performance", icon: <TrendingUp size={18} /> },
    ];

    const navigate = useNavigate();

    const logout = async () => {
        clearAuth();
        try {
            await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        } catch {
            // ignore
        }
        navigate('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40 overflow-y-auto">
            {/* Logo Section */}
            <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-black tracking-tighter text-blue-600 leading-tight">
                    DOLE <span className="text-gray-800 font-light text-lg block">Staff Portal</span>
                </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-6 px-4 space-y-2">
                {staffMenuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                            ${isActive 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-semibold tracking-wide">
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-100">
                <button 
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </aside>
    );
}

export default StaffSidebar;
