import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface TransportOptions {
  baseURL?: string;
  retries?: number;
  retryDelayMs?: number;
  mode?: "json" | "csv";
}

export class Transport {
  private axios: AxiosInstance;
  private retries: number;
  private delay: number;
  private mode: "json" | "csv";

  constructor(opts: TransportOptions = {}) {
    this.retries = opts.retries ?? 3;
    this.delay = opts.retryDelayMs ?? 500;
    this.mode = opts.mode ?? "json";

    this.axios = axios.create({
      baseURL: opts.baseURL || "https://api.openf1.org/v1/",
    });
  }

  private async retry<T>(
    endpoint: string,
    config: AxiosRequestConfig
  ): Promise<T> {
    let attempt = 0;
    while (attempt <= this.retries) {
      try {
        const res = await this.axios.get(endpoint, config);
        return res.data;
      } catch (err: any) {
        if (err?.response?.status === 429 && attempt < this.retries) {
          await new Promise((res) =>
            setTimeout(res, this.delay * Math.pow(2, attempt++))
          );
        } else {
          throw err;
        }
      }
    }
    throw new Error("Transport: Exceeded max retry attempts.");
  }

  async request<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    if (this.mode === "csv") params.csv = true;

    const config: AxiosRequestConfig = {
      params,
      headers: this.mode === "csv" ? { Accept: "text/csv" } : undefined,
      responseType: this.mode === "csv" ? "text" : "json",
    };

    return this.retry<T>(endpoint, config);
  }
}
