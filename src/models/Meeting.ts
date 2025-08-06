import { Model } from "./Model.js";

export interface MeetingData {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number | "latest";
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

export class MeetingModel extends Model<MeetingData, MeetingModel> {
  static override endpoint = "meetings";

  get circuitKey(): number {
    return this._data.circuit_key;
  }

  get circuitName(): string {
    return this._data.circuit_short_name;
  }

  get countryCode(): string {
    return this._data.country_code;
  }

  get countryKey(): number {
    return this._data.country_key;
  }

  get countryName(): string {
    return this._data.country_name;
  }

  get dateStart(): string {
    return this._data.date_start;
  }

  get gmtOffset(): string {
    return this._data.gmt_offset;
  }

  get location(): string {
    return this._data.location;
  }

  get meetingName(): string {
    return this._data.meeting_name;
  }

  get meetingNameOfficial(): string {
    return this._data.meeting_official_name;
  }

  get year(): number {
    return this._data.year;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get sessions() {
    return {
      practice: this.practice,
      qualifying: this.qualifying,
      race: this.race,
    };
  }

  get practice() {
    /*return this.transport.get<SessionModel[]>("sessions", {
      meeting_key: this.meetingKey,
      session_type: "practice",
    });
    SessionModel.fromMany(data)
    */
    return false;
  }

  get qualifying() {
    /*return this.transport.get<SessionModel[]>("sessions", {
      meeting_key: this.meetingKey,
      session_type: "qualifying",
    });
    SessionModel.fromOne(data)
    */
    return false;
  }

  get race() {
    /*return this.transport.get<SessionModel[]>("sessions", {
      meeting_key: this.meetingKey,
      session_type: "race",
    });
    SessionModel.fromOne(data)
  */
    return false;
  }

  get isFinished(): boolean {
    // Placeholder for actual logic to determine if the meeting is finished
    return false;
  }

  get raceResult() {
    // Placeholder for actual logic
    return false;
  }
}
