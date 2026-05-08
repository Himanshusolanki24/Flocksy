import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import type { Request, Response } from 'express';
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import { aiCoreClient } from '../services/aiCoreClient.js';
import { storageService } from '../services/storageService.js';

const upload = multer({ storage: multer.memoryStorage() });

const contextSchema = z.object({
  farmId: z.string().min(1),
  batchId: z.string().optional(),
  flockSize: z.coerce.number().optional(),
  ageInDays: z.coerce.number().optional(),
  temperatureC: z.coerce.number().optional(),
  humidityPercent: z.coerce.number().optional(),
  feedType: z.string().optional(),
});

export const diagnosisRouter = Router();

type ChatSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  tone?: 'neutral' | 'warning' | 'success';
};

type ChatImage = {
  title: string;
  src: string;
  alt: string;
  caption: string;
};

const datasetRoot = path.resolve(
  new URL('../../../ml/training/dataset/test', import.meta.url).pathname,
);

const datasetFolderByDisease: Record<string, string> = {
  'Newcastle Disease': 'Newcastle_Disease',
  Newcastle_Disease: 'Newcastle_Disease',
  'New Castle Disease': 'Newcastle_Disease',
  Coccidiosis: 'Coccidiosis',
  Salmonella: 'Salmonella',
  Healthy: 'Healthy',
};

const formatConfidenceLabel = (score?: number) => {
  if (typeof score !== 'number') return 'Unknown';
  if (score >= 0.8) return 'High';
  if (score >= 0.6) return 'Moderate';
  return 'Low';
};

const toSentenceCase = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getDatasetFolder = (diseaseName: string | null) => {
  if (!diseaseName) return null;
  return datasetFolderByDisease[diseaseName] || datasetFolderByDisease[toSentenceCase(diseaseName)] || null;
};

const pickEvenlySpacedFiles = (files: string[], desiredCount: number) => {
  if (files.length <= desiredCount) return files;

  const step = (files.length - 1) / Math.max(desiredCount - 1, 1);
  const chosen = new Set<string>();

  for (let index = 0; index < desiredCount; index += 1) {
    chosen.add(files[Math.round(index * step)]);
  }

  return Array.from(chosen);
};

const getRelatedImages = async (diseaseName: string | null): Promise<ChatImage[]> => {
  const folder = getDatasetFolder(diseaseName);
  if (!folder) {
    return [];
  }

  const directory = path.join(datasetRoot, folder);

  try {
    const files = (await fs.readdir(directory))
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));

    const selected = pickEvenlySpacedFiles(files, 4);

    return selected.map((file, index) => ({
      title: `${toSentenceCase(folder)} dataset sample ${index + 1}`,
      src: `http://localhost:${env.PORT}/api/v1/diagnosis/dataset-image/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`,
      alt: `${toSentenceCase(folder)} example image from the training dataset`,
      caption: `Real example from the ${toSentenceCase(folder)} test dataset used for disease reference.`,
    }));
  } catch (error) {
    console.error('Failed to read dataset images:', error);
    return [];
  }
};

