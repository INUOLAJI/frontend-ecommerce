// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/create-admin-account-77" element={<AdminSignup />} />
        <Route path="/checkout" element={<CheckoutPage />} />

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