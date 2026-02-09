import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">JuicyPro</Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
          <Link to="/products" className="text-gray-600 hover:text-indigo-600">Products</Link>
          {token ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-indigo-600">Profile</Link>
              {user.is_admin && <Link to="/admin" className="text-red-600 hover:text-red-800">Admin</Link>}
              <button onClick={handleLogout} className="text-gray-600 hover:text-indigo-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-gray-50 border-t">
          <Link to="/" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Products</Link>
          {token ? (
            <>
              <Link to="/profile" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Profile</Link>
              {user.is_admin && <Link to="/admin" className="block text-red-600 hover:text-red-800 py-2" onClick={() => setIsOpen(false)}>Admin</Link>}
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left text-gray-600 hover:text-indigo-600 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block text-indigo-600 font-medium py-2" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
