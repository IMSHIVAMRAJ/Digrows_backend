import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaUsers, FaBullseye, FaTags, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/experts', label: 'Expert Management', icon: <FaBullseye /> },
    { path: '/expert-categories', label: 'Expert Categories', icon: <FaTags /> },
    { path: '/mentor-categories', label: 'Mentor Categories', icon: <FaTags /> },
    { path: '/pitch-decks', label: 'Pitch Decks', icon: <FaFileAlt /> },
    { path: '/payments', label: 'Payment Management', icon: <FaMoneyBillWave /> },
    { path: '/user-payments', label: 'User Payments', icon: <FaUsers /> }
  ];

  return (
    <div className="w-64 bg-[#1e1e1e] text-white shadow-lg">
      {/* Logo / Title */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-[#f95e01]">Di-Grows Admin</h1>
      </div>
      
      {/* Navigation */}
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-lg rounded-md mx-2 transition-colors ${
              location.pathname === item.path
                ? 'bg-[#f95e01] text-black font-semibold'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
