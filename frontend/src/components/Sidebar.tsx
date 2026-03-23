import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ClipboardList, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import { logout as clearAuth } from '../utils/auth';


function Sidebar() { 

    // menus 
    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} />, exact: true },
        { name: "Beneficiary", path: "/beneficiaries", icon: <Users size={18} />, exact: true },
        { name: "Payment", path: "/payment", icon: <CreditCard size={18} />, exact: true },
        { name: "Programs", path: "/programs", icon: <ClipboardList size={18} />, exact: true },
        { name: "Reports", path: "/reports", icon: <BarChart3 size={18} />, exact: true },
    ];

    const navigate = useNavigate();

    const logout = async () => {
        // clear client-side storage
        clearAuth();

        // optionally hit backend for audit or cookie clearance
        try {
            await fetch('http://localhost:5000/logout', { method: 'POST' });
        } catch {
            // ignore network errors, user is logging out anyway
        }

        navigate('/login');
    }
    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0">
            {/* Logo Section */}
            <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-black tracking-tighter text-blue-600 leading-tight">
                    DOLE <span className="text-gray-800 font-light text-lg block">tupad & pangkabuhayan</span>
                </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-6 px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.exact}
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
                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;