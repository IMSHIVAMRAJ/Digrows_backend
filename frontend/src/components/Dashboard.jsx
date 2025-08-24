import { FaUsers, FaBriefcase, FaRocket, FaBullseye, FaBrain, FaMoneyBillWave, FaTags, FaFileAlt, FaCreditCard } from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: <FaUsers />, color: 'bg-blue-500' },
    { label: 'Freelancers', value: '567', icon: <FaBriefcase />, color: 'bg-green-500' },
    { label: 'Entrepreneurs', value: '678', icon: <FaRocket />, color: 'bg-purple-500' },
    { label: 'Total Experts', value: '890', icon: <FaBullseye />, color: 'bg-[#f95e01]' },
    { label: 'Mentors', value: '234', icon: <FaBrain />, color: 'bg-indigo-500' },
    { label: 'Investors', value: '156', icon: <FaMoneyBillWave />, color: 'bg-yellow-500' },
    { label: 'Total Revenue', value: '₹45,67,890', icon: <FaMoneyBillWave />, color: 'bg-green-500' },
    { label: 'Pending Payments', value: '₹2,34,567', icon: <FaCreditCard />, color: 'bg-yellow-500' },
    { label: 'Expert Categories', value: '15', icon: <FaTags />, color: 'bg-pink-500' },
    { label: 'Mentor Categories', value: '12', icon: <FaTags />, color: 'bg-teal-500' },
    { label: 'Pitch Deck Apps', value: '89', icon: <FaFileAlt />, color: 'bg-orange-500' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Di-Grows Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f95e01]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-black">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-black mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-[#f95e01] rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">New user registration: John Doe</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-[#f95e01] rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Expert profile updated: Sarah Smith</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-[#f95e01] rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">New entrepreneur: Tech Startup Inc</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-[#f95e01] rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Pitch deck submitted: GreenEnergy Co</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-[#f95e01] rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">New expert category added: Digital Marketing</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-black mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-[#f95e01] text-white py-2 px-4 rounded hover:bg-[#e54d00] transition-colors">
              Add New User
            </button>
            <button className="w-full bg-[#f95e01] text-white py-2 px-4 rounded hover:bg-[#e54d00] transition-colors">
              Add New Expert
            </button>
            <button className="w-full bg-[#f95e01] text-white py-2 px-4 rounded hover:bg-[#e54d00] transition-colors">
              Manage Categories
            </button>
            <button className="w-full bg-[#f95e01] text-white py-2 px-4 rounded hover:bg-[#e54d00] transition-colors">
              Review Pitch Decks
            </button>
            <button className="w-full bg-[#f95e01] text-white py-2 px-4 rounded hover:bg-[#e54d00] transition-colors">
              Generate Report
            </button>
            <button className="w-full bg-[#f95e01] text-white py-2 px-4 rounded hover:bg-[#e54d00] transition-colors">
              View Payments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
