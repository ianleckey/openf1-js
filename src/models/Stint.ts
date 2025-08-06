import { LapModel, DriverModel } from "./index.js";
import { Model } from "./Model.js";

export interface StintData {
  compound: string;
  driver_number: number;
  lap_end: number;
  lap_start: number;
  meeting_key: number | "latest";
  session_key: number | "latest";
  stint_number: number;
  tyre_age_at_start: number;
}

export class StintModel extends Model<StintData, StintModel> {
  static override endpoint = "stints";

  get compound(): string {
    return this._data.compound;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }

  get lapEnd(): number {
    return this._data.lap_end;
  }

  get lapStart(): number {
    return this._data.lap_start;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get sessionKey(): number | "latest" {
    return this._data.session_key;
  }

  get stintNumber(): number {
    return this._data.stint_number;
  }

  get tyreAgeAtStart(): number {
    return this._data.tyre_age_at_start;
  }

  async getDriver() {
    return await DriverModel.find({
      session_key: this.sessionKey,
      driver_number: this.driverNumber,
    });
  }

  async getLaps() {
    return await LapModel.find({
      session_key: this.sessionKey,
      lap_number: { gte: this.lapStart, lte: this.lapEnd },
      driver_number: this.driverNumber,
    });
  }
}
