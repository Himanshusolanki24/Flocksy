import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Chatbot } from './pages/Chatbot';
import { VetDirectory } from './pages/VetDirectory';

import { Dashboard } from './pages/Dashboard';
import Preloader from './components/Preloader';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const demoUser = {
  name: 'Farm Operator',
  farmName: 'Flocksy Demo Farm',
  email: 'demo@flocksy.app',
};

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isChatPage = location.pathname === '/chatbot';
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <div className="min-h-screen bg-app text-[#1F6F5F]">
        {!isLandingPage && (
          <Sidebar
            user={demoUser}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
        )}

        <div
          className={`relative flex min-h-screen flex-col transition-all duration-300 ${
            !isLandingPage && isSidebarOpen ? 'lg:pl-72' : !isLandingPage ? 'lg:pl-24' : ''
          }`}
        >
          <main className={`flex-1 ${isLandingPage ? 'p-0' : isChatPage ? 'p-0 h-screen overflow-hidden' : 'px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-8'}`}>
            <Routes>
              <Route path="/" element={<Home user={demoUser} />} />
              <Route path="/dashboard" element={<Dashboard user={demoUser} />} />
              <Route path="/chatbot" element={<Chatbot user={demoUser} />} />
              <Route path="/vets" element={<VetDirectory />} />

            </Routes>
          </main>

          {!isChatPage && !isLandingPage && <Footer />}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
