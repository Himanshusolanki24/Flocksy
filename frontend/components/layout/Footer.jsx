import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const translations = {
  en: {
    made: 'Made for farmers',
    rights: 'All rights reserved.',
  },
  hi: {
    made: 'किसानों के लिए बनाया गया',
    rights: 'सर्वाधिकार सुरक्षित।',
  },
};

const Footer = ({ language }) => {
  const footerRef = useRef(null);
  const t = translations[language];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: footerRef.current,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-primary text-white py-8 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐔</span>
            <span className="font-semibold">Flockshy AI</span>
          </div>

          <p className="text-green-200 text-center">
            {t.made} ❤️ | © 2026 {t.rights}
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-green-200 hover:text-white transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-green-200 hover:text-white transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-green-200 hover:text-white transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
