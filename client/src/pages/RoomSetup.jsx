import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function RoomSetup() {
  const navigate = useNavigate();
  const { room, setRoom } = useDesign();

  const [formData, setFormData] = useState({
    width: room.width,
    length: room.length,
    height: room.height,
    wallColor: room.wallColor,
    floorColor: room.floorColor
  });

  const [errors, setErrors] = useState({});

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (formData.width < 1 || formData.width > 20) {
      newErrors.width = "Between 1-20m";
    }
    if (formData.length < 1 || formData.length > 20) {
      newErrors.length = "Between 1-20m";
    }
    if (formData.height < 2 || formData.height > 5) {
      newErrors.height = "Between 2-5m";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    setRoom({
      width: formData.width,
      length: formData.length,
      height: formData.height,
      wallColor: formData.wallColor,
      floorColor: formData.floorColor
    });

    toast.success("Room setup saved!");
    navigate('/editor-2d');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-[#050315] font-sans selection:bg-[#2f27ce] selection:text-[#fbfbfe] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-4">
        
        <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-2xl shadow-2xl shadow-[#050315]/5 border border-[#dedcff]/50">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1 text-[#050315]">
              Room Setup
            </h1>
            <p className="text-[#050315]/50 font-medium text-xs md:text-sm">
              Configure your room dimensions and colors (meters)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-[#050315]/50 uppercase tracking-widest mb-1 block ml-1">
                  Width (m)
                </label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  step="0.1"
                  min="1"
                  max="20"
                  className={`w-full px-4 py-2.5 bg-[#fbfbfe] rounded-xl border-2 transition-all font-bold text-sm outline-none ${
                    errors.width ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100' : 'border-transparent focus:border-[#2f27ce] focus:ring-4 focus:ring-[#dedcff]/50 text-[#050315]'
                  }`}
                />
                {errors.width && <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1 block">{errors.width}</span>}
              </div>

              <div>
                <label className="text-[10px] font-black text-[#050315]/50 uppercase tracking-widest mb-1 block ml-1">
                  Length (m)
                </label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  step="0.1"
                  min="1"
                  max="20"
                  className={`w-full px-4 py-2.5 bg-[#fbfbfe] rounded-xl border-2 transition-all font-bold text-sm outline-none ${
                    errors.length ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100' : 'border-transparent focus:border-[#2f27ce] focus:ring-4 focus:ring-[#dedcff]/50 text-[#050315]'
                  }`}
                />
                {errors.length && <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1 block">{errors.length}</span>}
              </div>

              <div>
                <label className="text-[10px] font-black text-[#050315]/50 uppercase tracking-widest mb-1 block ml-1">
                  Height (m)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.1"
                  min="2"
                  max="5"
                  className={`w-full px-4 py-2.5 bg-[#fbfbfe] rounded-xl border-2 transition-all font-bold text-sm outline-none ${
                    errors.height ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100' : 'border-transparent focus:border-[#2f27ce] focus:ring-4 focus:ring-[#dedcff]/50 text-[#050315]'
                  }`}
                />
                {errors.height && <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1 block">{errors.height}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[10px] font-black text-[#050315]/50 uppercase tracking-widest mb-1 block ml-1">
                  Wall Color
                </label>
                <div className="flex items-center gap-3 bg-[#fbfbfe] p-2 rounded-xl border-2 border-transparent hover:border-[#dedcff] transition-all">
                  <input
                    type="color"
                    name="wallColor"
                    value={formData.wallColor}
                    onChange={handleChange}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-xs font-bold text-[#050315]/70 uppercase">{formData.wallColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[#050315]/50 uppercase tracking-widest mb-1 block ml-1">
                  Floor Color
                </label>
                <div className="flex items-center gap-3 bg-[#fbfbfe] p-2 rounded-xl border-2 border-transparent hover:border-[#dedcff] transition-all">
                  <input
                    type="color"
                    name="floorColor"
                    value={formData.floorColor}
                    onChange={handleChange}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-xs font-bold text-[#050315]/70 uppercase">{formData.floorColor}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#fbfbfe] rounded-2xl border border-[#dedcff]/50">
              <h3 className="text-[10px] font-black text-[#050315]/50 uppercase tracking-widest mb-3 text-center">
                Live Preview
              </h3>
              <div 
                className="w-full h-20 rounded-xl border-4 flex items-center justify-center shadow-inner transition-colors duration-300"
                style={{
                  backgroundColor: formData.floorColor,
                  borderColor: formData.wallColor
                }}
              >
                <span className="text-xs font-black text-[#050315] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                  {formData.width}m × {formData.length}m × {formData.height}m
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 mt-4 bg-[#2f27ce] text-[#fbfbfe] font-bold rounded-xl shadow-lg shadow-[#2f27ce]/30 hover:bg-[#433bff] active:scale-95 transition-all text-sm"
            >
              Continue to 2D Editor
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}