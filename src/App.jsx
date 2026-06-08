import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminSettings from './pages/AdminSettings';
import AdminSecurity from './pages/AdminSecurity';
import AdminNotifications from './pages/AdminNotifications';
import AdminBilling from './pages/AdminBilling';
import CustomerHome from './pages/CustomerHome';
import CartPage from './pages/CartPage';
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import CheckoutPage from './pages/CheckoutPage';

// --- PROTECTED ROUTE FOR ADMIN ---
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/admin-login" replace />;

  return children;
};

// --- CUSTOMER THEME WRAPPER ---
// This isolates dark/light mode state and styling strictly to the customer routes
const CustomerThemeLayout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('customerDarkMode');
    return saved ? JSON.parse(saved) : true; // Defaulting to true (dark mode)
  });

  useEffect(() => {
    localStorage.setItem('customerDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div 
      data-bs-theme={darkMode ? 'dark' : 'light'} 
      className={darkMode ? 'bg-dark text-white min-vh-100' : 'bg-light text-dark min-vh-100'}
      style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
    >
      {/* We use React Router's context prop to pass down the state variables.
        Your Customer components can access them cleanly!
      */}
      <Outlet context={{ darkMode, setDarkMode }} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Isolated Customer Pages (Handles Theme Controls) */}
        <Route element={<CustomerThemeLayout />}>
          <Route path="/" element={<CustomerHome />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Public Admin Authentications (Independent Layout Styles) */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/create-admin-account-77" element={<AdminSignup />} />

        {/* Redirect /admin → /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected Admin Pages */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute><AdminLayout><AdminCustomers /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/security" element={<ProtectedRoute><AdminLayout><AdminSecurity /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute><AdminLayout><AdminNotifications /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/billing" element={<ProtectedRoute><AdminLayout><AdminBilling /></AdminLayout></ProtectedRoute>} />

        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;