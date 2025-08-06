// src/models/Driver.ts

import { LapModel } from "./Lap.js";
import { Model } from "./Model.js";

export interface DriverData {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number | "latest";
  name_acronym: string;
  session_key: number | "latest";
  team_colour: string;
  team_name: string;
}

export class DriverModel extends Model<DriverData, DriverModel> {
  static override endpoint = "drivers";

  get driverNumber() {
    return this._data.driver_number;
  }

  get broadcastName() {
    return this._data.broadcast_name;
  }

  get fullName() {
    return this._data.full_name;
  }

  get meetingKey() {
    return this._data.meeting_key;
  }

  get sessionKey() {
    return this._data.session_key;
  }

  async getLapsForSession() {
    const data = await LapModel.where({
      meeting_key: this.meetingKey,
      driver_number: this.driverNumber,
      session_key: this.sessionKey,
    });
    return LapModel.fromMany(data);
  }
}
