import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Card } from '../ui';

const translations = {
  en: {
    scan: 'Scan Bird',
    scanDesc: 'Check bird health with AI',
    voice: 'Voice Help',
    voiceDesc: 'Speak your problem',
    health: 'Check Health',
    healthDesc: 'View flock statistics',
    vet: 'Contact Vet',
    vetDesc: 'Talk to an expert',
  },
  hi: {
    scan: 'पक्षी स्कैन करें',
    scanDesc: 'AI से पक्षी स्वास्थ्य जांचें',
    voice: 'वॉइस मदद',
    voiceDesc: 'अपनी समस्या बताएं',
    health: 'स्वास्थ्य जांचें',
    healthDesc: 'झुंड के आंकड़े देखें',
    vet: 'पशु चिकित्सक से संपर्क',
    vetDesc: 'विशेषज्ञ से बात करें',
  },
};

const actions = [
  { id: 1, icon: '📷', color: 'from-[#1F6F5F] to-[#2FA084]', key: 'scan' },
  { id: 2, icon: '🎤', color: 'from-[#6FCF97] to-[#2FA084]', key: 'voice' },
  { id: 3, icon: '📊', color: 'from-[#2FA084] to-[#1F6F5F]', key: 'health' },
  { id: 4, icon: '🩺', color: 'from-[#1F6F5F] to-[#6FCF97]', key: 'vet' },
];

const QuickActions = ({ language, onAction }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const t = translations[language];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      const cards = gsap.utils.toArray('.action-card');
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Quick Actions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need, one tap away
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <Card
              key={action.id}
              className="action-card cursor-pointer"
              onClick={() => onAction?.(action.key)}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div
                  className={`
                    w-20 h-20 rounded-full
                    bg-gradient-to-br ${action.color}
                    flex items-center justify-center
                    shadow-lg mb-4
                  `}
                >
                  <span className="text-4xl">{action.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800">
                  {t[action.key]}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-2">
                  {t[`${action.key}Desc`]}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
