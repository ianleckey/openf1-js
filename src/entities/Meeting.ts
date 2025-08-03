import { MeetingType } from "../types.js";

export class Meeting implements MeetingType {
  constructor(public readonly data: MeetingType) {
    Object.assign(this, data);
  }

  readonly circuit_key = this.data.circuit_key;
  readonly circuit_short_name = this.data.circuit_short_name;
  readonly country_code = this.data.country_code;
  readonly country_key = this.data.country_key;
  readonly country_name = this.data.country_name;
  readonly date_start = this.data.date_start;
  readonly gmt_offset = this.data.gmt_offset;
  readonly location = this.data.location;
  readonly meeting_key = this.data.meeting_key;
  readonly meeting_name = this.data.meeting_name;
  readonly meeting_official_name = this.data.meeting_official_name;
  readonly year = this.data.year;
}
