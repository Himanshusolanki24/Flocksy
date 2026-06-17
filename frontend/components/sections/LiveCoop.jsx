import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Card, Badge } from '../ui';

const translations = {
  en: {
    title: 'Live Coop Monitor',
    subtitle: 'Real-time health status of your flock',
    healthy: 'Healthy',
    warning: 'Warning',
    sick: 'Sick - Needs Attention',
    view: 'View Details',
    isolate: 'Isolate',
    feed: 'Check Feed',
    water: 'Check Water',
  },
  hi: {
    title: 'लाइव कूप मॉनिटर',
    subtitle: 'आपके झुंड की वास्तविक समय स्वास्थ्य स्थिति',
    healthy: 'स्वस्थ',
    warning: 'चेतावनी',
    sick: 'बीमार - ध्यान चाहिए',
    view: 'विवरण देखें',
    isolate: 'अलग करें',
    feed: 'चारा जांचें',
    water: 'पानी जांचें',
  },
};

const birdData = [
  { id: 1, name: 'B1', status: 'healthy', temp: 41.2, activity: 95 },
  { id: 2, name: 'B2', status: 'healthy', temp: 41.5, activity: 92 },
  { id: 3, name: 'B3', status: 'warning', temp: 42.1, activity: 78 },
  { id: 4, name: 'B4', status: 'healthy', temp: 41.3, activity: 94 },
  { id: 5, name: 'B5', status: 'sick', temp: 43.5, activity: 45 },
  { id: 6, name: 'B6', status: 'healthy', temp: 41.4, activity: 96 },
  { id: 7, name: 'B7', status: 'warning', temp: 42.3, activity: 72 },
  { id: 8, name: 'B8', status: 'healthy', temp: 41.1, activity: 98 },
  { id: 9, name: 'B9', status: 'healthy', temp: 41.6, activity: 91 },
  { id: 10, name: 'B10', status: 'healthy', temp: 41.2, activity: 95 },
  { id: 11, name: 'B11', status: 'sick', temp: 43.8, activity: 38 },
  { id: 12, name: 'B12', status: 'healthy', temp: 41.3, activity: 93 },
];

const statusConfig = {
  healthy: { color: 'bg-[#6FCF97]/120', glow: 'shadow-green-500/50', icon: '✅' },
  warning: { color: 'bg-[#6FCF97]', glow: 'shadow-yellow-500/50', icon: '⚠️' },
  sick: { color: 'bg-[#1F6F5F]/80', glow: 'shadow-red-500/50', icon: '🔴' },
};

const LiveCoop = ({ language }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const [selectedBird, setSelectedBird] = useState(null);
  const t = translations[language];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      const birds = gsap.utils.toArray('.bird-icon');
      gsap.from(birds, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3,
      });

      // Floating animation for all birds
      birds.forEach((bird, i) => {
        gsap.to(bird, {
          y: -8,
          duration: 2 + (i % 3) * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: i * 0.2,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const handleBirdClick = (bird) => {
    setSelectedBird(selectedBird?.id === bird.id ? null : bird);
  };

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {birdData.map((bird) => {
            const config = statusConfig[bird.status];
            return (
              <div key={bird.id} className="flex flex-col items-center">
                {/* Bird Icon */}
                <button
                  className={`
                    bird-icon w-16 h-16 sm:w-20 sm:h-20 rounded-full
                    ${config.color} flex items-center justify-center
                    shadow-lg ${config.glow}
                    transition-all duration-300
                    hover:scale-110 cursor-pointer
                    ${bird.status === 'sick' ? 'animate-pulse' : ''}
                  `}
                  onClick={() => handleBirdClick(bird)}
                >
                  <span className="text-2xl sm:text-3xl">{config.icon}</span>
                </button>

                {/* Bird Name */}
                <span className="mt-2 text-sm font-semibold text-gray-700">
                  {bird.name}
                </span>

                {/* Popup Card */}
                {selectedBird?.id === bird.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F6F5F]/50">
                    <Card className="max-w-sm w-full" hover={false}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-primary">
                          Bird {bird.name}
                        </h3>
                        <button
                          onClick={() => setSelectedBird(null)}
                          className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>

                      <Badge
                        status={bird.status}
                        size="lg"
                        pulse={bird.status === 'sick'}
                      />

                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature:</span>
                          <span className="font-semibold">
                            {bird.temp}°C
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Activity:</span>
                          <span className="font-semibold">
                            {bird.activity}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-2">
                        {bird.status === 'sick' && (
                          <>
                            <Button variant="danger" size="md">
                              🚨 {t.isolate}
                            </Button>
                            <Button variant="outline" size="md">
                              🩺 {t.vet}
                            </Button>
                          </>
                        )}
                        {bird.status === 'warning' && (
                          <>
                            <Button variant="accent" size="md">
                              🌾 {t.feed}
                            </Button>
                            <Button variant="secondary" size="md">
                              💧 {t.water}
                            </Button>
                          </>
                        )}
                        {bird.status === 'healthy' && (
                          <Button variant="secondary" size="md" disabled>
                            ✅ {t.healthy}
                          </Button>
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <Card className="text-center" hover={false}>
            <div className="text-3xl font-bold text-[#2FA084]">
              {birdData.filter(b => b.status === 'healthy').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Healthy</div>
          </Card>
          <Card className="text-center" hover={false}>
            <div className="text-3xl font-bold text-[#2FA084]">
              {birdData.filter(b => b.status === 'warning').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Warning</div>
          </Card>
          <Card className="text-center" hover={false}>
            <div className="text-3xl font-bold text-[#1F6F5F]">
              {birdData.filter(b => b.status === 'sick').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Sick</div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveCoop;
