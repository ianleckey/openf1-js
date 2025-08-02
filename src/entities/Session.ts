import { SessionType } from "../types.js";

export class Session {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;

  constructor(data: SessionType) {
    this.circuit_key = data.circuit_key;
    this.circuit_short_name = data.circuit_short_name;
    this.country_code = data.country_code;
    this.country_key = data.country_key;
    this.country_name = data.country_name;
    this.date_end = data.date_end;
    this.date_start = data.date_start;
    this.gmt_offset = data.gmt_offset;
    this.location = data.location;
    this.meeting_key = data.meeting_key;
    this.session_key = data.session_key;
    this.session_name = data.session_name;
    this.session_type = data.session_type;
    this.year = data.year;
  }

  get isRace(): boolean {
    return this.session_type === "Race";
  }

  get startDate(): Date {
    return new Date(this.date_start);
  }

  get durationMs(): number | null {
    if (!this.date_start || !this.date_end) return null;
    return (
      new Date(this.date_end).getTime() - new Date(this.date_start).getTime()
    );
  }

  get durationMinutes(): number | null {
    const ms = this.durationMs;
    return ms !== null ? ms / 60000 : null;
  }

  static fromArray(data: SessionType[]): Session[] {
    return data.map((d) => new Session(d));
  }
}
