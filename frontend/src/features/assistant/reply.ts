/**
 * Local intelligent reply generator used when the AI backend is unreachable,
 * so the assistant is always demonstrable. Returns markdown.
 */
export function generateReply(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("मुर्ग") || q.includes("chicken") || q.includes("not eating") || q.includes("bim") || q.includes("बीमार")) {
    return [
      "I understand — a sick bird is worrying. Here's what to do right now:",
      "",
      "**1. Isolate first**",
      "Move the sick bird away from the flock immediately to stop it spreading.",
      "",
      "**2. Check the basics**",
      "- ✅ Water: clean and fresh",
      "- ✅ Feed: is it eating at all?",
      "- 🌡️ Body heat: cold feet + droopy comb = concern",
      "",
      "**3. Possible causes**",
      "If chickens stop eating with droopy comb and loose stool, **coccidiosis** is common. If it's just one bird, it may be injury or stress.",
      "",
      "> ⚠️ If more than one bird is affected, please run a **Disease Detection** photo or book a vet.",
      "",
      "```\nNext steps\n1. Isolate sick bird\n2. Give clean drinking water with electrolytes\n3. Watch for 24 hours\n4. Consult a vet if no improvement\n```",
      "",
      "Want me to **book a vet** or show you how to **upload a photo** for analysis?",
    ].join("\n");
  }

  if (q.includes("feed") || q.includes("दाना") || q.includes("पोषण") || q.includes("egg production") || q.includes("अंडे")) {
    return [
      "Optimal nutrition is the biggest driver of broiler growth and egg laying.",
      "",
      "**Recommended poultry feed balance:**",
      "| Stage / Bird | Feed Type | Protein % | Key Additives |",
      "|--------------|-----------|-----------|---------------|",
      "| Days 1–10 | Pre-Starter Mash | 22–23% | Probiotics, Electrolytes |",
      "| Days 11–24 | Broiler Starter | 21–22% | Coccidiostat, Amino Acids |",
      "| Days 25–42 | Broiler Finisher | 19–20% | Phytase, Essential Enzymes |",
      "| Layers (18w+) | Layer Mash | 17–18% | 3.8–4.2% Calcium for eggshell strength |",
      "",
      "**Key tips:**",
      "- Always keep water:feed ratio around 2:1",
      "- Check feed troughs twice daily to prevent caking and mold",
      "- Weigh 50 random birds weekly to measure Feed Conversion Ratio (FCR)",
      "",
      "Want me to calculate **daily feed requirement** for your current flock size?",
    ].join("\n");
  }

  if (q.includes("मानसून") || q.includes("monsoon") || q.includes("rain") || q.includes("बारिश")) {
    return [
      "Here's a simple **monsoon readiness checklist** for your farm:",
      "",
      "- 🏠 **Heating/brooding** — reduce bedding dampness, add dry litter",
      "- 💧 **Clean water systems** — rain can contaminate",
      "- 🚰 **Drainage** — clear drains so water doesn't pool",
      "- 🐥 **Ventilation** — prevent humidity build-up in coops",
      "- 🧪 **Deworm** before the season spikes",
      "",
      "```\n60% of monsoon farm losses come from\npoor drainage + damp feed storage.\n```",
      "",
      "Check your **Weather** tab for village-level alerts, and keep vaccine schedules on time.",
    ].join("\n");
  }

  if (q.includes("vacc") || q.includes("टीका") || q.includes("broiler schedule")) {
    return [
      "**Standard broiler vaccination schedule:**",
      "",
      "| Age | Vaccine | Route |",
      "|-----|---------|-------|",
      "| Day 1 | Marek's | Injection |",
      "| Day 7 | Newcastle (Lasota) | Eye drop |",
      "| Day 14–18 | IBD / Gumboro | Water |",
      "| Day 28 | Newcastle booster | Water |",
      "",
      "**Remember:**",
      "- Always get vaccines from a trusted cold chain",
      "- Keep birds calm 24h before and after",
      "- Record every dose in your **Vaccination** tab",
      "",
      "Shall I open the vaccination calendar and schedule these for your flock?",
    ].join("\n");
  }

  return [
    "Here's what I'd suggest for your farm:",
    "",
    "1. **Keep records daily** — small habits prevent big losses",
    "2. **Watch feed conversion** — it's your biggest lever on profit",
    "3. **Act fast on health** — early detection saves entire batches",
    "",
    "I can help with:",
    "- 🐔 **Disease detection** — photograph a sick bird",
    "- 🌦️ **Weather** — monsoon & heat alerts",
    "- 🏪 **Market** — best mandi prices nearby",
    "- 👨‍⚕️ **Vets** — book a consultation",
    "",
    "What would you like to focus on?",
  ].join("\n");
}