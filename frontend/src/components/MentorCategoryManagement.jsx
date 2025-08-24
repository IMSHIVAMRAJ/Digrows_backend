import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuthHeader, removeToken } from '../utils/auth';

const MentorCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  // 'description' is removed, and 'type' is hardcoded to 'mentor'
  const [newCategory, setNewCategory] = useState({ name: '', type: 'mentor' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const navigate = useNavigate();
  const baseURL = 'http://localhost:5000/api/admin';

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/categories`, { headers: getAuthHeader() });
      // KEY CHANGE: Filter the results to only show mentor categories
      const mentorCategories = response.data.filter(cat => cat.type === 'mentor');
      setCategories(mentorCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/admin/login');
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      try {
        // The 'type' is already set to 'mentor' in the newCategory state
        await axios.post(`${baseURL}/category`, newCategory, { headers: getAuthHeader() });
        setNewCategory({ name: '', type: 'mentor' }); // Reset form
        fetchCategories(); // Refresh list
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${baseURL}/category/${id}`, { headers: getAuthHeader() });
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleEditStart = (category) => {
    setEditingId(category._id);
    setEditForm({ name: category.name });
  };

  const handleEditSave = async () => {
    if (editForm.name.trim()) {
      try {
        await axios.put(`${baseURL}/category/${editingId}`, editForm, { headers: getAuthHeader() });
        setEditingId(null);
        setEditForm({ name: '' });
        fetchCategories();
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ name: '' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Mentor Category Management</h1>
        <p className="text-gray-600">Manage mentor categories and specializations</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="e.g., Business Strategy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f95e01]"
            />
          </div>
          {/* The type selection is no longer needed in the UI */}
        </div>
        <button
          onClick={handleAddCategory}
          className="mt-4 bg-[#f95e01] text-white px-4 py-2 rounded-md hover:bg-[#e54d00] transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-black">Mentor Categories ({categories.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentors Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {editingId === category._id ? (
                      <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded"/>
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {category.count} mentors
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {editingId === category._id ? (
                      <div className="flex space-x-2">
                        <button onClick={handleEditSave} className="text-green-600 hover:text-green-900 font-medium">Save</button>
                        <button onClick={handleEditCancel} className="text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditStart(category)} className="text-blue-600 hover:text-blue-900 font-medium">
                          <FaEdit className="inline mr-1" /> Edit
                        </button>
                        <button onClick={() => handleDeleteCategory(category._id)} className="text-red-600 hover:text-red-900 font-medium">
                          <FaTrash className="inline mr-1" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentorCategoryManagement;