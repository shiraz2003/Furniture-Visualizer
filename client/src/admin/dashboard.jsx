// src/admin/Dashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome to the Furniture Visualizer Admin Panel.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <h3 className="text-lg opacity-80">Total Users</h3>
          <p className="text-4xl font-bold">24</p>
        </div>
        {/* තවත් Stats cards මෙතනට දාන්න පුළුවන් */}
      </div>
    </div>
  );
};

export default AdminDashboard;