const buildChatResponse = async (analysis: any) => {
  const result = analysis?.result;
  if (!result) {
    const fallback = {
      headline: 'No clear diagnosis yet',
      overview: 'I could not form a reliable conclusion from the message alone. Please share more flock details such as age, number of sick birds, mortality, droppings, feed intake, and water intake.',
      confidence: null,
      confidenceLabel: 'Unknown',
      sections: [
        {
          title: 'What to share next',
          bullets: [
            'Bird age and flock size',
            'How many birds are sick and for how long',
            'Whether feed intake or water intake has dropped',
            'Any coughing, diarrhea, twisted neck, or sudden deaths',
          ],
        },
      ],
    };

    return {
      advice: `${fallback.headline}\n\n${fallback.overview}\n\nWhat to share next:\n- ${fallback.sections[0].bullets?.join('\n- ')}`,
      response: fallback,
    };
  }

  const disease = result.disease?.prediction;
  const readableDisease =
    disease && disease !== 'Unknown' && disease !== 'Image not provided'
      ? toSentenceCase(disease)
      : null;
  const confidence = typeof result.accuracy === 'number' ? result.accuracy : null;
  const confidenceLabel = formatConfidenceLabel(confidence ?? undefined);
  const nextSteps = Array.isArray(result.next_steps) ? result.next_steps : [];
  const warnings = Array.isArray(result.warnings) ? result.warnings : [];
  const medicine = result.medicine || {};
  const feedPlan = result.feed_plan?.plan || {};
  const environment = result.environment || {};
  const verifiedRecord = result.disease?.verified_record || {};
  const diseaseType = verifiedRecord?.type || null;
  const diseaseSeverity = verifiedRecord?.severity || null;
  const mortalityRate = verifiedRecord?.mortality_rate || null;
  const affectedAge = verifiedRecord?.affected_age || null;
  const prevention = Array.isArray(verifiedRecord?.prevention) ? verifiedRecord.prevention : [];
  const treatmentOptions = Array.isArray(verifiedRecord?.treatment) ? verifiedRecord.treatment : [];

  const likelyIssueParagraphs = readableDisease
    ? [
        `${readableDisease} is the most likely issue based on the symptoms and available farm records.`,
        `This is a ${confidenceLabel.toLowerCase()}-confidence assessment, so use it as guidance for quick action, not as a final lab-confirmed diagnosis.`,
      ]
    : [
        'No single disease stands out strongly from the current description.',
        'That usually means you should focus first on isolation, observation, and getting clearer symptom details before starting treatment.',
      ];

  const causeBullets = [
    verifiedRecord?.symptoms ? `Common signs linked to this condition: ${verifiedRecord.symptoms.join(', ')}.` : null,
    verifiedRecord?.causes ? `Possible causes: ${verifiedRecord.causes.join(', ')}.` : null,
    verifiedRecord?.transmission ? `Spread risk: ${verifiedRecord.transmission}.` : null,
  ].filter(Boolean) as string[];

  const highlightPoints = [
    readableDisease ? `${readableDisease} is the top match.` : 'No single disease is confirmed yet.',
    diseaseSeverity ? `Severity appears ${diseaseSeverity}.` : null,
    mortalityRate ? `Mortality risk on record: ${mortalityRate}.` : null,
    affectedAge ? `Most affected age group: ${affectedAge}.` : null,
  ].filter(Boolean) as string[];

  const explanationParagraphs = [
    readableDisease && diseaseType
      ? `${readableDisease} is categorized as a ${diseaseType} condition. That matters because response speed, isolation, and preventive control are usually more important than waiting for multiple birds to worsen.`
      : null,
    mortalityRate
      ? `The recorded mortality pattern for this problem is ${mortalityRate}. If birds are declining quickly, treat this as time-sensitive and escalate early.`
      : null,
    prevention.length
      ? `Longer-term control usually depends on ${prevention.join(' and ')}.`
      : null,
  ].filter(Boolean) as string[];

  const medicineBullets = [
    medicine?.name ? `Suggested medicine on file: ${medicine.name}.` : 'No specific medicine match was found in the current records.',
    medicine?.dosage ? `Dose reference: ${medicine.dosage}.` : null,
    medicine?.duration ? `Typical duration: ${medicine.duration}.` : null,
    medicine?.withdrawal_period ? `Withdrawal period: ${medicine.withdrawal_period}.` : null,
    Array.isArray(medicine?.warnings) && medicine.warnings.length ? `Medicine cautions: ${medicine.warnings.join(', ')}.` : null,
    Array.isArray(medicine?.side_effects) && medicine.side_effects.length ? `Possible side effects: ${medicine.side_effects.join(', ')}.` : null,
  ].filter(Boolean) as string[];

  const feedBullets = [
    feedPlan?.type ? `Feed type: ${feedPlan.type}.` : null,
    feedPlan?.protein ? `Protein target: ${feedPlan.protein}.` : null,
    feedPlan?.energy ? `Energy target: ${feedPlan.energy}.` : null,
    Array.isArray(feedPlan?.feed_items) && feedPlan.feed_items.length ? `Useful feed ingredients: ${feedPlan.feed_items.join(', ')}.` : null,
    feedPlan?.purpose ? `Main purpose: ${feedPlan.purpose}.` : null,
  ].filter(Boolean) as string[];

  const environmentBullets = [
    environment?.temperature ? `Target temperature: ${environment.temperature}.` : null,
    environment?.humidity ? `Target humidity: ${environment.humidity}.` : null,
    environment?.ventilation ? `Ventilation level: ${environment.ventilation}.` : null,
    environment?.notes ? `House note: ${environment.notes}.` : null,
    Array.isArray(environment?.warnings) && environment.warnings.length ? `Environment alerts: ${environment.warnings.join(', ')}.` : null,
  ].filter(Boolean) as string[];

  const urgentBullets = [
    ...nextSteps,
    'Separate weak, off-feed, or dead birds from the healthy flock immediately.',
    'Check water lines, feeders, litter moisture, and ventilation in the same visit.',
  ];

  const monitorBullets = [
    'Count how many birds are dull, off-feed, or breathing with effort.',
    'Track whether water intake is falling, stable, or suddenly high.',
    'Look at droppings in at least 3 places in the house for color and consistency changes.',
    'Watch for neck twisting, paralysis, coughing, open-mouth breathing, or sudden deaths.',
    'Note whether the problem is limited to one age group or spreading across the whole flock.',
  ];

  const escalationBullets = [
    'Call a veterinarian quickly if mortality rises, birds stop eating, or neurological signs appear.',
    'Escalate immediately if many birds show respiratory distress at the same time.',
    'Do not start random antibiotics for a suspected viral problem without veterinary confirmation.',
  ];

  const preventionBullets = [
    ...prevention.map((item: string) => `Prevention step: ${item}.`),
    ...(treatmentOptions.length ? [`Known treatment options on file: ${treatmentOptions.join(', ')}.`] : []),
  ];

  const farmerWarnings = warnings.filter((warning: string) => !warning.startsWith('CRITICAL SAFETY WARNING:'));
  const criticalWarning = warnings.find((warning: string) => warning.startsWith('CRITICAL SAFETY WARNING:'));

  const response: {
    headline: string;
    overview: string;
    confidence: number | null;
    confidenceLabel: string;
    highlights: string[];
    images: ChatImage[];
    sections: ChatSection[];
  } = {
    headline: readableDisease ? `Possible issue: ${readableDisease}` : 'Health concern detected',
    overview: readableDisease
      ? `The flock may be showing signs consistent with ${readableDisease}. Start with isolation, close observation, and supportive care while preparing for veterinary confirmation.`
      : 'The symptoms are concerning, but they do not clearly point to one condition yet. Focus on isolation, monitoring, and sharing more details for a better recommendation.',
    confidence,
    confidenceLabel,
    highlights: highlightPoints,
    images: await getRelatedImages(readableDisease),
    sections: [
      { title: 'Likely issue', paragraphs: likelyIssueParagraphs },
      ...(causeBullets.length ? [{ title: 'Why this may be happening', bullets: causeBullets }] : []),
      ...(explanationParagraphs.length ? [{ title: 'Why this matters on the farm', paragraphs: explanationParagraphs }] : []),
      { title: 'What to do right now', bullets: urgentBullets, tone: 'success' as const },
      { title: 'What to monitor over the next 24 hours', bullets: monitorBullets },
      ...(medicineBullets.length ? [{ title: 'Treatment guidance to verify with a veterinarian', bullets: medicineBullets }] : []),
      ...(feedBullets.length ? [{ title: 'Feed and recovery support', bullets: feedBullets }] : []),
      ...(environmentBullets.length ? [{ title: 'House environment checks', bullets: environmentBullets }] : []),
      ...(preventionBullets.length ? [{ title: 'Prevention and flock protection', bullets: preventionBullets }] : []),
      { title: 'When this becomes urgent', bullets: escalationBullets, tone: 'warning' as const },
      ...(farmerWarnings.length ? [{ title: 'Warnings', bullets: farmerWarnings, tone: 'warning' as const }] : []),
      ...(criticalWarning ? [{ title: 'Critical safety note', paragraphs: [criticalWarning], tone: 'warning' as const }] : []),
    ] satisfies ChatSection[],
  };

  const adviceParts = [
    response.headline,
    '',
    response.overview,
    '',
    `Confidence: ${response.confidenceLabel}${typeof confidence === 'number' ? ` (${Math.round(confidence * 100)}%)` : ''}`,
    '',
    ...(response.highlights.length ? ['Key points:', ...response.highlights.map((highlight: string) => `- ${highlight}`), ''] : []),
    ...response.sections.flatMap((section) => [
      `${section.title}:`,
      ...(section.paragraphs || []),
      ...((section.bullets || []).map((bullet: string) => `- ${bullet}`)),
      '',
    ]),
  ];

  return {
    advice: adviceParts.join('\n').trim(),
    response,
  };
};

