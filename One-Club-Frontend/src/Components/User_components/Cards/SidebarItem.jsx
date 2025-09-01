import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex justify-between items-center 
                 rounded-xl border border-white/20 
                 bg-white/10 backdrop-blur-md 
                 shadow-md hover:shadow-xl
                 transition-all duration-300 
                 hover:scale-105 hover:bg-white/20 
                 text-gray-200 hover:text-white p-4"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[16px] font-medium">{label}</span>
      </div>
    </NavLink>
  );
};

export default SidebarItem;
