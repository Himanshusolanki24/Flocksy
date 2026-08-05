import {
  mockCommunityPosts,
  mockFeedBatches,
  mockFinance,
  mockInventory,
  mockLessons,
  mockMarketPrices,
  mockMedicines,
  mockNotifications,
  mockSchemes,
  mockTransactions,
  mockVaccinations,
  mockVets,
  mockWeatherData,
} from "@/lib/mock";
import type {
  AppNotification,
  CommunityPost,
  FeedBatch,
  FinanceSummary,
  GovernmentScheme,
  InventoryItem,
  Lesson,
  MarketPrice,
  Medicine,
  Transaction,
  Vet,
  Vaccination,
  WeatherData,
} from "@/types";

/**
 * Catalog data services.
 *
 * Backend endpoints do not yet exist for these domains, so the services
 * return rich, realistic seed data. Swap the bodies for real HTTP calls as
 * the corresponding backend routes ship — the UI layer stays unchanged.
 */

/** Small async delay to mimic real network latency. */
const latency = () => new Promise((resolve) => setTimeout(resolve, 350));

export const weatherService = {
  async get(): Promise<WeatherData> {
    await latency();
    return mockWeatherData;
  },
};

export const marketService = {
  async prices(): Promise<MarketPrice[]> {
    await latency();
    return mockMarketPrices;
  },
};

export const inventoryService = {
  async list(): Promise<InventoryItem[]> {
    await latency();
    return mockInventory;
  },
};

export const feedService = {
  async batches(): Promise<FeedBatch[]> {
    await latency();
    return mockFeedBatches;
  },
};

export const medicineService = {
  async list(): Promise<Medicine[]> {
    await latency();
    return mockMedicines;
  },
};

export const vaccinationService = {
  async list(): Promise<Vaccination[]> {
    await latency();
    return mockVaccinations;
  },
};

export const schemeService = {
  async list(): Promise<GovernmentScheme[]> {
    await latency();
    return mockSchemes;
  },
};

export const vetCatalogService = {
  async list(): Promise<Vet[]> {
    await latency();
    return mockVets;
  },
};

export const learningService = {
  async lessons(): Promise<Lesson[]> {
    await latency();
    return mockLessons;
  },
};

export const communityService = {
  async posts(): Promise<CommunityPost[]> {
    await latency();
    return mockCommunityPosts;
  },
};

export const financeService = {
  async summary(): Promise<FinanceSummary> {
    await latency();
    return mockFinance;
  },
  async transactions(): Promise<Transaction[]> {
    await latency();
    return mockTransactions;
  },
};

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    await latency();
    return mockNotifications;
  },
};