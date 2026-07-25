import React, { useState } from 'react';
import { ClipboardList, ShieldAlert, Stethoscope } from 'lucide-react';
import { diagnosisApi } from '../src/api';
import { CaseIntakeForm } from '../components/diagnosis/CaseIntakeForm';
import { CaseResultPanel } from '../components/diagnosis/CaseResultPanel';

const initialForm = {
  farmId: 'farm-demo-1',
  batchId: 'batch-a',
  flockSize: '500',
  ageInDays: '21',
  temperatureC: '33',
  humidityPercent: '78',
  feedType: 'Starter mash',
  symptoms: '',
  language: 'en',
};

export const DiagnosisWorkbench = () => {
  const [form, setForm] = useState(initialForm);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Weakness', 'Breathing difficulty']);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append('symptomChecklist', JSON.stringify(selectedSymptoms));
      if (file) payload.append('media', file);
      const data = await diagnosisApi.createCase(payload);
      setResult(data);
      setForm((prev) => ({ ...prev, symptoms: '' }));
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || 'Failed to analyze the case.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1480px] space-y-6 pb-10">
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(207,232,220,0.65),_rgba(255,255,255,0.96)_48%),linear-gradient(135deg,#f8fafc,#ffffff)] p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Flocksy Diagnosis Workbench</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl tracking-tight text-slate-950">A dedicated poultry diagnosis page for operators who want the full workbench view.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Use this page when you want a non-chat layout for structured disease triage, farm context review,
              safety validation, and evidence-backed action planning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Stethoscope className="h-4 w-4 text-emerald-700" /> Dedicated diagnosis</div>
              <p className="mt-3 text-sm text-slate-600">One focused workspace for disease analysis and ranking.</p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><ShieldAlert className="h-4 w-4 text-amber-600" /> Safety-first workflow</div>
              <p className="mt-3 text-sm text-slate-600">Warnings and medicine risk checks stay visible during the whole review.</p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><ClipboardList className="h-4 w-4 text-sky-700" /> Structured outputs</div>
              <p className="mt-3 text-sm text-slate-600">Confidence, actions, environment notes, evidence, and localized farmer advice.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <CaseIntakeForm
          form={form}
          selectedSymptoms={selectedSymptoms}
          file={file}
          error={error}
          isLoading={isLoading}
          title="New Diagnosis Case"
          description="Capture symptoms, house conditions, and media in one farm case."
          submitLabel="Run diagnosis case"
          onChange={handleChange}
          onToggleSymptom={toggleSymptom}
          onFileChange={setFile}
          onSubmit={handleSubmit}
        />

        <CaseResultPanel
          result={result}
          emptyTitle="Diagnosis results will appear here"
          emptyDescription="Submit a case to see the provisional diagnosis, differential ranking, operational actions, safety review, localized farmer response, and evidence trace."
        />
      </div>
    </div>
  );
};
