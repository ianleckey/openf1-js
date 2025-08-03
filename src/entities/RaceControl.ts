import { RaceControlType } from "../types.js";

export class RaceControl implements RaceControlType {
  constructor(public readonly data: RaceControlType) {
    Object.assign(this, data);
  }

  readonly category = this.data.category;
  readonly date = this.data.date;
  readonly driver_number = this.data.driver_number;
  readonly flag = this.data.flag;
  readonly lap_number = this.data.lap_number;
  readonly meeting_key = this.data.meeting_key;
  readonly message = this.data.message;
  readonly scope = this.data.scope;
  readonly sector = this.data.sector;
  readonly session_key = this.data.session_key;

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
}
