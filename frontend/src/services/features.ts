import { http } from "./http";
import type { DiagnosisUploadPayload, ListResponse, Vet } from "@/types";

export const vetService = {
  list(): Promise<ListResponse<Vet>> {
    return http.get<ListResponse<Vet>>("/vets");
  },

  get(id: string): Promise<Vet> {
    return http.get<Vet>(`/vets/${id}`);
  },
};

export const farmService = {
  list(): Promise<ListResponse<{ id: string; name: string; location: string; flockSize: number; houseCount: number }>> {
    return http.get("/farms");
  },
};

export const diagnosisService = {
  /**
   * Upload an image (multipart) with optional symptoms for AI analysis.
   * @returns the analysis response; throws on failure.
   */
  async uploadImage(payload: DiagnosisUploadPayload): Promise<{ requestId: string; analysis: unknown }> {
    const formData = new FormData();
    if (payload.media) formData.append("media", payload.media);
    if (payload.symptoms) formData.append("symptoms", payload.symptoms);
    if (payload.farmId) formData.append("farmId", payload.farmId);
    if (payload.flockSize) formData.append("flockSize", String(payload.flockSize));
    if (payload.ageInDays) formData.append("ageInDays", String(payload.ageInDays));
    if (payload.temperatureC) formData.append("temperatureC", String(payload.temperatureC));
    if (payload.humidityPercent) formData.append("humidityPercent", String(payload.humidityPercent));

    return http.post("/diagnosis/analyze", undefined, { formData });
  },

  /** Text-only chat to the AI assistant. */
  async chat(query: string, farmId = "farm-demo-1"): Promise<{ advice: string; analysis?: unknown }> {
    return http.post("/diagnosis/chat", { query, farmId });
  },
};

export const userService = {
  profile(): Promise<{ user: Record<string, unknown> }> {
    return http.get("/users/profile");
  },
};