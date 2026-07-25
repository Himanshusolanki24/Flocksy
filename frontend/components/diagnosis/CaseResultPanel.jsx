import React, { useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Droplets,
  ShieldAlert,
  Stethoscope,
  Thermometer,
  Wind,
} from 'lucide-react';
import { panelClass } from './CaseIntakeForm';

const riskTone = {
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  immediate: 'bg-rose-50 text-rose-700 ring-rose-200',
  monitor_closely: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const formatPercent = (value) => (typeof value === 'number' ? `${Math.round(value * 100)}%` : 'N/A');

export function CaseResultPanel({ result, emptyTitle, emptyDescription }) {
  const decision = result?.result;
  const confidenceBar = useMemo(() => {
    if (!decision?.confidence) return 0;
    return Math.max(8, Math.min(100, Math.round(decision.confidence * 100)));
  }, [decision]);

  if (!decision) {
    return (
      <div className={`${panelClass} flex min-h-[480px] flex-col items-center justify-center text-center`}>
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-50 text-emerald-700">
          <Stethoscope className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-slate-950">{emptyTitle}</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{emptyDescription}</p>
      </div>
    );
  }

  const topDifferentials = decision.differential_diagnosis || [];
  const localized = decision.localized_response;
  const safetyWarnings = decision.safety?.warnings || [];
  const actions = decision.recommended_actions || [];
  const referenceImages = decision.referenceImages || [];
  const agentFindings = decision.agent_findings || [];

  return (
    <div className="space-y-6">
      <section className={`${panelClass} overflow-hidden`}>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {decision.diagnosis_status}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${riskTone[decision.risk?.urgency] || riskTone.medium}`}>
                Urgency: {decision.risk?.urgency}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{localized?.headline || decision.top_disease}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{localized?.summary}</p>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Decision confidence</span>
                <span className="text-sm font-semibold text-slate-600">{formatPercent(decision.confidence)}</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400" style={{ width: `${confidenceBar}%` }} />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ['Severity', decision.risk?.severity, AlertTriangle],
              ['Spread risk', decision.risk?.spread_risk, Wind],
              ['Mortality risk', decision.risk?.mortality_risk, Stethoscope],
              ['Safety status', decision.safety?.status, ShieldAlert],
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Icon className="h-4 w-4 text-slate-500" />
                  {label}
                </div>
                <p className="mt-3 text-lg font-semibold capitalize text-slate-950">{value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className={`${panelClass} space-y-5`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-950">Differential Diagnosis</h3>
            <span className="text-sm text-slate-500">Top ranked diseases</span>
          </div>
          <div className="space-y-4">
            {topDifferentials.map((item) => (
              <div key={item.disease} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Rank {item.rank}</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-950">{item.disease}</h4>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">
                    {formatPercent(item.confidence)}
                  </div>
                </div>
                {!!item.supporting_factors?.length && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Supporting factors</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                      {item.supporting_factors.map((factor) => (
                        <li key={factor} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!!item.conflicting_factors?.length && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Conflicting factors</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                      {item.conflicting_factors.map((factor) => (
                        <li key={factor} className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={`${panelClass} space-y-5`}>
          <h3 className="text-lg font-semibold text-slate-950">Immediate Action Plan</h3>
          <div className="space-y-3">
            {actions.map((action) => (
              <div key={action.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-950">{action.title}</h4>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {action.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{action.reason}</p>
              </div>
            ))}
          </div>

          {decision.quarantine_steps?.length ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
              <h4 className="text-sm font-semibold text-rose-800">Quarantine steps</h4>
              <ul className="mt-3 space-y-2 text-sm text-rose-700">
                {decision.quarantine_steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${panelClass}`}>
          <h3 className="text-lg font-semibold text-slate-950">Safety Review</h3>
          <div className={`mt-4 rounded-[24px] border p-4 ${decision.safety?.approved ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="text-sm font-semibold text-slate-950">Status: {decision.safety?.status}</p>
            <p className="mt-2 text-sm text-slate-600">
              {decision.safety?.approved ? 'No hard block was triggered, but follow warnings carefully.' : 'A safety issue was triggered. Escalate before medicating the flock.'}
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {safetyWarnings.length ? safetyWarnings.map((warning) => (
              <div key={warning} className="rounded-2xl bg-slate-50 px-4 py-3">{warning}</div>
            )) : <div className="rounded-2xl bg-slate-50 px-4 py-3">No active safety warning.</div>}
          </div>
        </section>

        <section className={`${panelClass}`}>
          <h3 className="text-lg font-semibold text-slate-950">Environment and Feed</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-[24px] bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900"><Thermometer className="h-4 w-4 text-amber-600" /> Environment</div>
              <p className="mt-2">Temperature target: {decision.environment?.temperature || 'N/A'}</p>
              <p>Humidity target: {decision.environment?.humidity || 'N/A'}</p>
              <p>Ventilation: {decision.environment?.ventilation || 'N/A'}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900"><Droplets className="h-4 w-4 text-sky-600" /> Feed plan</div>
              <p className="mt-2">Type: {decision.feed?.plan?.type || 'N/A'}</p>
              <p>Protein: {decision.feed?.plan?.protein || 'N/A'}</p>
              <p>Energy: {decision.feed?.plan?.energy || 'N/A'}</p>
            </div>
          </div>
        </section>

        <section className={`${panelClass}`}>
          <h3 className="text-lg font-semibold text-slate-950">Localized Farmer Response</h3>
          <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">{localized?.headline}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{localized?.summary}</p>
          </div>
          {localized?.actions?.length ? (
            <div className="mt-4 space-y-2">
              {localized.actions.map((item) => (
                <div key={item} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{item}</div>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className={`${panelClass}`}>
          <h3 className="text-lg font-semibold text-slate-950">Reference Images</h3>
          {referenceImages.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {referenceImages.map((image) => (
                <article key={image.src} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                  <img src={image.src} alt={image.alt} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-slate-950">{image.title}</h4>
                    <p className="mt-2 text-xs leading-6 text-slate-600">{image.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No local reference images were attached for this disease.</p>
          )}
        </section>

        <section className={`${panelClass}`}>
          <h3 className="text-lg font-semibold text-slate-950">Agent Findings</h3>
          <div className="mt-4 space-y-3">
            {agentFindings.map((finding) => (
              <div key={finding.agent} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{finding.agent.replace(/_/g, ' ')}</p>
                    <h4 className="mt-1 text-sm font-semibold text-slate-950">{finding.claim}</h4>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{formatPercent(finding.score)}</div>
                </div>
                {!!finding.evidence?.length && (
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {finding.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
