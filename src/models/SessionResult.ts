import { DriverData, DriverModel } from "./index.js";
import { Model } from "./Model.js";

export interface SessionResultData {
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  driver_number: number;
  duration: number | null; // seconds, null if dnf etc
  gap_to_leader: number | string | null; // seconds, "+1 LAP", or null if dnf etc
  number_of_laps: number;
  meeting_key: number | "latest";
  position: number;
  session_key: number | "latest";
}

export class SessionResultModel extends Model<
  SessionResultData,
  SessionResultModel
> {
  static override endpoint = "session_result";

  get dnf(): boolean {
    return this._data.dnf;
  }

  get dns(): boolean {
    return this._data.dns;
  }

  get dsq(): boolean {
    return this._data.dsq;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }

  get duration(): number | null {
    return this._data.duration;
  }

  get gapToLeader(): number | string | null {
    return this._data.gap_to_leader;
  }

  get numberOfLaps(): number {
    return this._data.number_of_laps;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get position(): number {
    return this._data.position;
  }

  get sessionKey(): number | "latest" {
    return this._data.session_key;
  }

  async getDriver() {
    return await DriverModel.find({
      session_key: this.sessionKey,
      driver_number: this.driverNumber,
    });
  }
}
