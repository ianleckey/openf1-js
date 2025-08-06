import { Model } from "./Model.js";

export interface PositionData {
  date: string;
  driver_number: number;
  meeting_key: number | "latest";
  position: number;
  session_key: number | "latest";
}

export class PositionModel extends Model<PositionData, PositionModel> {
  static override endpoint = "position";

  get position(): number {
    return this._data.position;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get sessionKey(): number | "latest" {
    return this._data.session_key;
  }

  get date(): string {
    return this._data.date;
  }

  get isInPoints(): boolean {
    return this.position <= 10;
  }

  get isLeading(): boolean {
    return this.position === 1;
  }
}
