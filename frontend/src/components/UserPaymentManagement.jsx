import { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaEye, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

const UserPaymentManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data - replace with actual API calls
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      userType: 'Entrepreneur',
      status: 'active',
      totalPayments: '₹75,000',
      pendingAmount: '₹15,000',
      lastPayment: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+91 98765 43211',
      userType: 'Freelancer',
      status: 'active',
      totalPayments: '₹45,000',
      pendingAmount: '₹0',
      lastPayment: '2024-01-14'
    },
    {
      id: 3,
      name: 'Tech Startup Inc',
      email: 'contact@techstartup.com',
      phone: '+91 98765 43212',
      userType: 'Company',
      status: 'active',
      totalPayments: '₹1,25,000',
      pendingAmount: '₹25,000',
      lastPayment: '2024-01-13'
    },
    {
      id: 4,
      name: 'GreenEnergy Co',
      email: 'info@greenenergy.com',
      phone: '+91 98765 43213',
      userType: 'Entrepreneur',
      status: 'inactive',
      totalPayments: '₹35,000',
      pendingAmount: '₹0',
      lastPayment: '2024-01-12'
    }
  ];

  const userPayments = [
    {
      id: 'PAY001',
      userId: 1,
      amount: '₹25,000',
      status: 'completed',
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
      description: 'Expert Consultation Fee',
      transactionId: 'TXN001'
    },
    {
      id: 'PAY002',
      userId: 1,
      amount: '₹15,000',
      status: 'pending',
      date: '2024-01-14',
      paymentMethod: 'UPI',
      description: 'Mentor Session Payment',
      transactionId: 'TXN002'
    },
    {
      id: 'PAY003',
      userId: 2,
      amount: '₹20,000',
      status: 'completed',
      date: '2024-01-13',
      paymentMethod: 'Bank Transfer',
      description: 'Expert Category Fee',
      transactionId: 'TXN003'
    }
  ];

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Entrepreneur',
    status: 'active'
  });

  const [newPayment, setNewPayment] = useState({
    userId: '',
    amount: '',
    paymentMethod: 'Credit Card',
    description: ''
  });

  const handleAddUser = () => {
    // Add user logic here
    console.log('Adding user:', newUser);
    setShowAddUserModal(false);
    setNewUser({ name: '', email: '', phone: '', userType: 'Entrepreneur', status: 'active' });
  };

  const handleAddPayment = () => {
    // Add payment logic here
    console.log('Adding payment:', newPayment);
    setShowAddPaymentModal(false);
    setNewPayment({ userId: '', amount: '', paymentMethod: 'Credit Card', description: '' });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Delete user logic here
      console.log('Deleting user:', userId);
    }
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      // Delete payment logic here
      console.log('Deleting payment:', paymentId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">User Payment Management</h1>
        <p className="text-gray-600">Manage users and their payment details</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-[#f95e01] text-white py-2 px-4 rounded-lg hover:bg-[#e54d00] transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Add New User
        </button>
        <button
          onClick={() => setShowAddPaymentModal(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Add New Payment
        </button>
        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <FaDownload />
          Export Data
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-black">Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.userType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {user.totalPayments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.pendingAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastPayment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="text-[#f95e01] hover:text-[#e54d00] mr-3"
                    >
                      <FaEye />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Payments Table */}
      {selectedUser && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-black">Payment Details for {selectedUser.name}</h3>
            <button 
              onClick={() => setSelectedUser(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Close
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userPayments.filter(payment => payment.userId === selectedUser.id).map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#f95e01] hover:text-[#e54d00] mr-3">
                        <FaEye />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeletePayment(payment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              />
              <select
                value={newUser.userType}
                onChange={(e) => setNewUser({...newUser, userType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              >
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Company">Company</option>
                <option value="Investor">Investor</option>
              </select>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-[#f95e01] text-white py-2 px-4 rounded-lg hover:bg-[#e54d00] transition-colors"
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Payment</h3>
            <div className="space-y-4">
              <select
                value={newPayment.userId}
                onChange={(e) => setNewPayment({...newPayment, userId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} - {user.email}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              />
              <select
                value={newPayment.paymentMethod}
                onChange={(e) => setNewPayment({...newPayment, paymentMethod: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
              <textarea
                placeholder="Description"
                value={newPayment.description}
                onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f95e01] focus:border-transparent"
                rows="3"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddPayment}
                className="flex-1 bg-[#f95e01] text-white py-2 px-4 rounded-lg hover:bg-[#e54d00] transition-colors"
              >
                Add Payment
              </button>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPaymentManagement;
