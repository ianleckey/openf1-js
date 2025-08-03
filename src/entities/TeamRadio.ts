import { TeamRadioType } from "../types.js";

export class TeamRadio implements TeamRadioType {
  constructor(public readonly data: TeamRadioType) {
    Object.assign(this, data);
  }

  readonly date = this.data.date;
  readonly driver_number = this.data.driver_number;
  readonly meeting_key = this.data.meeting_key;
  readonly recording_url = this.data.recording_url;
  readonly session_key = this.data.session_key;
}
