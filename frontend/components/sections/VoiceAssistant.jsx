import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Card, Button } from '../ui';

const translations = {
  en: {
    title: 'Voice Assistant',
    listening: 'Listening...',
    tap: 'Tap microphone and speak',
    example: 'Try saying: "My chicken is not eating"',
    processing: 'Processing...',
    response: 'AI Response',
  },
  hi: {
    title: 'वॉइस असिस्टेंट',
    listening: 'सुन रहा हूँ...',
    tap: 'माइक पर टैप करें और बोलें',
    example: 'कहकर देखें: "मेरी मुर्गी नहीं खा रही"',
    processing: 'प्रोसेसिंग...',
    response: 'AI प्रतिक्रिया',
  },
};

const VoiceAssistant = ({ language, onTranscript }) => {
  const sectionRef = useRef(null);
  const micButtonRef = useRef(null);
  const pulseRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from(micButtonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out(1.7)',
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isListening) {
      // Pulsing animation
      gsap.to(pulseRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power2.out',
      });

      // Simulate transcription
      const timer = setTimeout(() => {
        const sampleText =
          language === 'hi'
            ? 'मेरी मुर्गी नहीं खा रही है और सुस्त लग रही है'
            : 'My chicken is not eating and seems lethargic';
        setTranscribedText(sampleText);
        setIsListening(false);
        setIsProcessing(true);

        // Simulate AI response
        setTimeout(() => {
          const sampleResponse =
            language === 'hi'
              ? 'लक्षणों के आधार पर, यह तनाव या संक्रमण का संकेत हो सकता है। पक्षी को अलग करें, ताजा पानी दें, और यदि 24 घंटों में सुधार नहीं होता तो पशु चिकित्सक से संपर्क करें।'
              : 'Based on the symptoms, this could indicate stress or infection. Isolate the bird, provide fresh water, and contact a vet if no improvement in 24 hours.';
          setAiResponse(sampleResponse);
          setIsProcessing(false);
          onTranscript?.(sampleText, sampleResponse);
        }, 2000);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      gsap.killTweensOf(pulseRef.current);
      gsap.set(pulseRef.current, { scale: 1, opacity: 1 });
    }
  }, [isListening, language]);

  const handleMicClick = () => {
    if (!isListening && !isProcessing) {
      setIsListening(true);
      setTranscribedText('');
      setAiResponse('');
    }
  };

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="text-center" hover={false}>
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            {t.title}
          </h2>
          <p className="text-gray-600 mb-8">
            {isListening ? t.listening : t.tap}
          </p>

          {/* Microphone Button */}
          <div className="relative flex justify-center mb-8">
            {/* Pulse rings */}
            {isListening && (
              <>
                <div
                  ref={pulseRef}
                  className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-green-400 opacity-50"
                />
                <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-green-300 opacity-30 animate-ping" />
              </>
            )}

            {/* Main button */}
            <button
              ref={micButtonRef}
              onClick={handleMicClick}
              disabled={isProcessing}
              className={`
                relative w-24 h-24 sm:w-32 sm:h-32 rounded-full
                flex items-center justify-center
                shadow-2xl transition-all duration-300
                ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : isProcessing
                    ? 'bg-yellow-500 cursor-wait'
                    : 'bg-primary hover:bg-green-700'
                }
              `}
            >
              <span className="text-5xl sm:text-6xl">
                {isProcessing ? '⏳' : isListening ? '🔴' : '🎤'}
              </span>
            </button>
          </div>

          {/* Example text */}
          {!transcribedText && !isProcessing && (
            <p className="text-gray-500 text-sm mb-4">{t.example}</p>
          )}

          {/* Transcribed text */}
          {transcribedText && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <p className="text-gray-800 text-lg">{transcribedText}</p>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="mb-6 flex items-center justify-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span className="ml-2">{t.processing}</span>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="text-left">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <span>🤖</span>
                {t.response}
              </h3>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <p className="text-gray-800 leading-relaxed">{aiResponse}</p>
              </div>
            </div>
          )}

          {/* Reset button */}
          {aiResponse && (
            <Button
              variant="outline"
              size="md"
              className="mt-6"
              onClick={() => {
                setTranscribedText('');
                setAiResponse('');
              }}
            >
              🔄 Try Again
            </Button>
          )}
        </Card>
      </div>
    </section>
  );
};

export default VoiceAssistant;
