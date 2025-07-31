export interface OpenF1Options {
  baseURL?: string;
  mode?: "json" | "csv";
}

export class OpenF1 {
  private axios: AxiosInstance;
  private mode: "json" | "csv";

  constructor(options: OpenF1Options = {}) {
    this.mode = options.mode === "csv" ? "csv" : "json";
    this.axios = axios.create({
      baseURL: options.baseURL || "https://api.openf1.org/v1/",
    });
  }

  private _request<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T | string> {
    const useCsv = this.mode === "csv";
    const reqParams = { ...(params || {}) };
    if (useCsv) reqParams.csv = true;
    return this.axios
      .get(endpoint, {
        params: reqParams,
        headers: useCsv ? { Accept: "text/csv" } : undefined,
        responseType: useCsv ? "text" : "json",
      })
      .then((res) => res.data);
  }

  async getSessions(params?: Record<string, any>): Promise<Session[] | string> {
    return this._request<Session[]>("sessions", params);
  }
  async getSessionResult(
    params?: Record<string, any>
  ): Promise<SessionResult[] | string> {
    return this._request<SessionResult[]>("session_result", params);
  }
  async getStartingGrid(
    params?: Record<string, any>
  ): Promise<StartingGrid[] | string> {
    return this._request<StartingGrid[]>("starting_grid", params);
  }
  async getStints(params?: Record<string, any>): Promise<Stint[] | string> {
    return this._request<Stint[]>("stints", params);
  }
  async getMeetings(params?: Record<string, any>): Promise<Meeting[] | string> {
    return this._request<Meeting[]>("meetings", params);
  }
  async getPit(params?: Record<string, any>): Promise<Pit[] | string> {
    return this._request<Pit[]>("pit", params);
  }
  async getPosition(
    params?: Record<string, any>
  ): Promise<Position[] | string> {
    return this._request<Position[]>("position", params);
  }
  async getRaceControl(
    params?: Record<string, any>
  ): Promise<RaceControl[] | string> {
    return this._request<RaceControl[]>("race_control", params);
  }
  async getLocation(
    params?: Record<string, any>
  ): Promise<Location[] | string> {
    return this._request<Location[]>("location", params);
  }
  async getLaps(params?: Record<string, any>): Promise<Lap[] | string> {
    return this._request<Lap[]>("laps", params);
  }
  async getLapTimes(params?: Record<string, any>): Promise<any[] | string> {
    return this._request<any[]>("lap_times", params);
  }
  async getCarData(params?: Record<string, any>): Promise<CarData[] | string> {
    return this._request<CarData[]>("car_data", params);
  }
  async getDrivers(params?: Record<string, any>): Promise<Driver[] | string> {
    return this._request<Driver[]>("drivers", params);
  }
  async getIntervals(
    params?: Record<string, any>
  ): Promise<Interval[] | string> {
    return this._request<Interval[]>("intervals", params);
  }
}
import axios, { AxiosInstance } from "axios";
import type {
  CarData,
  Driver,
  Interval,
  Lap,
  Location,
  Meeting,
  Pit,
  Position,
  RaceControl,
  Session,
  SessionResult,
  StartingGrid,
  Stint,
} from "./types";
