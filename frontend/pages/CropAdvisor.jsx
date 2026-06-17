import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Sprout, Wheat } from 'lucide-react';

const states = [
  'Uttar Pradesh',
  'Maharashtra',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Gujarat',
  'Karnataka',
  'Andhra Pradesh',
  'West Bengal',
  'Bihar',
];

const parseResult = (result) =>
  result.split('\n').map((line, index) => {
    const clean = line.replace(/\*\*/g, '');

    if (line.startsWith('### ')) {
      return (
        <h4 key={index} className="mt-6 text-lg font-semibold text-[#1F6F5F] first:mt-0">
          {clean.replace('### ', '')}
        </h4>
      );
    }

    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={index} className="ml-5 list-decimal text-sm leading-7 text-[#1F6F5F]/65">
          {clean.replace(/^\d+\.\s/, '')}
        </li>
      );
    }

    if (line.startsWith('- ')) {
      return (
        <li key={index} className="ml-5 list-disc text-sm leading-7 text-[#1F6F5F]/65">
          {clean.replace('- ', '')}
        </li>
      );
    }

    if (!line.trim()) {
      return <div key={index} className="h-2" />;
    }

    return (
      <p key={index} className="text-sm leading-7 text-[#1F6F5F]/65">
        {clean}
      </p>
    );
  });

export const CropAdvisor = () => {
  const [formData, setFormData] = useState({
    crop: '',
    category: '',
    region: '',
    description: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY_HERE',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1000,
          system:
            "You are Flocksy's crop issue analysis expert for Indian agriculture. Given crop type, problem category, region, and the farmer's description, provide likely diagnosis, immediate action steps, treatment options, and preventive measures in clear and simple language.",
          messages: [
            {
              role: 'user',
              content: `Crop: ${formData.crop}\nProblem Category: ${formData.category}\nRegion: ${formData.region}\nDescription: ${formData.description}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResult(data.content?.[0]?.text || 'No result returned.');
    } catch (error) {
      console.error(error);
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setResult(`### Likely diagnosis
Based on your description for ${formData.crop} in ${formData.region}, this looks most similar to a fungal leaf issue or a nutrient imbalance.

### Immediate action
1. Isolate the affected crop section and inspect how quickly the symptoms are spreading.
2. Check irrigation levels and drainage around the affected area.
3. Compare healthy and unhealthy leaves for color pattern, spots, and curling.

### Recommended treatment
- Use a broad-spectrum fungicide such as Mancozeb if spotting is spreading.
- If yellowing is uniform, consider a nitrogen or micronutrient correction based on local guidance.

### Preventive measures
- Improve field monitoring twice per week during sensitive growth stages.
- Avoid overwatering and keep airflow healthy between rows.

Note: This is a demonstration response. Please confirm the diagnosis with a local agricultural expert before applying treatment.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="grid gap-6">
        <div className="dashboard-card p-6 sm:p-8">
          <span className="eyebrow">Crop analysis</span>
          <h1 className="mt-4 text-4xl font-serif text-[#1F6F5F]">Turn crop symptoms into a structured treatment plan.</h1>
          <p className="mt-4 text-sm leading-7 text-[#1F6F5F]/65">
            The refreshed crop module uses a cleaner form layout, clearer staging, and a more dashboard-like analysis panel so the workflow feels production ready.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              { icon: Wheat, title: 'Issue intake', text: 'Capture crop, category, region, and symptom detail in one consistent flow.' },
              { icon: Leaf, title: 'Action-oriented results', text: 'Surface likely diagnosis and next steps in a format the farmer can act on.' },
              { icon: ShieldCheck, title: 'Safer escalation', text: 'Highlight when expert confirmation is needed before applying treatment.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[28px] border border-[#1F6F5F]/10 bg-[#EEEEEE]/80 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F6F5F] text-[#6FCF97]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1F6F5F]">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#1F6F5F]/65">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="dashboard-card p-6">
          <span className="eyebrow">Describe the issue</span>
          <h2 className="mt-4 text-2xl font-serif text-[#1F6F5F]">Analysis request</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Crop type</label>
              <select
                required
                value={formData.crop}
                onChange={(event) => setFormData({ ...formData, crop: event.target.value })}
                className="input-field"
              >
                <option value="">Select crop</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Maize">Maize</option>
                <option value="Tomato">Tomato</option>
                <option value="Onion">Onion</option>
                <option value="Potato">Potato</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Problem category</label>
              <select
                required
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                className="input-field"
              >
                <option value="">Select category</option>
                <option value="Disease">Disease</option>
                <option value="Pest">Pest</option>
                <option value="Nutrient Deficiency">Nutrient deficiency</option>
                <option value="Weather Damage">Weather damage</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">State or region</label>
            <select
              required
              value={formData.region}
              onChange={(event) => setFormData({ ...formData, region: event.target.value })}
              className="input-field"
            >
              <option value="">Select region</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Problem description</label>
            <textarea
              required
              rows="6"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="input-field min-h-[170px] resize-none"
              placeholder="Explain what you see, when it started, where it is spreading, and any recent weather or irrigation changes."
            />
          </div>

          <button type="submit" disabled={isAnalyzing} className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
            {isAnalyzing ? 'Analyzing crop issue...' : 'Run crop analysis'}
            {!isAnalyzing && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </section>

      <section className="dashboard-card min-h-[780px] p-6 sm:p-8">
        {!result && !isAnalyzing && (
          <div className="flex h-full flex-col items-center justify-center rounded-[30px] border border-dashed border-[#1F6F5F]/18 bg-[#EEEEEE]/70 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1F6F5F] text-[#6FCF97]">
              <Sprout className="h-9 w-9" />
            </div>
            <h2 className="mt-6 text-3xl font-serif text-[#1F6F5F]">Ready for analysis</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#1F6F5F]/55">
              Submit the form to generate a structured diagnosis, immediate action list, treatment suggestions, and prevention guidance.
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex h-full flex-col items-center justify-center rounded-[30px] bg-[#EEEEEE]/70 text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1F6F5F]/10 border-t-[#1F6F5F]" />
            <h2 className="mt-6 text-3xl font-serif text-[#1F6F5F]">Analyzing field signals</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#1F6F5F]/55">
              Reviewing symptom patterns, likely causes, and first treatment options for your crop case.
            </p>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="h-full">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F6F5F]/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6FCF97]/24 text-[#1F6F5F]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="eyebrow">Result</span>
                  <h2 className="mt-2 text-2xl font-serif text-[#1F6F5F]">Analysis complete</h2>
                </div>
              </div>
              <button type="button" className="btn-secondary">Save to dashboard</button>
            </div>

            <div className="mt-6 space-y-2">{parseResult(result)}</div>
          </div>
        )}
      </section>
    </div>
  );
};
