import React, { useState } from 'react';
import { 
  HiOutlineColorSwatch, HiOutlineSave, HiOutlineTrash, 
  HiOutlineCursorClick, HiOutlineCube, HiOutlineSelector,
  HiOutlinePhotograph, HiOutlineRefresh, HiOutlineChevronRight
} from 'react-icons/hi';
import { TbAppWindow, TbLayersIntersect } from 'react-icons/tb'; // අමතර icons සඳහා
import toast from 'react-hot-toast';

const DesignWorkspace = () => {
  const [selectedTool, setSelectedTool] = useState('select');
  const [activeTab, setActiveTab] = useState('properties');

  const tools = [
    { id: 'select', icon: <HiOutlineCursorClick size={22} />, label: 'Select' },
    { id: 'shape', icon: <HiOutlineCube size={22} />, label: 'Shapes' },
    { id: 'material', icon: <HiOutlineColorSwatch size={22} />, label: 'Material' },
    { id: 'texture', icon: <HiOutlinePhotograph size={22} />, label: 'Texture' },
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-700">
      {/* --- Top Toolbar --- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
            <TbAppWindow size={24} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-none">Design Studio v1.0</h2>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">Untitled Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all">
            <HiOutlineRefresh /> Reset
          </button>
          <button 
            onClick={() => toast.success("Design saved locally!")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <HiOutlineSave /> Save Concept
          </button>
        </div>
      </div>

      {/* --- Main Workspace Area --- */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        
        {/* Left Sidebar: Tools */}
        <div className="w-20 bg-white border border-slate-200 rounded-[2rem] flex flex-col items-center py-8 gap-6 shadow-sm">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`group relative p-4 rounded-2xl transition-all ${
                selectedTool === tool.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tool.icon}
              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {tool.label}
              </span>
            </button>
          ))}
          <div className="mt-auto border-t border-slate-100 pt-6 w-full flex justify-center">
            <button className="p-4 text-red-400 hover:text-red-600 transition-colors">
              <HiOutlineTrash size={22} />
            </button>
          </div>
        </div>

        {/* Center: Interactive Canvas */}
        <div className="flex-1 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 relative overflow-hidden group">
          {/* Grid Background Effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl text-slate-300 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                <HiOutlineCube size={40} />
              </div>
              <p className="text-slate-400 text-sm font-medium">Drag components here to start designing</p>
              <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all">
                + Add Component
              </button>
            </div>
          </div>

          {/* Canvas Viewport Coordinates */}
          <div className="absolute bottom-6 left-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 text-[10px] font-mono text-slate-500 shadow-sm">
            X: 120.4 | Y: 45.8 | Z: 0.0
          </div>
        </div>

        {/* Right Sidebar: Properties Panel */}
        <div className="w-80 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('properties')}
                className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all ${activeTab === 'properties' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
              >
                Properties
              </button>
              <button 
                onClick={() => setActiveTab('layers')}
                className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all ${activeTab === 'layers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
              >
                Layers
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeTab === 'properties' ? (
              <>
                {/* Dimensions */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <HiOutlineSelector className="text-indigo-500" /> Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Width', 'Height', 'Depth'].map(dim => (
                      <div key={dim}>
                        <p className="text-[9px] text-slate-400 mb-1 ml-1">{dim}</p>
                        <input type="number" defaultValue="120" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Material</label>
                  <div className="flex flex-wrap gap-2">
                    {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#1F2937', '#E2E8F0'].map(color => (
                      <button key={color} style={{ backgroundColor: color }} className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                    ))}
                  </div>
                </div>

                {/* Texture Toggle */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finishing</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-400">
                    <option>Glossy Polish</option>
                    <option>Matte Texture</option>
                    <option>Wood Grain</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {['Base Frame', 'Seat Cushion', 'Backrest', 'Armrest Left', 'Armrest Right'].map((layer, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <TbLayersIntersect className="text-slate-400" />
                      <span className="text-xs font-medium text-slate-600">{layer}</span>
                    </div>
                    <HiOutlineChevronRight className="text-slate-300" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Summary */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase">Estimated Cost</span>
              <span className="text-lg font-black text-slate-800">Rs. 45,000</span>
            </div>
            <button className="w-full py-3 bg-slate-800 text-white rounded-2xl text-xs font-bold hover:bg-slate-900 transition-all">
              Export 3D Model
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DesignWorkspace;