const runAnalysis = async (req: Request, res: Response) => {
  const symptoms = String(req.body.symptoms ?? '');
  const context = contextSchema.safeParse({
    farmId: req.body.farmId,
    batchId: req.body.batchId,
    flockSize: req.body.flockSize,
    ageInDays: req.body.ageInDays,
    temperatureC: req.body.temperatureC,
    humidityPercent: req.body.humidityPercent,
    feedType: req.body.feedType,
  });

  if (!context.success) {
    return res.status(400).json({ error: context.error.flatten() });
  }

  try {
    const media = await storageService.upload(req.file ?? undefined);
    const analysis = await aiCoreClient.analyze({
      symptoms,
      context: context.data,
      mediaUrl: media?.url ?? undefined,
      mediaBase64: media?.mediaBase64 ?? undefined,
      mediaMimeType: media?.mimeType ?? undefined,
    });

    return res.status(202).json({
      requestId: randomUUID(),
      media,
      analysis,
    });
  } catch (error: any) {
    console.error("Error connecting to aiCoreClient or uploading media:", error.message);
    return res.status(500).json({ error: "Analysis failed due to a server error." });
  }
};

diagnosisRouter.post('/analyze', upload.single('media'), runAnalysis);
diagnosisRouter.post('/upload', upload.single('media'), runAnalysis);

