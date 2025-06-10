import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const [isHovered, setIsHovered] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/browse-projects', label: 'Browse', requiresAuth: true },
    { path: '/categories', label: 'Categories', requiresAuth: true },
    { path: '/add-project', label: 'Add Project', requiresAuth: true },
    { path: '/manage-projects', label: 'Manage', requiresAuth: true },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#272727] to-[#2A3F6C] border-b border-[#6A669D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-[#E5E3D4] text-2xl font-bold tracking-tight hover:text-[#9ABF80] 
                       transition-colors duration-300"
            >
              <img src="/images/digipodiumlogo.png" alt="Logo" className="h-12 w-12 mr-2 inline-block" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              (item.showAlways || (item.requiresAuth && isLoggedIn)) && (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setIsHovered(item.path)}
                  onMouseLeave={() => setIsHovered('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                           ${isActive(item.path) 
                             ? 'bg-[#9ABF80]/20 text-[#9ABF80]' 
                             : 'text-[#E5E3D4] hover:bg-[#6A669D]/20'
                           }
                           ${isHovered === item.path ? 'scale-105' : ''}`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-[#6A669D]/10 hover:bg-[#6A669D]/20 text-[#E5E3D4] 
                         px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium
                         border border-[#6A669D]/20 hover:border-[#9ABF80]/30
                         hover:scale-105 hover:shadow-lg hover:shadow-[#6A669D]/10"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-[#E5E3D4] hover:text-[#9ABF80] px-4 py-2 
                           rounded-lg transition-all duration-300 text-sm font-medium
                           hover:bg-[#6A669D]/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#9ABF80] hover:bg-[#9ABF80]/90 text-black 
                           px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium
                           hover:scale-105 hover:shadow-lg hover:shadow-[#9ABF80]/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;