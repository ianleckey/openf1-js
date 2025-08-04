import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { FetchError, NotFoundError } from "../errors/OpenF1Error.js";

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
        const status = err?.response?.status;
        if (status === 429 && attempt < this.retries) {
          await new Promise((res) =>
            setTimeout(res, this.delay * Math.pow(2, attempt++))
          );
        } else if (status === 404) {
          throw new NotFoundError(endpoint);
        } else if (status) {
          throw new FetchError(
            `Failed to fetch ${endpoint}: ${err.message}`,
            status
          );
        } else {
          throw new FetchError(
            `Network or unknown error while fetching ${endpoint}: ${
              err?.message || err
            }`,
            undefined
          );
        }
      }
    }
    throw new FetchError("Transport: Exceeded max retry attempts.");
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
