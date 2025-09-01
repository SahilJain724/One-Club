import { useState, useContext, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiList } from 'react-icons/fi';

import searchImage from '../../../assets/search.png';
import logoImage from '../../../assets/oneClubtrans.png';

import { searchContext } from '../../../Contexts/SearchContext';
import { AuthContext } from '../../../Contexts/AuthContext';
import Sidebar from '../Home_components/Sidebar';
import CustomToastContainer from '../Utils/CustomToastContainer';

const Navbar = () => {
  
  const [visible, setVisible] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { navigate, setIsSearchVisible, searchText, setSearchText } = useContext(searchContext);
  const [toastMessages, setToastMessages] = useState([]);
  const role = localStorage.getItem('role');
  const location = useLocation();

  // ---------------------- Toast Effects ----------------------
  useEffect(() => {
    // Initial toasts
    toast.success('Welcome to One Club!', { toastId: 'welcome-toast' });
    toast.warn('Test warning message!', { toastId: 'test-warning' });
    toast.error('Test error message!', { toastId: 'test-error' });

    const updateToastMessages = (toast) => {
      const now = Date.now();
      setToastMessages([
        {
          tId: toast.tId || toast.id || `toast-${now}`,
          message: toast.content || toast.message || 'No content',
          type: toast.type || 'info',
          timestamp: now,
        },
      ]);
    };

    // Subscribe to toast events
    const unsubscribe = toast.onChange((payload) => {
      if (payload.status === 'added') updateToastMessages(payload);
    });

    return () => unsubscribe();
  }, []);

  // Periodic cleanup of old toast messages
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setToastMessages((prev) => prev.filter((msg) => now - msg.timestamp < 2000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    toast.success('Logged out successfully', { toastId: 'logout-toast' });
  };

  
  const latestMessageType = toastMessages.length
    ? toastMessages[toastMessages.length - 1].type
    : null;
const navbarClass =
  latestMessageType === 'success'
    ? 'bg-green-500'
    : latestMessageType === 'error'
    ? 'bg-red-500'
    : 'bg-white';


 
  return (
    <div className="flex flex-col shadow-md duration-200 relative z-40">

      {/* Upper Navbar: Logo + Navigation + Icons */}
      <div className="bg-black flex items-center py-3 px-6 md:px-12 lg:px-20 relative">

        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/">
            <img
              src={logoImage}
              className="w-16 rounded-3xl cursor-pointer transform scale-225"
              alt="OneClub Logo"
            />
          </NavLink>
        </div>

        {/* Navigation Links (Centered) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex justify-center gap-8 text-sm text-white">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 group ${isActive ? 'text-blue-400' : ''}`
                }
              >
                <p className="font-semibold transition-colors duration-200">HOME</p>
                <hr className="w-0 group-hover:w-3/4 border-none h-[2px] bg-white transition-all duration-300" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/Collections"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 group ${isActive ? 'text-blue-400' : ''}`
                }
              >
                <p className="font-semibold transition-colors duration-200">COLLECTION</p>
                <hr className="w-0 group-hover:w-3/4 border-none h-[2px] bg-white transition-all duration-300" />
              </NavLink>
            </li>

            {role === 'ROLE_USER' && (
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 group ${isActive ? 'text-blue-400' : ''}`
                  }
                >
                  <p className="font-semibold transition-colors duration-200">CART</p>
                  <hr className="w-0 group-hover:w-3/4 border-none h-[2px] bg-white transition-all duration-300" />
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Icons (Right) */}
        <div className="flex items-center gap-6 ml-auto">

          {/* Search Input only on /Collections */}
          {location.pathname === '/Collections' && (
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                className="text-sm w-40 md:w-48 group-hover:w-64 transition-all duration-300 rounded-full border-2 border-white bg-gray-800 text-white px-4 py-1.5 focus:outline-none focus:border-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setIsSearchVisible(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/Collections?search=${searchText}`);
                }}
              />
              <img
                src={searchImage}
                alt="Search Icon"
                className="w-5 cursor-pointer invert absolute top-1/2 -translate-y-1/2 right-3"
                onClick={() => setIsSearchVisible(true)}
              />
            </div>
          )}

          {/* Sidebar Toggle */}
          <FiList
            className="w-6 h-6 cursor-pointer text-white hover:text-gray-200 transition-colors duration-200"
            onClick={() => setVisible(true)}
          />
          <Sidebar
            visible={visible}
            setVisible={setVisible}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      {/* Lower Navbar: Toast Messages */}
      <div className={`py-2 px-4 text-center relative ${navbarClass}`}>
        <CustomToastContainer messages={toastMessages} />
      </div>
    </div>
  );
};

export default Navbar;
