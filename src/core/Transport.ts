// src/core/Transport.ts

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { FetchError } from "../errors/OpenF1Error.js";

export class Transport {
  private static _instance: Transport | null = null;
  private readonly client: AxiosInstance;
  private _accessToken: string | null = null;
  private _tokenType: string | null = null;
  private _tokenExpiresAt: number | null = null;

  constructor(
    private readonly baseUrl: string = "https://api.openf1.org/v1",
    accessTokenOrOptions?:
      | string
      | {
          access_token: string;
          expires_in: string;
          token_type: string;
        }
  ) {
    this.client = axios.create({
      baseURL: baseUrl,
    });

    if (typeof accessTokenOrOptions === "string") {
      this.setAccessToken(accessTokenOrOptions);
    } else if (accessTokenOrOptions) {
      this.setAccessToken(
        accessTokenOrOptions.access_token,
        accessTokenOrOptions.token_type,
        accessTokenOrOptions.expires_in
      );
    }

    axiosRetry(this.client, {
      retries: 3,
      retryDelay: (retryCount: number) => {
        return Math.min(1000 * retryCount, 5000);
      },
      retryCondition: (error: AxiosError) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.response?.status === 429 // rate limited
        );
      },
    });
  }

  /**
   * Set the OAuth2 access token to be used for requests.
   * @param token Access token string
   * @param tokenType Token type (default: 'bearer')
   * @param expiresIn Expiry in seconds (string or number)
   */
  setAccessToken(
    token: string,
    tokenType: string = "bearer",
    expiresIn?: string | number
  ) {
    this._accessToken = token;
    this._tokenType = tokenType;
    if (expiresIn) {
      const expires =
        typeof expiresIn === "string" ? parseInt(expiresIn, 10) : expiresIn;
      this._tokenExpiresAt = Date.now() + expires * 1000 - 10000; // 10s early buffer
    } else {
      this._tokenExpiresAt = null;
    }
  }

  /**
   * Check if the current access token is expired or about to expire.
   */
  isTokenExpired(): boolean {
    if (!this._accessToken || !this._tokenExpiresAt) return true;
    return Date.now() >= this._tokenExpiresAt;
  }

  /**
   * Obtain an OAuth2 access token from the OpenF1 API.
   * @param username API username
   * @param password API password
   * @returns Promise resolving to the access token string
   */
  static async fetchAccessToken(
    username: string,
    password: string
  ): Promise<{ access_token: string; expires_in: string; token_type: string }> {
    try {
      const res = await axios.post(
        "https://api.openf1.org/token",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      return {
        access_token: res.data.access_token,
        expires_in: res.data.expires_in,
        token_type: res.data.token_type,
      };
    } catch (err: any) {
      throw new FetchError(
        "Failed to obtain access token: " +
          (err.response?.data?.detail || err.message)
      );
    }
  }

  buildQueryParams(params: Record<string, any>): string {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        for (const [op, val] of Object.entries(value)) {
          const operatorMap: Record<string, string> = {
            eq: "=",
            lt: "<",
            lte: "<=",
            gt: ">",
            gte: ">=",
            ne: "!=",
          };
          const opStr = operatorMap[op] ?? "";
          // FIX: Do NOT encode operator, and only one '=' between key+operator and value
          parts.push(`${key}${opStr}${val}`);
        }
      } else if (Array.isArray(value)) {
        for (const v of value) {
          parts.push(`${key}=${encodeURIComponent(v)}`);
        }
      } else {
        parts.push(`${key}=${encodeURIComponent(value)}`);
      }
    }

    return parts.join("&");
  }

  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    if (this.isTokenExpired()) {
      throw new FetchError(
        "Access token expired. Please refresh your token and set it using setAccessToken()."
      );
    }
    try {
      const queryString = this.buildQueryParams(params);
      const headers: Record<string, string> = {};
      if (this._accessToken) {
        headers["Authorization"] = `Bearer ${this._accessToken}`;
      }
      const res: AxiosResponse<T> = await this.client.get(
        `${endpoint}?${queryString}`,
        { headers }
      );
      return res.data;
    } catch (err: any) {
      const code = err.response?.status;
      const msg = err.response?.statusText || err.message;
      if (code === 422 && err.response?.data?.detail) {
        throw new FetchError(
          `GET ${endpoint} failed (${code}): ${err.response.data.detail}`
        );
      }
      throw new FetchError(`GET ${endpoint} failed (${code}): ${msg}`);
    }
  }

  static getInstance(
    accessTokenOrOptions?:
      | string
      | {
          access_token: string;
          expires_in: string;
          token_type: string;
        }
  ): Transport {
    if (!Transport._instance) {
      Transport._instance = new Transport(undefined, accessTokenOrOptions);
    } else if (typeof accessTokenOrOptions === "string") {
      Transport._instance.setAccessToken(accessTokenOrOptions);
    } else if (accessTokenOrOptions) {
      Transport._instance.setAccessToken(
        accessTokenOrOptions.access_token,
        accessTokenOrOptions.token_type,
        accessTokenOrOptions.expires_in
      );
    }
    return Transport._instance;
  }
}
