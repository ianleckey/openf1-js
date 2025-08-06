// src/OpenF1.ts

import {
  DriverModel,
  IntervalModel,
  LapModel,
  LocationModel,
  MeetingModel,
  PitModel,
  PositionModel,
  RaceControlModel,
  SessionModel,
  SessionResultModel,
  StartingGridModel,
  StintModel,
  TeamRadioModel,
  TelemetryModel,
  WeatherModel,
} from "./models/index.js";
import { QueryBuilder } from "./utils/QueryBuilder.js";
import { Transport } from "./core/Transport.js";
import { OpenF1Error } from "./errors/OpenF1Error.js";

export interface OpenF1Options {
  transportMode: "rest" | "websocket" | "mqtt";
  auth?: {
    username: string;
    password: string;
  };
}

/**
 * Main entry point for interacting with the OpenF1 API.
 * Provides access to all model classes, query builder, and legacy compatibility methods.
 *
 * @example
 * const api = new OpenF1();
 * const sessions = await api.Session.where({ year: 2023 });
 */
export class OpenF1 {
  // --- Model Classes ---

  /** Driver model class for querying driver data. */
  readonly Driver = DriverModel;
  /** Interval model class for querying interval data. */
  readonly Interval = IntervalModel;
  /** Lap model class for querying lap data. */
  readonly Lap = LapModel;
  /** Location model class for querying location data. */
  readonly Location = LocationModel;
  /** Meeting model class for querying meeting data. */
  readonly Meeting = MeetingModel;
  /** Pit model class for querying pit stop data. */
  readonly Pit = PitModel;
  /** Position model class for querying position data. */
  readonly Position = PositionModel;
  /** Race control model class for querying race control messages. */
  readonly RaceControl = RaceControlModel;
  /** Session model class for querying session data. */
  readonly Session = SessionModel;
  /** Session result model class for querying session results. */
  readonly SessionResult = SessionResultModel;
  /** Starting grid model class for querying starting grid data. */
  readonly StartingGrid = StartingGridModel;
  /** Stint model class for querying stint data. */
  readonly Stint = StintModel;
  /** Team radio model class for querying team radio messages. */
  readonly TeamRadio = TeamRadioModel;
  /** Telemetry model class for querying car telemetry data. */
  readonly Telemetry = TelemetryModel;
  /** Weather model class for querying weather data. */
  readonly Weather = WeatherModel;

  /**
   * Query builder utility for constructing complex queries.
   * @type {QueryBuilder}
   * @see {@link QueryBuilder}
   */
  readonly QueryBuilder = QueryBuilder;
  readonly Transport = Transport;

  /**
   * Create an OpenF1 client instance.
   * @param {Object} [options]
   * @param {string} [options.accessToken] - Optional OAuth2 access token for authenticated requests.
   */

  constructor(options?: OpenF1Options) {
    if (options?.auth?.username && options?.auth?.password) {
      this.authenticate(options.auth.username, options.auth.password);
    }
  }

  async authenticate(username: string, password: string) {
    if (!username || !password) return;
    const token = await OpenF1.fetchAccessToken(username, password);
    if (!token) throw new OpenF1Error("Failed to authenticate");
    Transport.getInstance().setAccessToken(
      token.access_token,
      token.token_type,
      token.expires_in
    );
  }

  /**
   * Obtain an OAuth2 access token from the OpenF1 API.
   * @param username API username
   * @param password API password
   * @returns Promise resolving to the token response object
   */
  static async fetchAccessToken(
    username: string,
    password: string
  ): Promise<{ access_token: string; expires_in: string; token_type: string }> {
    return await Transport.fetchAccessToken(username, password);
  }

  // --- Deprecated compatibility methods ---

  /**
   * Fetch all sessions.
   * @deprecated Use {@link OpenF1.Session} or {@link SessionModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} List of sessions.
   */
  async getSessions(params?: Record<string, any>) {
    this._deprecationWarning("getSessions", "SessionModel");
    return await SessionModel.all(params || {});
  }

  /**
   * Fetch all session results.
   * @deprecated Use {@link OpenF1.SessionResult} or {@link SessionResultModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} List of session results.
   */
  async getSessionResult(params?: Record<string, any>) {
    this._deprecationWarning("getSessionResult", "SessionResultModel");
    return await SessionResultModel.all(params || {});
  }

  /**
   * Fetch starting grid data.
   * @deprecated Use {@link OpenF1.StartingGrid} or {@link StartingGridModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Starting grid data.
   */
  async getStartingGrid(params?: Record<string, any>) {
    this._deprecationWarning("getStartingGrid", "StartingGridModel");
    return await StartingGridModel.all(params || {});
  }

