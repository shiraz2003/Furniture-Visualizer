import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RoomSetup from './pages/RoomSetup.jsx';
import Editor2D from './pages/Editor2D.jsx';
import Viewer3D from './pages/Viewer3D.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room-setup" element={<RoomSetup />} />
        <Route path="/editor-2d" element={<Editor2D />} />
        <Route path="/viewer-3d" element={<Viewer3D />} />
      </Routes>
    </>
  );
}

export default App;
