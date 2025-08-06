import { Model } from "./Model.js";

export interface TelemetryData {
  brake: number; // 0 or 100
  date: string; // ISO 8601
  driver_number: number;
  drs: number;
  meeting_key: number | "latest";
  n_gear: number;
  rpm: number;
  session_key: number | "latest";
  speed: number;
  throttle: number;
}

export class TelemetryModel extends Model<TelemetryData, TelemetryModel> {
  static override endpoint = "car_data";

  get brake() {
    return this._data.brake;
  }

  get date() {
    return this._data.date;
  }

  get drs() {
    return this._data.drs;
  }

  get throttle() {
    return this._data.throttle;
  }

  get rpm() {
    return this._data.rpm;
  }

  get gear() {
    return this._data.n_gear;
  }

  get meetingKey() {
    return this._data.meeting_key;
  }

  get sessionKey() {
    return this._data.session_key;
  }

  get speed() {
    return this._data.speed;
  }

  get timestamp(): number {
    return new Date(this._data.date).getTime();
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }
}
