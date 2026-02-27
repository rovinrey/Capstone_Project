import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import BeneficiaryDashboard from './pages/beneficiary/BeneficiaryDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import Sidebar from "./components/Sidebar"; // Check your actual path here
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


        {/* Beneficiary Protected Route (No Admin Sidebar) */}
        <Route
          path="/beneficiary"
          element={
            <ProtectedRoute allowedRole="beneficiary">
              <BeneficiaryDashboard />
            </ProtectedRoute>
          }
        />



        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;