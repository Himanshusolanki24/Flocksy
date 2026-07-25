import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { env } from '../config/env.js';
import { aiCoreClient } from '../services/aiCoreClient.js';
import { storageService } from '../services/storageService.js';
import type { DiagnosisCaseRecord } from '../types/index.js';

const upload = multer({ storage: multer.memoryStorage() });
export const diagnosisRouter = Router();

const caseStore = new Map<string, DiagnosisCaseRecord>();

const contextSchema = z.object({
  farmId: z.string().min(1),
  batchId: z.string().optional(),
  flockSize: z.coerce.number().optional(),
  ageInDays: z.coerce.number().optional(),
  temperatureC: z.coerce.number().optional(),
  humidityPercent: z.coerce.number().optional(),
  feedType: z.string().optional(),
});

const caseSchema = z.object({
  symptoms: z.string().default(''),
  symptomChecklist: z.array(z.string().min(1)).default([]),
  language: z.string().default('en'),
});

const chatSchema = z.object({
  query: z.string().min(1),
  farmId: z.string().min(1),
  batchId: z.string().optional(),
  flockSize: z.coerce.number().optional(),
  ageInDays: z.coerce.number().optional(),
  temperatureC: z.coerce.number().optional(),
  humidityPercent: z.coerce.number().optional(),
  feedType: z.string().optional(),
  language: z.string().default('en'),
  symptomChecklist: z.array(z.string().min(1)).default([]),
});

type ReferenceImage = {
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

const getReferenceImages = async (diseaseName: string | null): Promise<ReferenceImage[]> => {
  const folder = getDatasetFolder(diseaseName);
  if (!folder) {
    return [];
  }

  try {
    const files = (await fs.readdir(path.join(datasetRoot, folder)))
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));
    const selected = pickEvenlySpacedFiles(files, 4);

    return selected.map((file, index) => ({
      title: `${toSentenceCase(folder)} reference ${index + 1}`,
      src: `http://localhost:${env.PORT}/api/v1/diagnosis/dataset-image/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`,
      alt: `${toSentenceCase(folder)} training reference`,
      caption: `Reference image from the local disease dataset for ${toSentenceCase(folder)}.`,
    }));
  } catch {
    return [];
  }
};

const parseChecklist = (rawValue: unknown): string[] => {
  if (Array.isArray(rawValue)) {
    return rawValue.map(String).filter(Boolean);
  }

  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
      } catch {
        return [];
      }
    }
    return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

const createCase = async (req: any, res: any) => {
  const parsedCase = caseSchema.safeParse({
    symptoms: req.body.symptoms,
    symptomChecklist: parseChecklist(req.body.symptomChecklist),
    language: req.body.language,
  });
  const context = contextSchema.safeParse({
    farmId: req.body.farmId,
    batchId: req.body.batchId,
    flockSize: req.body.flockSize,
    ageInDays: req.body.ageInDays,
    temperatureC: req.body.temperatureC,
    humidityPercent: req.body.humidityPercent,
    feedType: req.body.feedType,
  });

  if (!parsedCase.success || !context.success) {
    return res.status(400).json({
      error: {
        case: parsedCase.success ? null : parsedCase.error.flatten(),
        context: context.success ? null : context.error.flatten(),
      },
    });
  }

  try {
    const media = await storageService.upload(req.file ?? undefined);
    const analysis = await aiCoreClient.analyze({
      symptoms: parsedCase.data.symptoms,
      symptomChecklist: parsedCase.data.symptomChecklist,
      language: parsedCase.data.language,
      context: context.data,
      mediaUrl: media?.url ?? undefined,
      mediaBase64: media?.mediaBase64 ?? undefined,
      mediaMimeType: media?.mimeType ?? undefined,
    });

    const result = analysis?.result ?? {};
    const diseaseName = String(result.top_disease || '');
    const caseId = String(result.case_id || `case_${randomUUID()}`);
    const createdAt = new Date().toISOString();
    const referenceImages = await getReferenceImages(diseaseName || null);

    const record: DiagnosisCaseRecord = {
      caseId,
      createdAt,
      status: String(result.diagnosis_status || analysis?.status || 'completed'),
      media: media
        ? {
          url: media.url,
          mimeType: media.mimeType,
          filename: media.filename,
        }
        : null,
      result: {
        ...result,
        referenceImages,
      },
    };

    caseStore.set(caseId, record);

    return res.status(202).json(record);
  } catch (error: any) {
    console.error('Diagnosis case creation failed:', error?.message || error);
    return res.status(500).json({ error: 'Analysis failed due to a server error.' });
  }
};

diagnosisRouter.post('/cases', upload.single('media'), createCase);
diagnosisRouter.post('/analyze', upload.single('media'), createCase);
diagnosisRouter.post('/upload', upload.single('media'), createCase);

diagnosisRouter.post('/chat', async (req, res) => {
  const parsed = chatSchema.safeParse({
    query: req.body.query,
    farmId: req.body.farmId,
    batchId: req.body.batchId,
    flockSize: req.body.flockSize,
    ageInDays: req.body.ageInDays,
    temperatureC: req.body.temperatureC,
    humidityPercent: req.body.humidityPercent,
    feedType: req.body.feedType,
    language: req.body.language,
    symptomChecklist: parseChecklist(req.body.symptomChecklist),
  });

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const { query, symptomChecklist, language, ...context } = parsed.data;
    const analysis = await aiCoreClient.analyze({
      symptoms: query,
      symptomChecklist,
      language,
      context,
    });

    const result = analysis?.result ?? {};
    const diseaseName = String(result.top_disease || '');
    const referenceImages = await getReferenceImages(diseaseName || null);
    const summary =
      result?.localized_response?.summary ||
      result?.localized_response?.headline ||
      'The chatbot completed the flock analysis.';

    if (analysis?.result) {
      analysis.result.referenceImages = referenceImages;
    }

    return res.json({
      advice: summary,
      caseId: result.case_id || null,
      analysis,
    });
  } catch (error: any) {
    console.error('Diagnosis chat failed:', error?.message || error);
    return res.status(500).json({ error: 'Chat analysis failed due to a server error.' });
  }
});

diagnosisRouter.get('/cases/:caseId', (req, res) => {
  const record = caseStore.get(String(req.params.caseId));
  if (!record) {
    return res.status(404).json({ error: 'Diagnosis case not found.' });
  }
  return res.json(record);
});

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
