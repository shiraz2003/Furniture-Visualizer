import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RoomSetup from './pages/RoomSetup.jsx';
import Editor2D from './pages/Editor2D.jsx';
import Viewer3D from './pages/Viewer3D.jsx';
import AdminLayout from './admin/adminlayout.jsx';
import AdminDashboard from './admin/dashboard.jsx';
import Users from './admin/users';
import Items from './admin/items.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Registration from './pages/registrationPage.jsx';
import ForgotPassword from './pages/forgottenpassword.jsx';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id"}>
      
      <Routes>
        {/* Admin Section - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="items" element={<Items />} />
        </Route>

        {/* User Section - Protected */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/room-setup" element={
          <ProtectedRoute>
            <RoomSetup />
          </ProtectedRoute>
        } />
        <Route path="/editor-2d" element={
          <ProtectedRoute>
            <Editor2D />
          </ProtectedRoute>
        } />
        <Route path="/viewer-3d" element={
          <ProtectedRoute>
            <Viewer3D />
          </ProtectedRoute>
        } />
        <Route path="/register" element={<Registration />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
  );
}

export default App;
