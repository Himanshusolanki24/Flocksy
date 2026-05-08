import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Button } from '../ui';

const translations = {
  en: {
    home: 'Home',
    scan: 'Scan',
    help: 'Help',
    vet: 'Vet',
  },
  hi: {
    home: 'होम',
    scan: 'स्कैन',
    help: 'मदद',
    vet: 'पशु चिकित्सक',
  },
};

const Navbar = ({ language, setLanguage }) => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from(logoRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = translations[language];

  return (
    <nav
      ref={navRef}
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white/95 backdrop-blur-sm
        transition-all duration-300
        ${isScrolled ? 'shadow-lg' : 'shadow-md'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-3xl">🐔</span>
            </div>
            <span className="text-2xl font-bold text-primary">Flockshy</span>
          </div>

          {/* Nav Items - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="md">{t.home}</Button>
            <Button variant="ghost" size="md">{t.scan}</Button>
            <Button variant="ghost" size="md">{t.help}</Button>
            <Button variant="ghost" size="md">{t.vet}</Button>
          </div>

          {/* Language Toggle & Mobile Nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-full bg-green-100 text-primary font-semibold hover:bg-green-200 transition-colors"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
