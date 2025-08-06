import { Model } from "./Model.js";

export interface RaceControlData {
  category: string;
  date: string;
  driver_number: number;
  flag: string;
  lap_number: number;
  meeting_key: number | "latest";
  message: string;
  scope: string;
  sector: number | null;
  session_key: number | "latest";
}

export class RaceControlModel extends Model<RaceControlData, RaceControlModel> {
  static override endpoint = "race_control";

  get category(): string {
    return this._data.category;
  }

  get date(): string {
    return this._data.date;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }

  get flag(): string {
    return this._data.flag;
  }

  get lapNumber(): number {
    return this._data.lap_number;
  }

  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }

  get message(): string {
    return this._data.message;
  }

  get scope(): string {
    return this._data.scope;
  }

  get sector(): number | null {
    return this._data.sector;
  }

  get sessionKey(): number | "latest" {
    return this._data.session_key;
  }

  get normalizedCategory(): string {
    const text = this.category.toLowerCase().replace(/_/g, " ");
    if (text.includes("flag")) return "flag";
    if (text.includes("safety car")) return "safety_car";
    if (text.includes("virtual safety car")) return "vsc";
    if (text.includes("track clear")) return "track_clear";
    if (text.includes("drs")) return "drs";
    return "other";
  }

  get isFlag(): boolean {
    return this.normalizedCategory === "flag";
  }

  get isYellowFlag(): boolean {
    return this.isFlag && this.flag.toLowerCase().includes("yellow");
  }

  get isGreenFlag(): boolean {
    return this.isFlag && this.flag.toLowerCase().includes("green");
  }

  get isRedFlag(): boolean {
    return this.isFlag && this.flag.toLowerCase().includes("red");
  }

  get isBlackAndWhiteFlag(): boolean {
    return this.isFlag && this.flag.toLowerCase().includes("black and white");
  }

  get isSafetyCar(): boolean {
    return this.normalizedCategory === "safety_car";
  }

  get isVSC(): boolean {
    return this.normalizedCategory === "vsc";
  }

  get isTrackClear(): boolean {
    return this.normalizedCategory === "track_clear";
  }

  get isDRS(): boolean {
    return this.normalizedCategory === "drs";
  }
}
