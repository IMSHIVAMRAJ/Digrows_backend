import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuthHeader, removeToken } from '../utils/auth';

const ExpertManagement = () => {
  const [activeTab, setActiveTab] = useState('experts');
  const [experts, setExperts] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [investors, setInvestors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = getAuthHeader();
        if (!headers.Authorization) {
          throw new Error('No token found');
        }

        const baseURL = 'http://localhost:5000/api/admin';

        const [expertsRes, mentorsRes, investorsRes] = await Promise.all([
          axios.get(`${baseURL}/experts`, { headers }),
          axios.get(`${baseURL}/mentors`, { headers }),
          axios.get(`${baseURL}/investors`, { headers }),
        ]);

        // Helper function to map backend properties and format the address
        const mapData = (item) => ({
          ...item,
          number: item.phone,
          skillsExp: item.skills,
          company: item.companyName,
          link: item.website,
          // FIX IS HERE: Convert the address object to a readable string
          address: item.address ? `${item.address.city}, ${item.address.state}` : 'Not Available',
        });

        setExperts(expertsRes.data.map(mapData));
        setMentors(mentorsRes.data.map(mapData));
        setInvestors(investorsRes.data.map(mapData));

      } catch (error) {
        console.error("Authentication or network error:", error.message);
        if (error.message === 'No token found' || (error.response && error.response.status === 401)) {
          removeToken();
          navigate('/admin/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/expert/${id}`, {
        headers: getAuthHeader()
      });

      if (type === 'experts') {
        setExperts(experts.filter(expert => expert._id !== id));
      } else if (type === 'mentors') {
        setMentors(mentors.filter(mentor => mentor._id !== id));
      } else {
        setInvestors(investors.filter(investor => investor._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/admin/login');
      }
    }
  };

  const renderExpertsTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Experts</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills & Exp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {experts.map((expert) => (
              <tr key={expert._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{expert.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.skillsExp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <a href={`https://${expert.link}`} target="_blank" rel="noopener noreferrer" className="text-[#f95e01] hover:underline">
                    {expert.link}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.officeAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.gstin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expert.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <button onClick={() => handleDelete('experts', expert._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMentorsTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Mentors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills & Exp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentors.map((mentor) => (
              <tr key={mentor._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{mentor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.skillsExp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <a href={`https://${mentor.link}`} target="_blank" rel="noopener noreferrer" className="text-[#f95e01] hover:underline">
                    {mentor.link}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.officeAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.gstin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <button onClick={() => handleDelete('mentors', mentor._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvestorsTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Investors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills & Exp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {investors.map((investor) => (
              <tr key={investor._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{investor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.skillsExp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <a href={`https://${investor.link}`} target="_blank" rel="noopener noreferrer" className="text-[#f95e01] hover:underline">
                    {investor.link}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.officeAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.gstin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <button onClick={() => handleDelete('investors', investor._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
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
        <h1 className="text-3xl font-bold text-black mb-2">Expert Management</h1>
        <p className="text-gray-600">Manage experts, mentors, and investors</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('experts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'experts'
                  ? 'border-[#f95e01] text-[#f95e01]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Experts ({experts.length})
            </button>
            <button
              onClick={() => setActiveTab('mentors')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mentors'
                  ? 'border-[#f95e01] text-[#f95e01]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mentors ({mentors.length})
            </button>
            <button
              onClick={() => setActiveTab('investors')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'investors'
                  ? 'border-[#f95e01] text-[#f95e01]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Investors ({investors.length})
            </button>
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'experts' && renderExpertsTable()}
        {activeTab === 'mentors' && renderMentorsTable()}
        {activeTab === 'investors' && renderInvestorsTable()}
      </div>
    </div>
  );
};

export default ExpertManagement;