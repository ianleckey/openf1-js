import { DriverModel } from "./index.js";
import { Model } from "./Model.js";

export interface StartingGridData {
  position: number;
  driver_number: number;
  lap_duration: number;
  meeting_key: number | "latest";
  session_key: number | "latest";
}

export class StartingGridModel extends Model<
  StartingGridData,
  StartingGridModel
> {
  static override endpoint = "starting_grid";

  get position(): number {
    return this._data.position;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }

  get lapDuration(): number {
    return this._data.lap_duration;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get sessionKey(): number | "latest" {
    return this._data.session_key;
  }

  get isPole(): boolean {
    return this.position === 1;
  }

  get isFrontRow(): boolean {
    return this.position <= 2;
  }

  async getDriver() {
    return await DriverModel.find({
      session_key: this.sessionKey,
      driver_number: this.driverNumber,
    });
  }
}
