import { RaceControlType } from "../types.js";

export class RaceControl {
  category: string;
  date: string;
  driver_number: number;
  flag: string;
  lap_number: number;
  meeting_key: number;
  message: string;
  scope: string;
  sector: number | null;
  session_key: number;

  constructor(data: RaceControlType) {
    this.category = data.category;
    this.date = data.date;
    this.driver_number = data.driver_number;
    this.flag = data.flag;
    this.lap_number = data.lap_number;
    this.meeting_key = data.meeting_key;
    this.message = data.message;
    this.scope = data.scope;
    this.sector = data.sector;
    this.session_key = data.session_key;
  }

  get normalizedCategory(): string {
    const text = this.category.toLowerCase();
    if (text.includes("flag")) return "flag";
    if (text.includes("safety car")) return "safety_car";
    if (text.includes("virtual safety car")) return "vsc";
    if (text.includes("track clear")) return "track_clear";
    if (text.includes("drs")) return "drs";
    return "other";
  }

  isFlag(): boolean {
    return this.normalizedCategory === "flag";
  }

  isSafetyCar(): boolean {
    return this.normalizedCategory === "safety_car";
  }

  isVSC(): boolean {
    return this.normalizedCategory === "vsc";
  }

  isTrackClear(): boolean {
    return this.normalizedCategory === "track_clear";
  }

  isDRS(): boolean {
    return this.normalizedCategory === "drs";
  }

  static fromArray(data: RaceControlType[]): RaceControl[] {
    return data.map((d) => new RaceControl(d));
  }
}