  /**
   * Fetch stint data.
   * @deprecated Use {@link OpenF1.Stint} or {@link StintModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Stint data.
   */
  async getStints(params?: Record<string, any>) {
    this._deprecationWarning("getStints", "StintModel");
    return await StintModel.all(params || {});
  }

  /**
   * Fetch meeting data.
   * @deprecated Use {@link OpenF1.Meeting} or {@link MeetingModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Meeting data.
   */
  async getMeetings(params?: Record<string, any>) {
    this._deprecationWarning("getMeetings", "MeetingModel");
    return await MeetingModel.all(params || {});
  }

  /**
   * Fetch pit stop data.
   * @deprecated Use {@link OpenF1.Pit} or {@link PitModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Pit stop data.
   */
  async getPit(params?: Record<string, any>) {
    this._deprecationWarning("getPit", "PitModel");
    return await PitModel.all(params || {});
  }

  /**
   * Fetch position data.
   * @deprecated Use {@link OpenF1.Position} or {@link PositionModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Position data.
   */
  async getPosition(params?: Record<string, any>) {
    this._deprecationWarning("getPosition", "PositionModel");
    return await PositionModel.all(params || {});
  }

  /**
   * Fetch race control messages.
   * @deprecated Use {@link OpenF1.RaceControl} or {@link RaceControlModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Race control messages.
   */
  async getRaceControl(params?: Record<string, any>) {
    this._deprecationWarning("getRaceControl", "RaceControlModel");
    return await RaceControlModel.all(params || {});
  }

  /**
   * Fetch location data.
   * @deprecated Use {@link OpenF1.Location} or {@link LocationModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Location data.
   */
  async getLocation(params?: Record<string, any>) {
    this._deprecationWarning("getLocation", "LocationModel");
    return await LocationModel.all(params || {});
  }

  /**
   * Fetch lap data.
   * @deprecated Use {@link OpenF1.Lap} or {@link LapModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Lap data.
   */
  async getLaps(params?: Record<string, any>) {
    this._deprecationWarning("getLaps", "LapModel");
    return await LapModel.all(params || {});
  }

  /**
   * Fetch car telemetry data.
   * @deprecated Use {@link OpenF1.Telemetry} or {@link TelemetryModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Telemetry data.
   */
  async getCarData(params?: Record<string, any>) {
    this._deprecationWarning("getCarData", "TelemetryModel");
    return await TelemetryModel.all(params || {});
  }

  /**
   * Fetch driver data.
   * @deprecated Use {@link OpenF1.Driver} or {@link DriverModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Driver data.
   */
  async getDrivers(params?: Record<string, any>) {
    this._deprecationWarning("getDrivers", "DriverModel");
    return await DriverModel.all(params || {});
  }

  /**
   * Fetch interval data.
   * @deprecated Use {@link OpenF1.Interval} or {@link IntervalModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Interval data.
   */
  async getIntervals(params?: Record<string, any>) {
    this._deprecationWarning("getIntervals", "IntervalModel");
    return await IntervalModel.all(params || {});
  }

  /**
   * Fetch team radio messages.
   * @deprecated Use {@link OpenF1.TeamRadio} or {@link TeamRadioModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Team radio messages.
   */
  async getTeamRadio(params?: Record<string, any>) {
    this._deprecationWarning("getTeamRadio", "TeamRadioModel");
    return await TeamRadioModel.all(params || {});
  }

  /**
   * Fetch weather data.
   * @deprecated Use {@link OpenF1.Weather} or {@link WeatherModel} methods instead.
   * @param {Record<string, any>} [params] - Query parameters.
   * @returns {Promise<any[]>} Weather data.
   */
  async getWeather(params?: Record<string, any>) {
    this._deprecationWarning("getWeather", "WeatherModel");
    return await WeatherModel.all(params || {});
  }

  /**
   * Emit a deprecation warning for legacy methods.
   * @private
   * @param {string} oldMethod - Deprecated method name.
   * @param {string} newMethod - Recommended replacement.
   */
  private _deprecationWarning(oldMethod: string, newMethod: string) {
    if (process && process.emitWarning) {
      process.emitWarning(
        `[DEPRECATION] OpenF1.${oldMethod} is deprecated. Use OpenF1.${newMethod} instead.`,
        "DeprecationWarning"
      );
    } else {
      // fallback for browsers or environments without process.emitWarning
      console.warn(
        `[DEPRECATION] OpenF1.${oldMethod} is deprecated. Use OpenF1.${newMethod} instead.`
      );
    }
  }
}
