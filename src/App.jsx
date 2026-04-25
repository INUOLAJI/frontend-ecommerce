// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout'; // Store it in a components folder
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminSettings from './pages/AdminSettings';
import AdminSecurity from './pages/AdminSecurity';
import AdminNotifications from './pages/AdminNotifications';
import AdminBilling from './pages/AdminBilling';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Pages (No Sidebar) --- */}
        {/* <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} /> */}

        {/* --- Admin Pages (Wrapped in Layout) --- */}
        <Route 
          path="/" 
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } 
        />
        
        <Route 
          path="/admin/products" 
          element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          } 
        />

        <Route 
  path="/admin/orders" 
  element={
    <AdminLayout>
      <AdminOrders />
    </AdminLayout>
  } 
/>

<Route 
  path="/admin/customers" 
  element={
    <AdminLayout>
      <AdminCustomers />
    </AdminLayout>
  } 
/>

<Route 
  path="/admin/settings" 
  element={
    <AdminLayout>
      <AdminSettings />
    </AdminLayout>
  } 
/>

<Route 
  path="/admin/security" 
  element={
    <AdminLayout>
      <AdminSecurity />
    </AdminLayout>
  } 
/>

<Route 
  path="/admin/notifications" 
  element={
    <AdminLayout>
      <AdminNotifications />
    </AdminLayout>
  } 
/>

<Route 
  path="/admin/billing" 
  element={
    <AdminLayout>
      <AdminBilling />
    </AdminLayout>
  } 
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;