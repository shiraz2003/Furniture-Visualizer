import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { DesignProvider } from './context/DesignContext';

import Login from './pages/login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RoomSetup from './pages/RoomSetup.jsx';
import Editor2D from './pages/Editor2D.jsx';
import Viewer3D from './pages/Viewer3D.jsx';
import AdminLayout from './admin/adminlayout.jsx';
import AdminDashboard from './admin/dashboard.jsx';
import Users from './admin/users';
import Items from './admin/items.jsx';
import Requests from './admin/requests.jsx';
import AdminReviews from './admin/reviews.jsx';
import DesignWorkspace from './admin/design.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Registration from './pages/registrationPage.jsx';
import ForgotPassword from './pages/forgottenpassword.jsx';
import Profile from './pages/profile.jsx';
import CartPage from './pages/cart.jsx';
import Furniture from './pages/furniture.jsx';
import FurnitureOverviewPage from './pages/furnitureoverviewpage.jsx';
import SavedDesigns from './pages/SavedDesigns.jsx'; // <-- Add this import
import Reviews from './pages/ReviewPage.jsx'; // <-- Add this import

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID }>
      <DesignProvider>
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
            <Route path="requests" element={<Requests />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="design" element={<DesignWorkspace />} />

          </Route>

          {/* User Section */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/room-setup" element={
              <RoomSetup />
          
          } />
          <Route path="/editor-2d" element={
            
              <Editor2D />
            
          } />
          <Route path="/viewer-3d" element={
            <Viewer3D />
          } />
          <Route path="/saved-designs" element={
            <SavedDesigns /> 
          } />
          <Route path="/reviews" element={
            <Reviews />
          } />
          <Route path="/profile" element={
            <Profile />
          } />
          <Route path="/cart" element={
            <CartPage />
          } />
          <Route path="/furniture" element={
            <Furniture />
          } />
          <Route path="/furniture/:furnitureId" element={
            <FurnitureOverviewPage />
          } />
          <Route path="/register" element={<Registration />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
        </Routes>
        <Toaster position="top-right" />
      </DesignProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
