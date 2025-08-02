import { TeamRadioType } from "../types.js";

export class TeamRadio {
  date: string;
  driver_number: number;
  meeting_key: number;
  recording_url: string;
  session_key: number;

  constructor(data: TeamRadioType) {
    this.date = data.date;
    this.driver_number = data.driver_number;
    this.meeting_key = data.meeting_key;
    this.recording_url = data.recording_url;
    this.session_key = data.session_key;
  }

  static fromArray(data: TeamRadioType[]): TeamRadio[] {
    return data.map((d) => new TeamRadio(d));
  }
}
