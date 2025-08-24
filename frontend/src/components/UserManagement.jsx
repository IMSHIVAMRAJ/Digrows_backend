import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuthHeader, removeToken } from '../utils/auth';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('freelancers');
  const [freelancers, setFreelancers] = useState([]);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [startupFounders, setStartupFounders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = getAuthHeader();
        if (!headers.Authorization) {
          // If no token is found, redirect to login immediately
          throw new Error('No token found');
        }

        const baseURL = 'http://localhost:5000/api/admin';

        const [freelancersRes, entrepreneursRes, startupFoundersRes] = await Promise.all([
          axios.get(`${baseURL}/freelancers`, { headers }),
          axios.get(`${baseURL}/entrepreneurs`, { headers }),
          axios.get(`${baseURL}/startup-founders`, { headers }),
        ]);

        setFreelancers(freelancersRes.data);
        setEntrepreneurs(entrepreneursRes.data);
        setStartupFounders(startupFoundersRes.data);

      } catch (error) {
        console.error("Authentication or network error:", error.message);
        // If token is invalid or expired (401), or if no token was found, log out the user
        if (error.message === 'No token found' || (error.response && error.response.status === 401)) {
          removeToken();
          navigate('/admin/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: getAuthHeader()
      });
      
      if (type === 'freelancers') {
        setFreelancers(freelancers.filter(user => user._id !== id));
      } else if (type === 'entrepreneurs') {
        setEntrepreneurs(entrepreneurs.filter(user => user._id !== id));
      } else if (type === 'startupFounders') {
        setStartupFounders(startupFounders.filter(user => user._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/admin/login');
      }
    }
  };

  const renderFreelancersTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Freelancers</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {freelancers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <button
                    onClick={() => handleDelete('freelancers', user._id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEntrepreneursTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Entrepreneurs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entrepreneurs.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.businessName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <a href={user.businessLink} target="_blank" rel="noopener noreferrer" className="text-[#f95e01] hover:underline">
                    {user.businessLink}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <button
                    onClick={() => handleDelete('entrepreneurs', user._id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStartupFoundersTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Startup Founders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {startupFounders.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.businessName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <a href={user.businessLink} target="_blank" rel="noopener noreferrer" className="text-[#f95e01] hover:underline">
                    {user.businessLink}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <button
                    onClick={() => handleDelete('startupFounders', user._id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">User Management</h1>
        <p className="text-gray-600">Manage freelancers, entrepreneurs, and startup founders</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'freelancers'
                  ? 'border-[#f95e01] text-[#f95e01]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Freelancers ({freelancers.length})
            </button>
            <button
              onClick={() => setActiveTab('entrepreneurs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'entrepreneurs'
                  ? 'border-[#f95e01] text-[#f95e01]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Entrepreneurs ({entrepreneurs.length})
            </button>
            <button
              onClick={() => setActiveTab('startupFounders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'startupFounders'
                  ? 'border-[#f95e01] text-[#f95e01]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Startup Founders ({startupFounders.length})
            </button>
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'freelancers' && renderFreelancersTable()}
        {activeTab === 'entrepreneurs' && renderEntrepreneursTable()}
        {activeTab === 'startupFounders' && renderStartupFoundersTable()}
      </div>
    </div>
  );
};

export default UserManagement;