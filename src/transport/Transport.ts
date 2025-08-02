import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface OpenF1TransportOptions {
  baseURL?: string;
  mode?: "json" | "csv";
  maxRetries?: number;
  retryDelayMs?: number;
}

export class Transport {
  private axios: AxiosInstance;
  private mode: "json" | "csv";
  private maxRetries: number;
  private retryDelayMs: number;

  constructor(options: OpenF1TransportOptions = {}) {
    this.mode = options.mode === "csv" ? "csv" : "json";
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelayMs = options.retryDelayMs ?? 500;

    this.axios = axios.create({
      baseURL: options.baseURL || "https://api.openf1.org/v1/",
    });
  }

  private async requestWithRetry<T>(
    endpoint: string,
    config: AxiosRequestConfig
  ): Promise<T | string> {
    let attempt = 0;
    while (attempt <= this.maxRetries) {
      try {
        const res = await this.axios.get(endpoint, config);
        return res.data;
      } catch (error: any) {
        const isRateLimit = error?.response?.status === 429;
        if (isRateLimit && attempt < this.maxRetries) {
          const delay = this.retryDelayMs * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          attempt++;
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retry attempts exceeded");
  }

  async request<T = any>(endpoint: string, params?: Record<string, any>): Promise<T | string> {
    const useCsv = this.mode === "csv";
    const reqParams = { ...(params || {}) };
    if (useCsv) reqParams.csv = true;

    const config: AxiosRequestConfig = {
      params: reqParams,
      headers: useCsv ? { Accept: "text/csv" } : undefined,
      responseType: useCsv ? "text" : "json",
    };

    return this.requestWithRetry<T>(endpoint, config);
  }
}
