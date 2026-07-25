import React from 'react';
import { Camera, Loader2, Upload } from 'lucide-react';

export const symptomOptions = [
  'Twisted neck',
  'Green diarrhea',
  'Bloody stool',
  'Coughing',
  'Breathing difficulty',
  'Weakness',
  'Drop in feed intake',
  'Sudden deaths',
];

export const panelClass = 'rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]';

export function CaseIntakeForm({
  form,
  selectedSymptoms,
  file,
  error,
  isLoading,
  title,
  description,
  submitLabel,
  onChange,
  onToggleSymptom,
  onFileChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className={`${panelClass} space-y-5`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Local mode</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['farmId', 'Farm ID'],
          ['batchId', 'Batch ID'],
          ['flockSize', 'Flock size'],
          ['ageInDays', 'Age in days'],
          ['temperatureC', 'Temperature C'],
          ['humidityPercent', 'Humidity %'],
        ].map(([name, label]) => (
          <label key={name} className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
            <input
              name={name}
              value={form[name]}
              onChange={onChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </label>
        ))}
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Feed type</span>
        <input
          name="feedType"
          value={form.feedType}
          onChange={onChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Observed symptoms</span>
        <textarea
          name="symptoms"
          rows={4}
          value={form.symptoms}
          onChange={onChange}
          placeholder="Example: 8 birds weak since yesterday, green droppings, one bird with twisted neck, feed intake down."
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-300 focus:bg-white"
        />
      </label>

      <div>
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Symptom checklist</span>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((symptom) => {
            const active = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => onToggleSymptom(symptom)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {symptom}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Localization</span>
          <select
            name="language"
            value={form.language}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </label>

        <div className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Image</span>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 hover:border-emerald-300 hover:bg-emerald-50">
            <Upload className="h-4 w-4" />
            {file ? 'Change file' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      {file ? (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Attached image: <span className="font-semibold text-slate-900">{file.name}</span>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {isLoading ? 'Running diagnosis engine...' : submitLabel}
      </button>
    </form>
  );
}
