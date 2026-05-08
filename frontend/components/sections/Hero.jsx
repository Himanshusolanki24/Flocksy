import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '../ui';

const translations = {
  en: {
    heading: 'Healthy Birds, Happy Farm',
    subtext: 'AI-powered poultry care for every farmer',
    scan: 'Scan Bird',
    speak: 'Speak Problem',
  },
  hi: {
    heading: 'स्वस्थ पक्षी, खुश फार्म',
    subtext: 'हर किसान के लिए AI-संचालित पोल्ट्री देखभाल',
    scan: 'पक्षी स्कैन करें',
    speak: 'समस्या बताएं',
  },
};

const Hero = ({ language, onScan, onSpeak }) => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonsRef = useRef(null);
  const illustrationRef = useRef(null);

  const t = translations[language];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .from(subtextRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-0.4')
      .from(buttonsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-0.4')
      .from(illustrationRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, '-0.6');

      // Floating animation for illustration
      gsap.to(illustrationRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1
              ref={headingRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight"
            >
              {t.heading}
            </h1>
            <p
              ref={subtextRef}
              className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl"
            >
              {t.subtext}
            </p>
            <div
              ref={buttonsRef}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Button
                variant="primary"
                size="xl"
                icon="📷"
                onClick={onScan}
              >
                {t.scan}
              </Button>
              <Button
                variant="accent"
                size="xl"
                icon="🎤"
                onClick={onSpeak}
              >
                {t.speak}
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div
            ref={illustrationRef}
            className="flex justify-center items-center"
          >
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              {/* Background circles */}
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl" />
              <div className="absolute inset-8 bg-primary/10 rounded-full blur-2xl" />

              {/* Main illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-8xl">🐔</span>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">🌾</span>
                  </div>
                </div>
              </div>

              {/* Floating particles */}
              <div className="absolute top-10 left-10 w-4 h-4 bg-accent rounded-full opacity-60" />
              <div className="absolute bottom-20 right-10 w-3 h-3 bg-secondary rounded-full opacity-60" />
              <div className="absolute top-1/2 right-0 w-2 h-2 bg-primary rounded-full opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
