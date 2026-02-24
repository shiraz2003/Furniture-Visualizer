import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ 
      backgroundColor: '#0f172a', 
      padding: '1rem 2rem',
      borderBottom: '1px solid #334155',
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', marginRight: 'auto' }}>
        🪑 Furniture Visualizer
      </Link>
      <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
      <Link to="/room-setup" style={{ color: '#94a3b8', textDecoration: 'none' }}>Room Setup</Link>
      <Link to="/editor-2d" style={{ color: '#94a3b8', textDecoration: 'none' }}>Editor 2D</Link>
      <Link to="/viewer-3d" style={{ color: '#94a3b8', textDecoration: 'none' }}>Viewer 3D</Link>
    </nav>
  );
}