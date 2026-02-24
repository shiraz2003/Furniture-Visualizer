import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RoomSetup from './pages/RoomSetup.jsx';
import Editor2D from './pages/Editor2D.jsx';
import Viewer3D from './pages/Viewer3D.jsx';

import Registration from './pages/registrationPage.jsx';
import ForgotPassword from './pages/forgottenpassword.jsx';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id"}>
      
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room-setup" element={<RoomSetup />} />
        <Route path="/editor-2d" element={<Editor2D />} />
        <Route path="/viewer-3d" element={<Viewer3D />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
  );
}

export default App;
