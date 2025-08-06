import { DriverModel, MeetingModel, SessionModel } from "./index.js";

import { Model } from "./Model.js";

export interface TeamRadioData {
  date: string;
  driver_number: number;
  meeting_key: number | "latest";
  recording_url: string;
  session_key: number | "latest";
}

export class TeamRadioModel extends Model<TeamRadioData, TeamRadioModel> {
  static override endpoint = "team_radio";

  get date(): string {
    return this._data.date;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get recordingUrl(): string {
    return this._data.recording_url;
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

  async getMeeting() {
    return await MeetingModel.find({
      session_key: this.sessionKey,
    });
  }

  async getSession() {
    return await SessionModel.find({
      session_key: this.sessionKey,
    });
  }
}
