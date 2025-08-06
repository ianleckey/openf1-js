import { Model } from "./Model.js";

export interface LocationData {
  date: string; // ISO 8601
  driver_number: number;
  meeting_key: number | "latest";
  session_key: number | "latest";
  x: number;
  y: number;
  z: number;
}

export class LocationModel extends Model<LocationData, LocationModel> {
  static override endpoint = "location";

  get coordinates(): { x: number; y: number; z: number } {
    return {
      x: this._data.x,
      y: this._data.y,
      z: this._data.z,
    };
  }

  get date(): string {
    return this._data.date;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get sessionKey(): number | "latest" {
    return this._data.session_key;
  }

  get timestamp(): number {
    return new Date(this._data.date).getTime();
  }
}
