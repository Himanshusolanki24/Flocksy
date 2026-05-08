import React, { useEffect, useRef, useState } from 'react';
import { 
  Bot, 
  Globe, 
  Paperclip, 
  Send, 
  Sparkles, 
  Sprout, 
  Stethoscope, 
  Plus, 
  Mic,
  Brain,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { diagnosisApi } from '../src/api';

const quickActions = [
  {
    title: 'Synthesize Data',
    desc: 'Interpret complex farm observations into clear bullet points.',
    icon: Brain,
    prompt: 'Summarize my recent soil test data and provide 3 key recommendations.',
  },
  {
    title: 'Health Check',
    desc: 'Scan symptoms for poultry or livestock concerns.',
    icon: Stethoscope,
    prompt: 'Identify common causes for lethargy in layers during summer months.',
  },
  {
    title: 'Crop Planning',
    desc: 'Get seasonal advice for your specific region.',
    icon: Sprout,
    prompt: 'Create a 4-week management plan for organic wheat in Punjab.',
  },
];

export const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text = input) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;

    const nextMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const data = await diagnosisApi.sendChatQuery(prompt);
      setMessages((prev) => [
        ...prev, 
        { 
          role: 'assistant', 
          content: data.advice || 'I am sorry, I could not generate a response at this time.',
          response: data.response || null,
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I am having trouble connecting to the Flocksy intelligence engine. Please try again later.'
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white shadow-none border-0">
      {/* Main Chat Area */}
      <main className="relative flex flex-1 flex-col bg-white">
        <header className="flex items-center justify-between px-8 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2 text-slate-400">
            <Bot className="h-5 w-5 text-[#8E9B44]" />
            <span className="text-sm font-bold tracking-tight text-slate-900 uppercase">Cortex Assistant</span>
            <div className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">v2.4</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
              <Paperclip className="h-3.5 w-3.5" /> Export chat
            </button>
            <button className="rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-900">
              Upgrade
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-start px-6 py-16">
              {/* 3D Volumetric Glass Blob (High Dimension) */}
              <div className="relative mb-16 flex h-80 w-80 items-center justify-center [perspective:1000px]">
                {/* 1. 3D Floor Shadow Projection */}
                <motion.div
                  className="absolute -bottom-12 h-8 w-48 bg-slate-900/10 blur-3xl rounded-[100%]"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* 2. Deep Ambient Glow (Aura) */}
                <motion.div
                  className="absolute h-full w-full rounded-full bg-[#8E9B44]/20 blur-[100px]"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* 3. The 3D Glass Shell */}
                <motion.div 
                  className="relative h-64 w-64 shadow-[20px_40px_60px_rgba(61,84,56,0.15),inset_-10px_-10px_30px_rgba(255,255,255,0.4),inset_10px_10px_30px_rgba(61,84,56,0.05)] border border-white/40"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ 
                    borderRadius: [
                      "45% 55% 70% 30% / 40% 50% 60% 50%",
                      "55% 45% 30% 70% / 50% 60% 40% 50%",
                      "45% 55% 70% 30% / 40% 50% 60% 50%"
                    ],
                    rotateX: [15, 25, 15],
                    rotateY: [-10, 10, -10],
                    y: [0, -15, 0]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* High-Depth Gradient (Z-Index Volume) */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,#FFFFFF_0%,#E8ECD7_40%,#8E9B44_85%,#3D5438_100%)] opacity-95 rounded-[inherit]" />
                  
                  {/* 4. Multi-Layer Specular Highlights */}
                  {/* Primary Surface Shine */}
                  <div className="absolute top-[8%] left-[15%] h-[25%] w-[45%] rounded-[50%] bg-gradient-to-br from-white/70 to-transparent rotate-[-25deg] blur-[3px]" />
                  
                  {/* Rim Light (Bottom Left Depth) */}
                  <div className="absolute bottom-4 left-4 h-24 w-24 rounded-full border-l-[3px] border-b-[2px] border-white/30 blur-[2px] rotate-[-45deg]" />

                  {/* Top Refractive Sharp Edge */}
                  <div className="absolute top-0 left-0 h-full w-full rounded-[inherit] border-t-[2px] border-r-[1px] border-white/50 mix-blend-overlay" />

                  {/* 5. Volumetric Internal 'Fog' */}
                  <motion.div 
                    className="absolute inset-0 opacity-40 translate-z-10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute top-4 left-4 h-3/4 w-3/4 bg-[#8E9B44]/40 blur-3xl rounded-full" />
                    <div className="absolute bottom-4 right-4 h-1/2 w-1/2 bg-white/30 blur-3xl rounded-full" />
                  </motion.div>

                  {/* 6. Realistic Glass Core Bloom */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-32 w-32 rounded-full bg-white/25 blur-[45px] shadow-[0_0_50px_rgba(255,255,255,0.4)]" />
                  </div>
                </motion.div>
              </div>

              <div className="text-center">
                <h1 className="mt-2 text-5xl font-serif text-slate-950 tracking-tight">How can I assist you today?</h1>
              </div>

              {/* Centered Input Bar */}
              <div className="mt-16 w-full max-w-2xl">
                <div className="relative rounded-[32px] border border-slate-200 bg-[#FBFBFB] p-5 shadow-sm transition-all focus-within:border-[#8E9B44]/40 focus-within:shadow-md">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask me anything..."
                    className="w-full resize-none bg-transparent px-4 text-lg text-slate-800 outline-none placeholder:text-slate-300 min-h-[40px]"
                  />
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 px-2">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 rounded-full bg-[#EBF0E6] px-4 py-1.5 text-xs font-bold text-[#3D5438] transition hover:bg-[#DDE5D6]">
                        <Brain className="h-3.5 w-3.5" /> Deeper Research
                      </button>
                      <button className="p-2 text-slate-400 transition hover:text-[#8E9B44]">
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-2 text-slate-400 transition hover:text-[#8E9B44]">
                        <Globe className="h-5 w-5" />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D5438] text-white shadow-lg shadow-[#3D5438]/20 transition hover:bg-[#2C3A29]">
                        <Mic className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest transition hover:text-slate-900">
                    <Sparkles className="h-3.5 w-3.5" /> Saved Prompts
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest transition hover:text-slate-900">
                    <Paperclip className="h-3.5 w-3.5" /> Attach File
                  </button>
                </div>

                {/* Quick Actions Grid */}
                <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => handleSend(action.prompt)}
                      className="group flex flex-col items-start rounded-2xl border border-slate-100 bg-white p-5 text-left transition-all hover:border-[#8E9B44]/20 hover:shadow-lg hover:shadow-slate-100"
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition group-hover:bg-[#EBF0E6] group-hover:text-[#3D5438]">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{action.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
              {messages.map((message, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex gap-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      message.role === 'user' ? 'bg-[#3D5438] text-white' : 'bg-[#EBF0E6] text-[#3D5438]'
                    }`}>
                      {message.role === 'user' ? <Plus className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div className={`rounded-3xl px-6 py-4 leading-relaxed shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-[#3D5438] text-white shadow-[#3D5438]/10' 
                        : 'border border-slate-100 bg-slate-50/50 text-slate-800'
                    }`}>
                      {message.role === 'assistant' && message.response ? (
                        <div className="space-y-5">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{message.response.headline}</h3>
                            <p className="mt-2 text-sm text-slate-600">{message.response.overview}</p>
                          </div>

                          <div className="inline-flex items-center rounded-full bg-[#EBF0E6] px-3 py-1 text-xs font-semibold text-[#3D5438]">
                            Confidence: {message.response.confidenceLabel}
                            {typeof message.response.confidence === 'number' ? ` (${Math.round(message.response.confidence * 100)}%)` : ''}
                          </div>

                          {message.response.highlights?.length ? (
                            <div className="rounded-2xl border border-[#D7E4C9] bg-[#F5F8EF] p-4">
                              <h4 className="text-sm font-semibold text-slate-900">Key points</h4>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.response.highlights.map((highlight, highlightIndex) => (
                                  <span
                                    key={`highlight-${highlightIndex}`}
                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3D5438] shadow-sm ring-1 ring-[#D7E4C9]"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {message.response.images?.length ? (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900">Related visual guides</h4>
                              <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {message.response.images.map((image, imageIndex) => (
                                  <div key={`image-${imageIndex}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <img
                                      src={image.src}
                                      alt={image.alt}
                                      className="h-44 w-full object-cover"
                                    />
                                    <div className="p-4">
                                      <h5 className="text-sm font-semibold text-slate-900">{image.title}</h5>
                                      <p className="mt-2 text-xs leading-6 text-slate-600">{image.caption}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className="space-y-4">
                            {message.response.sections?.map((section) => (
                              <div
                                key={section.title}
                                className={`rounded-2xl border px-4 py-3 ${
                                  section.tone === 'warning'
                                    ? 'border-amber-200 bg-amber-50/80'
                                    : section.tone === 'success'
                                      ? 'border-emerald-100 bg-emerald-50/60'
                                      : 'border-slate-200 bg-white/70'
                                }`}
                              >
                                <h4 className="text-sm font-semibold text-slate-900">{section.title}</h4>
                                {section.paragraphs?.map((paragraph, paragraphIndex) => (
                                  <p key={`${section.title}-paragraph-${paragraphIndex}`} className="mt-2 text-sm text-slate-700">
                                    {paragraph}
                                  </p>
                                ))}
                                {section.bullets?.length ? (
                                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                                    {section.bullets.map((bullet, bulletIndex) => (
                                      <li key={`${section.title}-bullet-${bulletIndex}`} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3D5438]" />
                                        <span>{bullet}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-6">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EBF0E6] text-[#3D5438]">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-3xl border border-slate-100 bg-slate-50/50 px-6 py-4">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8E9B44]/40" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8E9B44]/70 [animation-delay:0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8E9B44] [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Floating Input Bar (Post-Initial) */}
        {messages.length > 0 && (
          <div className="p-6 border-t border-slate-50">
            <div className="mx-auto w-full max-w-3xl">
              <div className="relative rounded-3xl border border-slate-200 bg-[#FBFBFB] p-3 focus-within:border-[#8E9B44]/40 focus-within:shadow-md transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Follow up..."
                  className="w-full bg-transparent px-4 py-2 text-sm text-slate-800 outline-none"
                />
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3D5438] text-white disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
