import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Card, Button, Badge } from '../ui';

const translations = {
  en: {
    diagnosis: 'Diagnosis Result',
    confidence: 'Confidence',
    instructions: 'Recommended Actions',
    why: 'Why this result?',
    isolate: '🚨 Isolate bird immediately',
    water: '💧 Provide clean water',
    feed: '🌾 Check feeding pattern',
    vet: '🩺 Contact veterinarian',
    monitor: '📊 Monitor closely',
    clean: '🧹 Disinfect area',
  },
  hi: {
    diagnosis: 'निदान परिणाम',
    confidence: 'विश्वास',
    instructions: 'अनुशंसित कार्य',
    why: 'यह परिणाम क्यों?',
    isolate: '🚨 पक्षी को तुरंत अलग करें',
    water: '💧 साफ पानी दें',
    feed: '🌾 खाने की जांच करें',
    vet: '🩺 पशु चिकित्सक से संपर्क करें',
    monitor: '📊 करीब से निगरानी करें',
    clean: '🧹 क्षेत्र को कीटाणुमुक्त करें',
  },
};

const DiagnosisCard = ({
  imageUrl,
  status = 'safe',
  confidence = 87,
  language,
  onClose,
}) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const confidenceBarRef = useRef(null);
  const [showWhy, setShowWhy] = useState(false);
  const t = translations[language];

  const statusConfig = {
    safe: { label: 'SAFE', color: 'green', message: 'Bird appears healthy' },
    warning: { label: 'WARNING', color: 'yellow', message: 'Some concerns detected' },
    danger: { label: 'DANGER', color: 'red', message: 'Immediate action needed' },
  };

  const currentStatus = statusConfig[status];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the card
      gsap.from(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      });

      // Image reveal
      gsap.from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
      });

      // Confidence bar animation
      gsap.from(confidenceBarRef.current, {
        width: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, [status, confidence]);

  const getInstructions = () => {
    if (status === 'danger') {
      return [t.isolate, t.vet, t.clean, t.monitor];
    }
    if (status === 'warning') {
      return [t.water, t.feed, t.monitor];
    }
    return [t.monitor, t.feed, t.water];
  };

  return (
    <Card ref={cardRef} className="max-w-2xl mx-auto" hover={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-primary">{t.diagnosis}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div>
          <div
            ref={imageRef}
            className="relative rounded-xl overflow-hidden shadow-lg aspect-square"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Scanned bird"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-6xl">🐔</span>
              </div>
            )}

            {/* Status Overlay */}
            <div
              className={`
                absolute top-4 right-4 px-4 py-2 rounded-full
                bg-white shadow-lg font-bold
                ${
                  status === 'danger'
                    ? 'text-[#1F6F5F]'
                    : status === 'warning'
                    ? 'text-[#2FA084]'
                    : 'text-[#2FA084]'
                }
              `}
            >
              {currentStatus.label}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Status Badge */}
          <Badge status={status} size="lg" pulse={status === 'danger'} />

          {/* Message */}
          <p className="text-gray-700 text-lg">{currentStatus.message}</p>

          {/* Confidence */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t.confidence}</span>
              <span className="font-bold text-primary">{confidence}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                ref={confidenceBarRef}
                className={`
                  h-full rounded-full transition-all
                  ${
                    status === 'danger'
                      ? 'bg-[#1F6F5F]/80'
                      : status === 'warning'
                      ? 'bg-[#6FCF97]'
                      : 'bg-[#6FCF97]/120'
                  }
                `}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              {t.instructions}
            </h4>
            <ul className="space-y-2">
              {getInstructions().map((instruction, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          {/* Why this result */}
          <div>
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="flex items-center gap-2 text-primary font-semibold hover:text-[#2FA084] transition-colors"
            >
              <span>{t.why}</span>
              <span
                className={`transition-transform ${showWhy ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </button>

            {showWhy && (
              <div className="mt-3 p-4 bg-[#6FCF97]/12 rounded-xl text-sm text-gray-700">
                <p>
                  Our AI analyzed the bird's appearance, behavior patterns, and
                  physical characteristics. The diagnosis is based on:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Feather condition and coloration</li>
                  <li>Eye clarity and alertness</li>
                  <li>Body posture and movement</li>
                  <li>Visible symptoms or abnormalities</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DiagnosisCard;
