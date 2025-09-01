import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogoImage from '../../assets/oneClubtrans.png';
import AddItems from './AddItems';
import VendorProducts from './VendorProducts';

const Vendor = () => {
    const [activeSection, setActiveSection] = useState('product');

    const sections = [
        { id: 'product', label: 'My Products' },
        { id: 'add', label: 'Add Items' },
    ];

    return (
        <div className="flex flex-col h-screen bg-black relative">
            {/* Navbar */}
            <div className="bg-black flex items-center py-3 px-6 md:px-12 lg:px-20 relative">
                {/* Logo */}
                <div className="flex items-center">
                    <NavLink to="/">
                        <img
                            src={LogoImage}
                            className="w-16 rounded-3xl cursor-pointer transform scale-225"
                            alt="OneClub Logo"
                        />
                    </NavLink>
                </div>

                {/* Centered Navigation */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <ul className="flex justify-center gap-8 text-sm text-white">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <button
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex flex-col items-center gap-1 group ${activeSection === section.id ? 'text-blue-400' : ''
                                        }`}
                                >
                                    <p className="font-semibold transition-colors duration-200">
                                        {section.label.toUpperCase()}
                                    </p>
                                    <hr className="w-0 group-hover:w-3/4 border-none h-[2px] bg-white transition-all duration-300" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right-side Action */}
                <div className="flex items-center gap-4 ml-auto">
                    <NavLink to="/">
                        <button 
                        className="bg-gradient-to-r from-blue-700 to-blue-900 hover:scale-103 duration-200 text-white py-1 px-6 rounded-full"
                    >
                            EXIT
                        </button>
                    </NavLink>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 bg-gray-50 overflow-auto">
                {activeSection === 'product' && <VendorProducts />}
                {activeSection === 'add' && <AddItems />}
            </div>
        </div>
    );
};

export default Vendor;
