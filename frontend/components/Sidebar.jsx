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
  Sprout,
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
    { name: 'Crop Analysis', href: '/crop-advisor', icon: Sprout },
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
      <div className="fixed left-4 right-4 top-4 z-50 flex h-16 items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] lg:hidden">
        <NavLink to="/" className="flex items-center gap-3" onClick={closeOnMobile}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <Logo className="h-10 w-10" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Flocksy</p>
            <p className="text-sm text-slate-700">Farm operations</p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-700"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-sidebar text-slate-700 transition-all duration-300 ${
          isOpen ? 'w-72 translate-x-0' : 'w-24 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className={`hidden items-center border-b border-slate-200 px-5 py-5 lg:flex ${isOpen ? 'justify-between' : 'justify-center'}`}>
          <NavLink to="/" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <Logo className="h-12 w-12" />
            </div>
            {isOpen && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Flocksy</p>
                <h1 className="text-xl font-semibold text-slate-900">Operations</h1>
              </div>
            )}
          </NavLink>

          {isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:text-slate-900"
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
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  } ${isOpen ? 'gap-3' : 'justify-center'}`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span className="text-sm font-medium">{name}</span>}
              </NavLink>
            ))}
          </nav>

          {isOpen && isChatPage && (
            <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-[#3D5438] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3D5438]/20 transition hover:bg-[#2C3A29]"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 text-sm outline-none transition focus:border-[#8E9B44]/40"
                />
              </div>

              <div className="space-y-1">
                {chatTools.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
                  >
                    <Icon className="h-4 w-4" />
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`border-t border-slate-200 p-4 ${isOpen ? '' : 'flex justify-center'}`}>
          {isOpen && (
            <div className="mb-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Account</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.farmName || user.location}</p>
            </div>
          )}

          <div className={`flex ${isOpen ? 'gap-2' : 'flex-col gap-2'}`}>
            {isOpen && (
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}

            <NavLink
              to="/dashboard"
              onClick={closeOnMobile}
              className={`flex items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 ${
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