diagnosisRouter.get('/dataset-image/:folder/:filename', async (req, res) => {
  const folder = String(req.params.folder || '');
  const filename = String(req.params.filename || '');

  const allowedFolder = Object.values(datasetFolderByDisease).includes(folder);
  const safeFilename = path.basename(filename);
  const hasAllowedExtension = /\.(jpg|jpeg|png|webp)$/i.test(safeFilename);

  if (!allowedFolder || !hasAllowedExtension || safeFilename !== filename) {
    return res.status(400).json({ error: 'Invalid dataset image request.' });
  }

  const imagePath = path.join(datasetRoot, folder, safeFilename);

  try {
    await fs.access(imagePath);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.sendFile(imagePath);
  } catch {
    return res.status(404).json({ error: 'Dataset image not found.' });
  }
});

diagnosisRouter.post('/chat', async (req, res) => {
  const parsed = z.object({
    query: z.string().min(3),
    farmId: z.string().default('farm-demo-1'),
  }).safeParse({
    query: req.body.query,
    farmId: req.body.farmId,
  });

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const analysis = await aiCoreClient.analyze({
      symptoms: parsed.data.query,
      context: { farmId: parsed.data.farmId },
    });
    const { advice, response } = await buildChatResponse(analysis);

    return res.json({ advice, response, analysis });
  } catch (error: any) {
    console.error("Error connecting to aiCoreClient:", error.message);
    return res.status(500).json({ error: "Failed to connect to the Flocksy intelligence engine." });
  }
});
