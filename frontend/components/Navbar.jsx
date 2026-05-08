import React, { useState, useEffect } from 'react';
import { LeafIcon, MenuIcon, XIcon } from './Icons';

export const Navbar = ({ user, onLoginClick, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'AI Assistant', href: '#chatbot' },
    { name: 'Vet Doctors', href: '#vets' },
    { name: 'Crop Advisor', href: '#crop' },
    ...(user ? [{ name: 'Dashboard', href: '#dashboard' }] : []),
  ];

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <div className="bg-green-dark p-2 rounded-lg">
              <LeafIcon className="w-6 h-6 text-saffron" />
            </div>
            <span className={`text-2xl font-serif font-bold ${isScrolled ? 'text-green-dark' : 'text-green-dark drop-shadow-sm'}`}>KisanCare</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`font-semibold hover:text-saffron transition-colors ${isScrolled ? 'text-gray-700' : 'text-gray-800'}`}
              >
                {link.name}
              </a>
            ))}

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-cream text-green-dark px-4 py-2 rounded-full font-bold hover:bg-green-mid hover:text-white transition-colors border border-green-mid/20"
                >
                  {user.name} <span className="text-xs">▼</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                    <a href="#dashboard" className="block px-4 py-2 text-gray-700 hover:bg-cream" onClick={() => setIsProfileOpen(false)}>Dashboard</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-cream">Profile Settings</a>
                    <button 
                      onClick={() => { onLogout(); setIsProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-green-dark hover:bg-green-mid text-white px-6 py-2 rounded-full font-bold transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={isScrolled ? 'text-gray-800' : 'text-gray-900'}>
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="block px-3 py-3 text-base font-semibold text-gray-800 hover:bg-cream rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {!user ? (
              <button 
                onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                className="w-full mt-4 bg-green-dark text-white px-3 py-3 rounded-xl font-bold"
              >
                Login / Sign Up
              </button>
            ) : (
              <button 
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full mt-4 border border-red-200 text-red-600 px-3 py-3 rounded-xl font-bold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
