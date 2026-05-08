import axios from 'axios';
import { env } from '../config/env.js';
import type { DiagnosisRequestPayload } from '../types/index.js';

const client = axios.create({
  baseURL: env.AI_CORE_URL,
  timeout: 15000,
});

export const aiCoreClient = {
  async analyze(payload: DiagnosisRequestPayload) {
    const { data } = await client.post('/analyze', payload);
    return data;
  },
};
