import React, { useState } from 'react';
import { 
  HiPlus, HiOutlineTrash, HiOutlineX, 
  HiOutlineUpload, HiOutlinePhotograph, HiOutlineExclamationCircle, HiOutlineTag,
  HiOutlinePencilAlt,
  HiOutlineSearch // Search icon එක එකතු කළා
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Items = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [items, setItems] = useState([
    { id: 1, name: "Modern Sofa", category: "Living Room", description: "High quality luxury sofa with premium leather finish.", image: null },
    { id: 2, name: "Office Chair", category: "Office", description: "Ergonomic workspace chair designed for long hours.", image: null },
  ]);

  const [formData, setFormData] = useState({ name: '', category: '', description: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);

  // Filter Items logic
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

  const resetForm = () => {
    setFormData({ name: '', category: '', description: '', image: null });
    setPreviewImage(null);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      image: item.image
    });
    setPreviewImage(item.image);
    setEditId(item.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleAddItem = () => {
    if (isEditing) {
      setItems(items.map(item => 
        item.id === editId ? { ...item, ...formData, image: previewImage } : item
      ));
      toast.success("Item updated successfully!");
    } else {
      const newId = Date.now(); 
      setItems([...items, { id: newId, ...formData, image: previewImage }]);
      toast.success("Item added successfully!");
    }
    
    setShowConfirmModal(false);
    setShowAddModal(false);
    resetForm();
  };

  const handleDelete = () => {
    setItems(items.filter(i => i.id !== itemToDelete.id));
    toast.success("Item removed!");
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="relative min-h-full pb-24 lg:pb-0 animate-in fade-in duration-500">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Furniture Items</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage your product catalog and inventory.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* --- Search Input --- */}
          <div className="relative flex-1 md:w-64">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>

          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium shrink-0"
          >
            <HiPlus size={20} /> Add New Item
          </button>
        </div>
      </div>

      {/* --- Mobile FAB --- */}
      <button 
        onClick={() => { resetForm(); setShowAddModal(true); }}
        className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] active:scale-90 transition-transform border-2 border-white"
      >
        <HiPlus size={28} />
      </button>

      {/* 1. Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Product</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Description</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <HiOutlinePhotograph size={20} />}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 max-w-xs truncate">{item.description}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEditClick(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <HiOutlinePencilAlt size={18} />
                      </button>
                      <button onClick={() => { setItemToDelete(item); setShowDeleteModal(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 text-sm">No items found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <HiOutlinePhotograph size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <div className="flex items-center text-[10px] text-indigo-600 font-bold uppercase tracking-tighter gap-1">
                    <HiOutlineTag /> {item.category}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(item)} className="p-2 text-indigo-500 bg-indigo-50 rounded-lg">
                  <HiOutlinePencilAlt size={18} />
                </button>
                <button onClick={() => { setItemToDelete(item); setShowDeleteModal(true); }} className="p-2 text-red-500 bg-red-50 rounded-lg">
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <form onSubmit={handleSubmitClick} className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{isEditing ? 'Edit Furniture Item' : 'Add New Furniture Item'}</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Image</label>
                <label className="flex flex-col items-center justify-center w-full min-h-[220px] lg:h-full lg:min-h-0 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all overflow-hidden group">
                  {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <HiOutlineUpload size={40} className="group-hover:scale-110 transition-transform"/>
                      <p className="text-xs mt-2 font-medium">Click to Upload Image</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!previewImage && !isEditing} />
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input name="name" value={formData.name} type="text" required onChange={handleInputChange} className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" placeholder="e.g. Luxury Modern Sofa" />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative mt-1">
                        <select name="category" value={formData.category} required onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer pr-10">
                        <option value="">Select Category</option>
                        <option value="Living Room">Living Room</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Office">Office</option>
                        <option value="Kitchen">Kitchen</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                    </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea name="description" value={formData.description} rows="4" required onChange={handleInputChange} className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm resize-none" placeholder="Provide detailed specifications..." />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all mt-2 active:scale-95">
                  {isEditing ? 'Update Item' : 'Publish Item'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* --- CONFIRM MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {isEditing ? <HiOutlinePencilAlt size={32} /> : <HiPlus size={32} />}
            </div>
            <h3 className="text-lg font-bold text-slate-800">Confirm Action</h3>
            <p className="text-slate-500 my-3 text-sm">Are you sure you want to {isEditing ? 'update' : 'add'} <b>{formData.name}</b>?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleAddItem} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200">
                {isEditing ? 'Yes, Update' : 'Yes, Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <HiOutlineExclamationCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Confirm Removal</h3>
            <p className="text-slate-500 my-3 text-sm">Delete <b>{itemToDelete?.name}</b> from catalog?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;