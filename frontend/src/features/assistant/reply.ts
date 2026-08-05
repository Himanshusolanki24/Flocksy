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

  if (q.includes("डेयरी") || q.includes("dairy") || q.includes("feed for cow") || q.includes("milk") || q.includes("गाय")) {
    return [
      "Great question — dairy nutrition directly affects milk yield.",
      "",
      "**Best feed mix for dairy cows (per day):**",
      "| Feed | Amount |",
      "|------|--------|",
      "| Green fodder | 30–35 kg |",
      "| Concentrate mix | 2–3 kg |",
      "| Mineral mixture | 50 g |",
      "| Clean water | 45–60 L |",
      "",
      "**Key tips:**",
      "- Feed after milking, not before",
      "- Add mineral mixture every day for better fat %",
      "- Keep feeding times fixed — cows like routine",
      "",
      "Need a **full diet chart** for your specific breed and milk target?",
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