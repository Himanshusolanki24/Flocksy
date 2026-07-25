import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Brain,
  CheckCircle,
  Mic,
  Paperclip,
  Send,
  ShieldAlert,
  Sparkles,
  Sprout,
  Stethoscope,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { diagnosisApi } from '../src/api';

/* ─── Quick Actions ─── */
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

/* ─── Farm Context for API calls ─── */
const diagnosisContext = {
  farmId: 'farm-demo-1',
  batchId: 'batch-a',
  flockSize: 500,
  ageInDays: 21,
  temperatureC: 33,
  humidityPercent: 78,
  feedType: 'Starter mash',
  language: 'en',
  symptomChecklist: ['Weakness', 'Breathing difficulty', 'Low feed intake'],
};

/* ─── Patterns ─── */
const greetingPattern = /^(hi|hii|hello|hey|namaste|good morning|good afternoon|good evening)\b/i;
const symptomPattern = /\b(sick|symptom|disease|weak|weakness|breathing|cough|fever|droppings|diarrhea|dead|died|not eating|lethargy|infection|coccidiosis|newcastle|salmonella|treatment|urgent)\b/i;

/* ─── Helpers ─── */
const formatSentence = (v) => {
  if (!v) return 'Not specified';
  return String(v).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const buildConversationalReply = (prompt) => {
  if (greetingPattern.test(prompt)) {
    return {
      type: 'text',
      content: 'Hello! I can help with poultry symptoms, likely disease causes, medicine precautions, and clear farm action steps. Tell me what the birds are showing.',
    };
  }
  return {
    type: 'text',
    content: 'Describe the symptoms in simple words, like "birds have green droppings and are not eating" or "3 birds died suddenly".',
  };
};

const buildDiagnosisReply = (payload) => {
  const result = payload?.analysis?.result || payload?.result;
  if (!result) {
    return { type: 'text', content: payload?.advice || 'I could not generate a response at this time.' };
  }

  const disease = result?.top_disease || 'No single disease identified';
  const confidence = Number(result?.confidence);
  const confidenceLabel = Number.isNaN(confidence) ? 'N/A' : `${Math.round(confidence * 100)}%`;
  const actions = result?.recommended_actions?.slice(0, 3) || [];
  const warnings = result?.safety?.warnings?.slice(0, 3) || [];
  const followUps = result?.follow_up_questions?.slice(0, 3) || [];
  const differentials = result?.differential_diagnosis?.slice(0, 3) || [];
  const referenceImages = result?.referenceImages?.slice(0, 4) || [];

  const sec = (title, items) => ({ title, items: (items || []).filter(Boolean) });

  return {
    type: 'diagnosis',
    headline: disease,
    summary: result?.localized_response?.summary || payload?.advice || 'Analysis complete.',
    metrics: [
      { label: 'Confidence', value: confidenceLabel },
      { label: 'Severity', value: formatSentence(result?.risk?.severity || 'Unknown') },
      { label: 'Urgency', value: formatSentence(result?.risk?.urgency || 'Unknown') },
    ],
    images: referenceImages,
    sections: [
      sec('What this likely means', [
        `${disease} is the most likely condition based on the signs shared.`,
        'This is a preliminary AI assessment — severe cases should be confirmed by a veterinarian.',
      ]),
      sec('What to do now', actions.map((a) => `${a.title}: ${a.reason}`)),
      sec('Other diseases possible', differentials.map((d) => `${d.disease} (${Math.round((d.confidence || 0) * 100)}%)`)),
      sec('Warnings', warnings),
      sec('Questions to answer next', followUps),
    ].filter((s) => s.items.length),
  };
};

/* ─── Assistant Message Component ─── */
const AssistantMessage = ({ message }) => {
  if (message.type !== 'diagnosis') {
    return <div className="text-sm leading-7 text-[#4A5E50]">{message.content}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-forest">{message.headline}</h3>
        <p className="mt-1.5 text-sm leading-7 text-[#4A5E50]">{message.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {message.metrics.map((m) => (
          <div key={m.label} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'rgba(91,123,94,0.15)', background: '#F5F8F2', color: '#1B3A2D' }}>
            <span className="font-semibold">{m.label}:</span> {m.value}
          </div>
        ))}
      </div>

      {message.images?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-forest">Reference Images</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {message.images.map((img) => (
              <div key={img.src} className="overflow-hidden rounded-xl border" style={{ borderColor: 'rgba(91,123,94,0.1)' }}>
                <img src={img.src} alt={img.alt || img.title} className="h-32 w-full object-cover" />
                <div className="px-3 py-2">
                  <p className="text-xs font-medium text-forest">{img.title}</p>
                  <p className="text-[11px] text-[#7B8F80]">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {message.sections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <p className="text-xs font-semibold text-forest">{section.title}</p>
            {section.items.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm leading-6 text-[#4A5E50]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-light" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN CHATBOT COMPONENT
═══════════════════════════════════════ */
export const Chatbot = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const displayName = user?.name || 'Farm Operator';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  /* ─── API Calls ─── */
  const sendTextDiagnosis = async (prompt) => {
    const data = await diagnosisApi.sendChatQuery({ query: prompt, ...diagnosisContext });
    return buildDiagnosisReply(data);
  };

  const sendImageDiagnosis = async (prompt) => {
    const formData = new FormData();
    formData.append('symptoms', prompt);
    Object.entries(diagnosisContext).forEach(([key, val]) => {
      formData.append(key, key === 'symptomChecklist' ? JSON.stringify(val) : String(val));
    });
    if (attachedFile) formData.append('media', attachedFile);
    const data = await diagnosisApi.createCase(formData);
    return buildDiagnosisReply(data);
  };

  const handleSend = async (text = input) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setIsLoading(true);

    try {
      const shouldRunDiagnosis = attachedFile || symptomPattern.test(prompt);
      const reply = shouldRunDiagnosis
        ? attachedFile ? await sendImageDiagnosis(prompt) : await sendTextDiagnosis(prompt)
        : buildConversationalReply(prompt);

      setMessages((prev) => [...prev, { role: 'assistant', ...reply }]);
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', type: 'text', content: 'I am having trouble connecting to the Flocksy diagnosis engine. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="flex h-[calc(100vh-2rem)] w-full overflow-hidden rounded-2xl border bg-white" style={{ borderColor: 'rgba(91,123,94,0.1)', boxShadow: '0 8px 40px rgba(27,58,45,0.06)' }}>

      {/* ─── Main Chat Area ─── */}
      <main className="relative flex flex-1 flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: 'rgba(91,123,94,0.06)' }}>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-sage" />
            <span className="font-display text-sm font-bold tracking-tight text-forest">Cortex Assistant</span>
            <span className="ml-1.5 rounded-full bg-[#F0F5ED] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-sage">v2.4</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold text-[#7B8F80] transition hover:text-forest" style={{ borderColor: 'rgba(91,123,94,0.1)' }}>
              <Paperclip className="h-3 w-3" /> Export
            </button>
          </div>
        </header>

        {/* Messages / Welcome */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            /* ─── Welcome Screen ─── */
            <div className="flex min-h-full flex-col items-center justify-start px-6 py-12">
              {/* Glass Blob */}
              <div className="relative mb-12 flex h-56 w-56 items-center justify-center">
                <motion.div
                  className="absolute h-full w-full rounded-full bg-mint/15 blur-[80px]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="relative h-44 w-44 border border-white/50"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D4E8D0 40%, #8CA88F 85%, #1B3A2D 100%)',
                    boxShadow: '15px 30px 50px rgba(27,58,45,0.12), inset -8px -8px 25px rgba(255,255,255,0.35), inset 8px 8px 25px rgba(27,58,45,0.05)',
                  }}
                  animate={{
                    borderRadius: ['45% 55% 70% 30% / 40% 50% 60% 50%', '55% 45% 30% 70% / 50% 60% 40% 50%', '45% 55% 70% 30% / 40% 50% 60% 50%'],
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="absolute top-[8%] left-[15%] h-[22%] w-[40%] rounded-[50%] bg-gradient-to-br from-white/60 to-transparent rotate-[-25deg] blur-[2px]" />
                </motion.div>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
                How can I assist you today?
              </h1>

              {/* Centered Input */}
              <div className="mt-10 w-full max-w-2xl">
                <div className="rounded-2xl border bg-[#FAFDF7] p-4 transition-all focus-within:border-sage-light/40 focus-within:shadow-medium" style={{ borderColor: 'rgba(91,123,94,0.12)' }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder="Ask me anything about your farm…"
                    className="min-h-[40px] w-full resize-none bg-transparent px-2 text-sm text-forest outline-none placeholder:text-[#7B8F80]"
                  />
                  {attachedFile && <p className="px-2 pt-1 text-[11px] text-sage">📎 {attachedFile.name}</p>}
                  <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: 'rgba(91,123,94,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 rounded-lg bg-forest/6 px-3 py-1.5 text-[11px] font-semibold text-forest transition hover:bg-forest/10">
                        <Brain className="h-3 w-3" /> Deep Research
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-[#7B8F80] transition hover:text-forest">
                        <Paperclip className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-[#7B8F80] transition hover:text-forest"><Globe className="h-4 w-4" /></button>
                      <button onClick={() => handleSend()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white shadow-md transition hover:bg-forest-deep">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-5">
                  <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B8F80] transition hover:text-forest">
                    <Sparkles className="h-3 w-3" /> Saved Prompts
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B8F80] transition hover:text-forest">
                    <Paperclip className="h-3 w-3" /> Attach File
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => handleSend(action.prompt)}
                      className="group flex flex-col items-start rounded-xl border bg-white p-4 text-left transition-all hover:border-sage-light/30 hover:shadow-soft"
                      style={{ borderColor: 'rgba(91,123,94,0.08)' }}
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0F5ED] text-sage transition group-hover:bg-forest group-hover:text-white">
                        <action.icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-forest">{action.title}</h3>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-[#7B8F80]">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ─── Message Thread ─── */
            <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
              {messages.map((message, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      message.role === 'user' ? 'bg-forest text-white' : 'bg-[#F0F5ED] text-forest'
                    }`}>
                      {message.role === 'user' ? <Sparkles className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    <p className="text-xs font-semibold text-forest">
                      {message.role === 'user' ? displayName : 'Cortex Assistant'}
                    </p>
                  </div>
                  <div className="pl-[42px]">
                    {message.role === 'user' ? (
                      <div className="text-sm leading-7 text-forest">{message.content}</div>
                    ) : (
                      <AssistantMessage message={message} />
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0F5ED] text-forest">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs font-semibold text-forest">Cortex Assistant</p>
                  </div>
                  <div className="pl-[42px] flex items-center gap-1.5">
                    <span className="typing-dot h-2 w-2 rounded-full bg-sage-light" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-sage-light" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-sage-light" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* ─── Bottom Input (when messages exist) ─── */}
        {messages.length > 0 && (
          <div className="border-t p-4" style={{ borderColor: 'rgba(91,123,94,0.06)' }}>
            <div className="mx-auto w-full max-w-3xl">
              <div className="relative rounded-xl border bg-[#FAFDF7] p-2.5 transition-all focus-within:border-sage-light/40 focus-within:shadow-md" style={{ borderColor: 'rgba(91,123,94,0.12)' }}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Follow up…"
                    className="flex-1 bg-transparent px-2 py-1.5 text-sm text-forest outline-none placeholder:text-[#7B8F80]"
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-[#7B8F80] transition hover:text-forest">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-white transition hover:bg-forest-deep disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
                {attachedFile && <p className="mt-1 px-2 text-[11px] text-sage">📎 {attachedFile.name}</p>}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
      />
    </div>
  );
};
