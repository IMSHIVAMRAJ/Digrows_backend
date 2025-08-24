import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuthHeader, removeToken } from '../utils/auth';

const PitchDeckManagement = () => {
  const [pitchDecks, setPitchDecks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const navigate = useNavigate();
  const baseURL = 'http://localhost:5000/api/pitch';

  const fetchDecks = async () => {
    try {
      const response = await axios.get(`${baseURL}/all`, { headers: getAuthHeader() });

      // Robustly map backend data to the format your UI expects
      const mapData = (pitch) => ({
        _id: pitch._id,
        startupName: pitch.companyName || 'N/A',
        email: pitch.userId?.email || 'N/A',
        industry: pitch.industry || 'N/A',
        link: pitch.website || '#',
        stage: pitch.stage || 'N/A',
        usp: pitch.usp || pitch.problemStatement || 'No USP provided',
        fundingRequired: pitch.fundingRequired || 'N/A',
        currentRevenue: pitch.currentRevenue || 'N/A',
        pdf: pitch.pitchDeckUrl || '#',
        status: pitch.status,
        submittedDate: pitch.createdAt ? new Date(pitch.createdAt).toLocaleDateString() : 'N/A',
        // Keep original data for the modal if needed
        ...pitch 
      });

      setPitchDecks(response.data.map(mapData));
    } catch (error) {
      console.error("Failed to fetch pitch decks:", error);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/admin/login');
      }
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${baseURL}/review/${id}`, { status: newStatus }, { headers: getAuthHeader() });
      setPitchDecks(pitchDecks.map(deck =>
        deck._id === id ? { ...deck, status: newStatus } : deck
      ));
    } catch (error) {
      console.error(`Failed to update status to ${newStatus}:`, error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>{config.text}</span>;
  };

  const getStageBadge = (stage) => {
    const stageConfig = {
      'Pre-seed': { color: 'bg-blue-100 text-blue-800' },
      'Seed': { color: 'bg-green-100 text-green-800' },
      'Series A': { color: 'bg-purple-100 text-purple-800' },
      'Series B': { color: 'bg-indigo-100 text-indigo-800' }
    };
    const config = stageConfig[stage] || { color: 'bg-gray-100 text-gray-800' };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>{stage}</span>;
  };

  const filteredDecks = activeTab === 'all'
    ? pitchDecks
    : pitchDecks.filter(deck => deck.status === activeTab);

  const viewDeckDetails = (deck) => setSelectedDeck(deck);
  const closeDeckDetails = () => setSelectedDeck(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Pitch Deck Management</h1>
        <p className="text-gray-600">Review and manage startup pitch deck applications</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-[#f95e01] text-[#f95e01]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'all' ? 'All Applications' : tab} ({tab === 'all' ? pitchDecks.length : pitchDecks.filter(d => d.status === tab).length})
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-black">Pitch Deck Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funding Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDecks.map((deck) => (
                <tr key={deck._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-black">{deck.startupName}</div>
                      <div className="text-sm text-gray-500">{deck.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{deck.industry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getStageBadge(deck.stage)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{deck.fundingRequired}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getStatusBadge(deck.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => viewDeckDetails(deck)} className="text-blue-600 hover:text-blue-900" title="View Details"><FaEye /></button>
                      {deck.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(deck._id, 'approved')} className="text-green-600 hover:text-green-900" title="Approve"><FaCheck /></button>
                          <button onClick={() => handleStatusChange(deck._id, 'rejected')} className="text-red-600 hover:text-red-900" title="Reject"><FaTimes /></button>
                        </>
                      )}
                      <a href={deck.pdf} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900" title="Download PDF"><FaDownload /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDeck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-black">Pitch Deck Details</h3>
              <button onClick={closeDeckDetails} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Startup Name</label>
                  <p className="text-sm text-black font-medium">{selectedDeck.startupName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-600">{selectedDeck.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <p className="text-sm text-gray-600">{selectedDeck.industry}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stage</label>
                  <p className="text-sm text-gray-600">{getStageBadge(selectedDeck.stage)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Funding Required</label>
                  <p className="text-sm text-gray-600">{selectedDeck.fundingRequired}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Revenue</label>
                  <p className="text-sm text-gray-600">{selectedDeck.currentRevenue}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <a href={`https://${selectedDeck.link}`} target="_blank" rel="noopener noreferrer" className="text-[#f95e01] hover:underline text-sm">{selectedDeck.link}</a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unique Selling Proposition</label>
                <p className="text-sm text-gray-600">{selectedDeck.usp}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pitch Deck PDF</label>
                <a href={selectedDeck.pdf} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[#f95e01] hover:underline">
                  <FaDownload />
                  <span className="text-sm">{selectedDeck.pdf?.split('/').pop()}</span>
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                <p className="text-sm text-gray-600">{selectedDeck.submittedDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Status</label>
                <div className="mt-1">{getStatusBadge(selectedDeck.status)}</div>
              </div>
            </div>
            {selectedDeck.status === 'pending' && (
              <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => { handleStatusChange(selectedDeck._id, 'approved'); closeDeckDetails(); }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                ><FaCheck className="mr-2" />Approve Application</button>
                <button
                  onClick={() => { handleStatusChange(selectedDeck._id, 'rejected'); closeDeckDetails(); }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                ><FaTimes className="mr-2" />Reject Application</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDeckManagement;