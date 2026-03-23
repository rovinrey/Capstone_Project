import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import BeneficiaryDashboard from './pages/beneficiary/BeneficiaryDashboard';
import BeneficiaryApplication from './pages/beneficiary/BeneficiaryApplication';
import BeneficiaryAttendance from './pages/beneficiary/BeneficiaryAttendance';
import BeneficiaryPayment from './pages/beneficiary/BeneficiaryPayment';
import ProtectedRoute from './components/ProtectedRoute';

import Sidebar from "./components/Sidebar"; // Check your actual path here
import BeneficiarySidebar from "./components/BeneficiarySidebar";


import AdminDashboard from './pages/admin/navigation/AdminDashboard';
import Beneficiaries from './pages/admin/navigation/Beneficiary';
import Programs from './pages/admin/navigation/Programs';
import Payment from './pages/admin/navigation/Payment'
import Reports from './pages/admin/navigation/Reports';
import ApplicationApproval from './pages/admin/navigation/ApplicationApproval';

import StaffDashboard from './pages/staff/StaffDashboard';

// 1. Create an Admin Layout so the Sidebar is persistent
// 1. Create an Admin Layout with a FIXED Sidebar
const AdminLayout = () => (
  <div className="flex bg-gray-50 h-screen overflow-hidden">
    {/* Sidebar wrapper to ensure it takes full height and doesn't shrink */}
    <div className="w-64 h-full flex-shrink-0 border-r bg-white">
      <Sidebar />
    </div>

    {/* Main content area that scrolls independently */}
    <main className="flex-1 overflow-y-auto p-8">
      <Outlet />
    </main>
  </div>
);

// Do the same for StaffLayout
const StaffLayout = () => (
  <div className="flex bg-gray-50 h-screen overflow-hidden">
    <div className="w-64 h-full flex-shrink-0 border-r bg-white">
      <Sidebar />
    </div>
    <main className="flex-1 overflow-y-auto p-8">
      <Outlet />
    </main>
  </div>
);

// Beneficiary Layout
const BeneficiaryLayout = () => {
  const [isOpen, setIsOpen] = useState(false); // Default closed on mobile

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 flex items-center p-4 bg-white border-b border-gray-200 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold text-blue-600">Beneficiary Portal</h1>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className="lg:flex lg:flex-row">
        <div className="lg:w-64 lg:flex-shrink-0">
          <BeneficiarySidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Main content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Admin Protected Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* All these paths will now show the Sidebar */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/applications" element={<ApplicationApproval />} />

          {/* Redirect /admin to /dashboard */}
          <Route path="/admin" element={<Navigate to="/dashboard" />} />

        </Route>

        {/* Staff Protected Routes with Sidebar - reuse Admin UI */}
        <Route
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payment" element={<Payment />} />
        </Route>


        {/* Beneficiary Protected Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute allowedRole="beneficiary">
              <BeneficiaryLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/beneficiary" element={<BeneficiaryDashboard />} />
          <Route path="/beneficiary/application" element={<BeneficiaryApplication />} />
          <Route path="/beneficiary/attendance" element={<BeneficiaryAttendance />} />
          <Route path="/beneficiary/payment" element={<BeneficiaryPayment />} />
        </Route>



        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;