import { MeetingType } from "../types.js";

export class Meeting {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;

  constructor(data: MeetingType) {
    this.circuit_key = data.circuit_key;
    this.circuit_short_name = data.circuit_short_name;
    this.country_code = data.country_code;
    this.country_key = data.country_key;
    this.country_name = data.country_name;
    this.date_start = data.date_start;
    this.gmt_offset = data.gmt_offset;
    this.location = data.location;
    this.meeting_key = data.meeting_key;
    this.meeting_name = data.meeting_name;
    this.meeting_official_name = data.meeting_official_name;
    this.year = data.year;
  }

  static fromArray(data: MeetingType[]): Meeting[] {
    return data.map((d) => new Meeting(d));
  }
}
