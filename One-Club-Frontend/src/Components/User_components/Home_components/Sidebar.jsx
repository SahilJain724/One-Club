import { useContext, useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { CgProfile } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { RiAdminLine } from "react-icons/ri";
import { IoIosLogIn } from "react-icons/io";
import SidebarItem from '../Cards/SidebarItem';
import { LoginContext } from '../../../Contexts/LoginContext';
import indiaFlag from "../../../assets/india.png";

const Sidebar = ({ visible, setVisible }) => {
  const { isLoggedIn } = useContext(LoginContext);
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');

  useEffect(() => {
    setRole(localStorage.getItem('role') || '');
  }, [isLoggedIn]);

  // 🔹 Define all possible menu items with allowed roles
  const menuItems = [
    { to: "/Profile", icon: <CgProfile />, label: "MY PROFILE", roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_VENDOR"] },
    { to: "/Admin", icon: <RiAdminLine />, label: "ADMIN PANEL", roles: ["ROLE_ADMIN"] },
    { to: "/Vendor", icon: <RiAdminLine />, label: "VENDOR PANEL", roles: ["ROLE_VENDOR"] },
    { to: "/Favorite", icon: <FaRegHeart />, label: "FAVOURITES", roles: ["ROLE_USER"] },
    { to: "/OrderHistory", icon: <GoClock />, label: "ORDER HISTORY", roles: ["ROLE_USER"] },
  ];

  return (
    <div
      className={`fixed top-0 right-0 h-screen z-50 transition-all duration-300 ease-in-out overflow-hidden 
                  ${visible ? 'w-[220px]' : 'w-0'}
                  bg-black/40 backdrop-blur-lg border border-white/20 shadow-lg`}
    >
      <div className="flex flex-col text-gray-700 h-full">
        {/* Sidebar header */}
        <button
          onClick={() => setVisible(false)}
          className="flex items-center gap-3 p-3 w-full border-b border-white/20 text-white font-semibold bg-black/40 backdrop-blur-md"
        >
          <FiChevronLeft className="text-lg font-semibold" />
          <span className="text-lg font-semibold">MENU</span>
        </button>

        {/* Menu items */}
        <div className="flex flex-col gap-2 px-2 py-3">
          {menuItems
            .filter(item => item.roles.includes(role)) // ✅ only render if role is allowed
            .map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                onClick={() => setVisible(false)}
              />
            ))}

          {/* Show LOGIN only when not authenticated */}
          {!localStorage.getItem('token') && (
            <SidebarItem
              to="/login"
              icon={<IoIosLogIn />}
              label="LOGIN"
              onClick={() => setVisible(false)}
            />
          )}
        </div>

        {/* Push footer to bottom */}
        <div className="flex-grow"></div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-lg text-gray-200 p-4">
          <span>Made in</span>
          <img src={indiaFlag} alt="India" className="w-8 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
