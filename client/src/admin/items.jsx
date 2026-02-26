import React, { useState, useEffect } from 'react';
import { 
  HiPlus, HiOutlineTrash, HiOutlineX, HiOutlineUpload, 
  HiOutlinePhotograph, HiOutlineExclamationCircle, HiOutlineTag,
  HiOutlineSearch, HiOutlineCube 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';
import MediaUpload from '../utils/mediaupload';
import { createClient } from '@supabase/supabase-js';

// Supabase Client එක (Delete කිරීම සඳහා අවශ්‍ය වේ)
const supabaseUrl = 'https://iiwyuylfnxskjqnzgynd.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpd3l1eWxmbnhza2pxbnpneW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjQ1NDMsImV4cCI6MjA4NzcwMDU0M30.1_ywyumUtaMqT1751wmuskloIMEquCxpDCwNk2mMHpE";
const supabase = createClient(supabaseUrl, supabaseKey);

const Items = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({ 
    name: '', category: '', description: '', price: '', image: null, glbFile: null 
  });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/furniture/all`);
      setItems(res.data);
    } catch (err) { 
      console.error(err);
      toast.error("Failed to load items"); 
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleGlbChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, glbFile: file });
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleAddItem = async () => {
    setLoading(true);
    try {
      const imageUrl = await MediaUpload(formData.image);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("image", imageUrl);
      data.append("glbFile", formData.glbFile);

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/furniture/add`, data);
      
      toast.success("Item added successfully!");
      setShowConfirmModal(false);
      setShowAddModal(false);
      fetchItems();
      setPreviewImage(null);
      setFormData({ name: '', category: '', description: '', price: '', image: null, glbFile: null });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // 1. Supabase එකෙන් Image එක මැකීම
      if (itemToDelete.image) {
        const urlParts = itemToDelete.image.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const { error: supabaseError } = await supabase.storage
          .from('furniturevisualization')
          .remove([fileName]);
        
        if (supabaseError) console.error("Supabase delete error:", supabaseError);
      }

      // 2. MongoDB සහ Server Folder එකෙන් මැකීම (Backend API හරහා)
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/furniture/delete/${itemToDelete._id}`);

      toast.success("Item removed successfully!");
      fetchItems();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-full pb-24 lg:pb-0 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Furniture Items</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage your product catalog and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all shadow-sm" />
          </div>
          <button onClick={() => setShowAddModal(true)} className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium shrink-0">
            <HiPlus size={20} /> Add New Item
          </button>
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Product</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Price</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <tr key={item._id} className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <HiOutlinePhotograph />}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                </td>
                <td className="p-4 text-sm font-bold text-slate-600">Rs. {item.price}</td>
                <td className="p-4">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{item.category}</span>
                </td>
                <td className="p-4 text-center">
                   <button onClick={() => { setItemToDelete(item); setShowDeleteModal(true); }} className="p-2 text-slate-400 hover:text-red-600 transition-all"><HiOutlineTrash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <form onSubmit={handleSubmitClick} className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Add New Furniture Item</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-full text-slate-400"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview Image</label>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 overflow-hidden">
                  {previewImage ? <img src={previewImage} alt="preview" className="w-full h-full object-cover" /> : <div className="text-center"><HiOutlinePhotograph size={32} className="mx-auto text-slate-300"/><p className="text-xs text-slate-400 mt-2">Upload Image</p></div>}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                </label>

                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3D Model (.glb)</label>
                <label className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-400 transition-all">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><HiOutlineCube size={24}/></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{formData.glbFile ? formData.glbFile.name : 'Select .glb file'}</p>
                    <p className="text-[10px] text-slate-400 uppercase">3D Visualizer File</p>
                  </div>
                  <input type="file" className="hidden" accept=".glb" onChange={handleGlbChange} required />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                  <input name="name" type="text" required onChange={handleInputChange} className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" placeholder="e.g. Luxury Sofa" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price (Rs.)</label>
                    <input name="price" type="number" required onChange={handleInputChange} className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" placeholder="50000" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      name="category" 
                      required 
                      onChange={handleInputChange} 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm">
                      <option value="">Select</option>
                      <option value="Sofa">Sofa</option>
                      <option value="Chair">Chair</option>
                      <option value="Desk">Desk</option>
                      <option value="Cupboard">Cupboard</option>
                      <option value="Table">Table</option>
                      <option value="Bed">Bed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea name="description" rows="3" required onChange={handleInputChange} className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm resize-none" placeholder="Details..." />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all mt-2 active:scale-95">
                  {loading ? 'Uploading...' : 'Publish Item'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><HiOutlineUpload size={32} /></div>
            <h3 className="text-lg font-bold text-slate-800">Confirm Action</h3>
            <p className="text-slate-500 my-3 text-sm">Are you sure you want to add this item to the catalog?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleAddItem} disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg">
                {loading ? 'Processing...' : 'Yes, Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <HiOutlineExclamationCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Confirm Delete</h3>
            <p className="text-slate-500 my-3 text-sm">Delete <b>{itemToDelete?.name}</b> permanently?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium shadow-lg">
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;