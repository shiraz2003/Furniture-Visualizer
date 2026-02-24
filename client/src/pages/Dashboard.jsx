import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { designService } from '../services/designService.js';
import Navbar from '../components/Navbar.jsx';

export default function Dashboard() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDesignName, setNewDesignName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDesigns();
  }, []);

  async function loadDesigns() {
    try {
      setLoading(true);
      const data = await designService.list();
      setDesigns(data);
    } catch (err) {
      console.error('Failed to load designs', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDesign(e) {
    e.preventDefault();
    if (!newDesignName.trim()) return;
    try {
      const design = await designService.create({
        name: newDesignName,
        room: { width: 800, height: 600, gridSize: 50 },
        items: []
      });
      setDesigns([design, ...designs]);
      setNewDesignName('');
      setShowCreateModal(false);
      navigate(`/editor-2d?id=${design._id}`);
    } catch (err) {
      alert('Failed to create design');
    }
  }

  async function handleDeleteDesign(id) {
    if (!window.confirm('Delete this design?')) return;
    try {
      await designService.remove(id);
      setDesigns(designs.filter(d => d._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  }

  async function handleDuplicateDesign(design) {
    try {
      const copy = await designService.create({
        name: `${design.name} (Copy)`,
        room: design.room,
        items: design.items
      });
      setDesigns([copy, ...designs]);
    } catch (err) {
      alert('Failed to duplicate');
    }
  }

  const filteredDesigns = designs.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentCount = designs.filter(d => {
    const updated = new Date(d.updatedAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return updated > weekAgo;
  }).length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-rose-500 bg-clip-text text-transparent">
              🏠 My Room Designs
            </h1>
            <p className="text-white/60 mt-2">Create, visualize, and perfect your dream spaces</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl px-6 py-4 text-center min-w-[100px]">
              <span className="block text-3xl font-bold text-rose-500">{designs.length}</span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Total</span>
            </div>
            <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl px-6 py-4 text-center min-w-[100px]">
              <span className="block text-3xl font-bold text-rose-500">{recentCount}</span>
              <span className="text-xs text-white/60 uppercase tracking-wider">This Week</span>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">🔍</span>
          <input
            type="text"
            placeholder="Search designs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/10 rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 text-xl transition-all ${viewMode === 'grid' ? 'bg-rose-500 text-white' : 'text-white/60 hover:bg-rose-500/50'}`}
              onClick={() => setViewMode('grid')}
            >
              ▦
            </button>
            <button
              className={`px-4 py-2 text-xl transition-all ${viewMode === 'list' ? 'bg-rose-500 text-white' : 'text-white/60 hover:bg-rose-500/50'}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>

          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full text-white font-semibold shadow-lg shadow-rose-500/40 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="text-xl">+</span> New Design
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/60">
            <div className="w-12 h-12 border-4 border-white/10 border-t-rose-500 rounded-full animate-spin"></div>
            <p className="mt-4">Loading your designs...</p>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl animate-bounce">🛋️</div>
            <h2 className="text-2xl font-semibold mt-4">No designs yet</h2>
            <p className="text-white/60 mt-2 mb-8">Start creating your first room design!</p>
            <button
              className="px-8 py-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
              onClick={() => setShowCreateModal(true)}
            >
              Create Your First Design
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
          }>
            {filteredDesigns.map((design) => (
              <div
                key={design._id}
                className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-lg hover:shadow-black/30 ${viewMode === 'list' ? 'flex flex-row items-center' : 'flex flex-col'}`}
              >
                {/* Preview */}
                <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 group ${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-44'}`}>
                  <div className="flex flex-col items-center justify-center h-full text-white/30">
                    <span className="text-4xl">🏠</span>
                    <small className="text-xs mt-1">{design.room?.width || 800} × {design.room?.height || 600}</small>
                  </div>
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="px-4 py-2 bg-rose-500 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
                      onClick={() => navigate(`/editor-2d?id=${design._id}`)}
                    >
                      ✏️ Edit 2D
                    </button>
                    <button
                      className="px-4 py-2 bg-slate-700 border border-white/20 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
                      onClick={() => navigate(`/viewer-3d?id=${design._id}`)}
                    >
                      🎮 View 3D
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold text-lg truncate">{design.name}</h3>
                  <div className="flex gap-4 text-sm text-white/50 mt-1">
                    <span>📦 {design.items?.length || 0} items</span>
                    <span>📅 {formatDate(design.updatedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex border-t border-white/10 ${viewMode === 'list' ? 'flex-row border-t-0 border-l' : ''}`}>
                  <button
                    className="flex-1 py-3 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    title="Duplicate"
                    onClick={() => handleDuplicateDesign(design)}
                  >
                    📋
                  </button>
                  <button
                    className="flex-1 py-3 text-white/60 hover:bg-rose-500/30 hover:text-rose-500 transition-all"
                    title="Delete"
                    onClick={() => handleDeleteDesign(design._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Create New Design</h2>
              <button
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500 transition-colors flex items-center justify-center text-lg"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateDesign}>
              <div className="p-6">
                <label className="block mb-2 font-medium">Design Name</label>
                <input
                  type="text"
                  placeholder="e.g., Living Room, Bedroom..."
                  value={newDesignName}
                  onChange={(e) => setNewDesignName(e.target.value)}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-all"
                  autoFocus
                />

                <div className="mt-6">
                  <p className="text-sm text-white/60 mb-3">Quick start templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Living Room', icon: '🛋️' },
                      { name: 'Bedroom', icon: '🛏️' },
                      { name: 'Office', icon: '💼' },
                      { name: 'Kitchen', icon: '🍳' }
                    ].map((room) => (
                      <button
                        key={room.name}
                        type="button"
                        className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-rose-500/30 hover:border-rose-500 transition-all"
                        onClick={() => setNewDesignName(room.name)}
                      >
                        {room.icon} {room.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-white/10">
                <button
                  type="button"
                  className="px-6 py-3 border border-white/20 rounded-lg bg-transparent text-white hover:bg-white/10 transition-all"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
                  disabled={!newDesignName.trim()}
                >
                  Create Design
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}