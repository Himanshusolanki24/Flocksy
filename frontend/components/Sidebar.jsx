import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronLeft,
  ClipboardPlus,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Sprout,
  Stethoscope,
  Bot,
} from 'lucide-react';
import Logo from './Logo';

export const Sidebar = ({ user, isOpen, setIsOpen }) => {
  const navLinks = [
    { name: 'Overview', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chatbot', href: '/chatbot', icon: Bot },
    { name: 'Diagnosis', href: '/diagnosis', icon: ClipboardPlus },
    { name: 'Vet Network', href: '/vets', icon: Stethoscope },
    { name: 'Crop Analysis', href: '/crop-advisor', icon: Sprout },
  ];

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ─── Mobile Top Bar ─── */}
      <div className="fixed left-3 right-3 top-3 z-50 flex h-14 items-center justify-between rounded-2xl border bg-white/90 px-4 backdrop-blur-xl lg:hidden"
        style={{ borderColor: 'rgba(91, 123, 94, 0.1)', boxShadow: '0 4px 20px rgba(27, 58, 45, 0.06)' }}
      >
        <NavLink to="/" className="flex items-center gap-2.5" onClick={closeOnMobile}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest/5">
            <Logo className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B8F80]">Flocksy</p>
            <p className="text-xs font-medium text-forest">Farm Ops</p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border bg-[#F5F8F2] text-forest transition hover:bg-forest hover:text-white"
          style={{ borderColor: 'rgba(91, 123, 94, 0.1)' }}
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* ─── Overlay ─── */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-forest-deep/15 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300 ${
          isOpen ? 'w-64 translate-x-0' : 'w-[72px] -translate-x-full lg:translate-x-0'
        }`}
        style={{ borderColor: 'rgba(91, 123, 94, 0.08)' }}
      >
        {/* Header */}
        <div className={`hidden items-center border-b px-4 py-4 lg:flex ${isOpen ? 'justify-between' : 'justify-center'}`}
          style={{ borderColor: 'rgba(91, 123, 94, 0.08)' }}
        >
          <NavLink to="/" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/5">
              <Logo className="h-9 w-9" />
            </div>
            {isOpen && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7B8F80]">Flocksy</p>
                <h1 className="font-display text-lg font-semibold text-forest">Operations</h1>
              </div>
            )}
          </NavLink>

          {isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border bg-[#F5F8F2] text-[#7B8F80] transition hover:text-forest"
              style={{ borderColor: 'rgba(91, 123, 94, 0.1)' }}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <NavLink
                key={name}
                to={href}
                title={!isOpen ? name : ''}
                onClick={closeOnMobile}
                className={({ isActive }) =>
                  `group flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-forest/8 font-semibold text-forest'
                      : 'text-[#7B8F80] hover:bg-[#F0F5ED] hover:text-forest'
                  } ${isOpen ? 'gap-3' : 'justify-center'}`
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {isOpen && <span>{name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className={`border-t p-3 ${isOpen ? '' : 'flex justify-center'}`}
          style={{ borderColor: 'rgba(91, 123, 94, 0.08)' }}
        >
          {isOpen && (
            <div className="mb-3 rounded-xl border bg-[#F5F8F2] p-3.5"
              style={{ borderColor: 'rgba(91, 123, 94, 0.08)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B8F80]">Account</p>
              <p className="mt-1.5 text-sm font-semibold text-forest">{user.name}</p>
              <p className="text-xs text-[#7B8F80]">{user.farmName || user.location}</p>
            </div>
          )}

          <div className={`flex ${isOpen ? 'gap-2' : 'flex-col gap-2'}`}>
            {isOpen && (
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-[#7B8F80] transition hover:text-forest"
                style={{ borderColor: 'rgba(91, 123, 94, 0.1)' }}
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}

            <NavLink
              to="/dashboard"
              onClick={closeOnMobile}
              className={`flex items-center justify-center rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-forest-deep hover:shadow-md ${
                isOpen ? 'flex-1 gap-2' : 'h-10 w-10 px-0'
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
