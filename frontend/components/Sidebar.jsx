import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Bot,
  ChevronLeft,
  Files,
  Globe,
  History,
  Library,
  Home,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,

  Stethoscope,
} from 'lucide-react';
import Logo from './Logo';
export const Sidebar = ({ user, isOpen, setIsOpen }) => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chatbot';

  const navLinks = [
    { name: 'Overview', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Assistant', href: '/chatbot', icon: Bot },
    { name: 'Vet Network', href: '/vets', icon: Stethoscope },

  ];
  const chatTools = [
    { name: 'Explore', icon: Globe },
    { name: 'Library', icon: Library },
    { name: 'Files', icon: Files },
    { name: 'History', icon: History },
  ];

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="fixed left-4 right-4 top-4 z-50 flex h-16 items-center justify-between rounded-3xl border border-[#1F6F5F]/10 bg-white px-4 shadow-[0_8px_24px_rgba(31,111,95,0.1)] lg:hidden">
        <NavLink to="/" className="flex items-center gap-3" onClick={closeOnMobile}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6FCF97]/18">
            <Logo className="h-10 w-10" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2FA084]/70">Flocksy</p>
            <p className="text-sm text-[#1F6F5F]">Farm operations</p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-2xl border border-[#1F6F5F]/10 bg-[#EEEEEE] p-2 text-[#1F6F5F]"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#1F6F5F]/20 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#1F6F5F]/10 bg-sidebar text-[#1F6F5F]/70 transition-all duration-300 ${
          isOpen ? 'w-72 translate-x-0' : 'w-24 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className={`hidden items-center border-b border-[#1F6F5F]/10 px-5 py-5 lg:flex ${isOpen ? 'justify-between' : 'justify-center'}`}>
          <NavLink to="/" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6FCF97]/18">
              <Logo className="h-12 w-12" />
            </div>
            {isOpen && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2FA084]/70">Flocksy</p>
                <h1 className="text-xl font-semibold text-[#1F6F5F]">Operations</h1>
              </div>
            )}
          </NavLink>

          {isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-2xl border border-[#1F6F5F]/10 bg-[#EEEEEE] p-2 text-[#1F6F5F]/60 transition hover:text-[#1F6F5F]"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-2">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <NavLink
                key={name}
                to={href}
                title={!isOpen ? name : ''}
                onClick={closeOnMobile}
                className={({ isActive }) =>
                  `group flex items-center rounded-2xl px-3 py-3 transition ${
                    isActive
                      ? 'bg-[#6FCF97]/20 text-[#1F6F5F]'
                      : 'text-[#1F6F5F]/55 hover:bg-[#EEEEEE] hover:text-[#1F6F5F]'
                  } ${isOpen ? 'gap-3' : 'justify-center'}`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span className="text-sm font-medium">{name}</span>}
              </NavLink>
            ))}
          </nav>

          {isOpen && isChatPage && (
            <div className="mt-6 space-y-4 border-t border-[#1F6F5F]/10 pt-5">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-[#1F6F5F] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1F6F5F]/20 transition hover:bg-[#2FA084]"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New chat
                </span>
                <span className="text-[10px] opacity-60">⌘K</span>
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-xl border border-[#1F6F5F]/10 bg-white px-9 py-2 text-sm outline-none transition focus:border-[#6FCF97]"
                />
              </div>

              <div className="space-y-1">
                {chatTools.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#1F6F5F]/65 transition hover:bg-white hover:text-[#1F6F5F]"
                  >
                    <Icon className="h-4 w-4" />
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`border-t border-[#1F6F5F]/10 p-4 ${isOpen ? '' : 'flex justify-center'}`}>
          {isOpen && (
            <div className="mb-4 rounded-[24px] border border-[#1F6F5F]/10 bg-[#EEEEEE]/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2FA084]/70">Account</p>
              <p className="mt-2 text-sm font-semibold text-[#1F6F5F]">{user.name}</p>
              <p className="text-sm text-[#1F6F5F]/55">{user.farmName || user.location}</p>
            </div>
          )}

          <div className={`flex ${isOpen ? 'gap-2' : 'flex-col gap-2'}`}>
            {isOpen && (
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1F6F5F]/10 bg-white text-[#1F6F5F]/55 transition hover:text-[#1F6F5F]"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}

            <NavLink
              to="/dashboard"
              onClick={closeOnMobile}
              className={`flex items-center justify-center rounded-2xl bg-[#1F6F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2FA084] ${
                isOpen ? 'flex-1 gap-2' : 'h-12 w-12 px-0'
              }`}
              title={!isOpen ? 'Dashboard' : ''}
            >
              <LayoutDashboard className="h-4 w-4" />
              {isOpen && 'Open Dashboard'}
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
