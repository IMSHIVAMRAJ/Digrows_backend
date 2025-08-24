import { useState } from 'react';
import { FaMoneyBillWave, FaCreditCard, FaWallet, FaChartLine, FaDownload, FaFilter, FaSearch } from 'react-icons/fa';

const PaymentManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API calls
  const paymentStats = [
    { label: 'Total Revenue', value: '₹45,67,890', icon: <FaMoneyBillWave />, color: 'bg-green-500', change: '+12.5%' },
    { label: 'Pending Payments', value: '₹2,34,567', icon: <FaCreditCard />, color: 'bg-yellow-500', change: '+5.2%' },
    { label: 'Failed Transactions', value: '₹89,123', icon: <FaWallet />, color: 'bg-red-500', change: '-2.1%' },
    { label: 'Monthly Growth', value: '₹12,34,567', icon: <FaChartLine />, color: 'bg-blue-500', change: '+8.7%' }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      user: 'John Doe',
      email: 'john@example.com',
      amount: '₹25,000',
      status: 'completed',
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
      description: 'Expert Consultation Fee'
    },
    {
      id: 'TXN002',
      user: 'Sarah Smith',
      email: 'sarah@example.com',
      amount: '₹15,000',
      status: 'pending',
      date: '2024-01-14',
      paymentMethod: 'UPI',
      description: 'Mentor Session Payment'
    },
    {
      id: 'TXN003',
      user: 'Tech Startup Inc',
      email: 'contact@techstartup.com',
      amount: '₹50,000',
      status: 'completed',
      date: '2024-01-13',
      paymentMethod: 'Bank Transfer',
      description: 'Pitch Deck Review Fee'
    },
    {
      id: 'TXN004',
      user: 'GreenEnergy Co',
      email: 'info@greenenergy.com',
      amount: '₹35,000',
      status: 'failed',
      date: '2024-01-12',
      paymentMethod: 'Credit Card',
      description: 'Investment Consultation'
    },
    {
      id: 'TXN005',
      user: 'Digital Marketing Pro',
      email: 'pro@digitalmarketing.com',
      amount: '₹20,000',
      status: 'completed',
      date: '2024-01-11',
      paymentMethod: 'UPI',
      description: 'Expert Category Fee'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'pending': return '⏳';
      case 'failed': return '✗';
      default: return '?';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Payment Management</h1>
        <p className="text-gray-600">Monitor and manage all payment transactions</p>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {paymentStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f95e01]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-3 rounded-full text-white text-xl`}>
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="bg-[#f95e01] text-white py-2 px-4 rounded-lg hover:bg-[#e54d00] transition-colors flex items-center gap-2">
            <FaDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-black">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                      <div className="text-sm text-gray-500">{transaction.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      <span className="mr-1">{getStatusIcon(transaction.status)}</span>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#f95e01] hover:text-[#e54d00] mr-3">View</button>
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to 5 of 5 results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 text-sm text-white bg-[#f95e01] border border-[#f95e01] rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
