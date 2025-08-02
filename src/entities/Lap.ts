import { LapType } from "../types.js";

export class Lap {
  date_start: string;
  driver_number: number;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  i1_speed: number;
  i2_speed: number;
  is_pit_out_lap: boolean;
  lap_duration: number;
  lap_number: number;
  meeting_key: number;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
  session_key: number;
  st_speed: number;

  constructor(data: LapType) {
    this.date_start = data.date_start;
    this.driver_number = data.driver_number;
    this.duration_sector_1 = data.duration_sector_1;
    this.duration_sector_2 = data.duration_sector_2;
    this.duration_sector_3 = data.duration_sector_3;
    this.i1_speed = data.i1_speed;
    this.i2_speed = data.i2_speed;
    this.is_pit_out_lap = data.is_pit_out_lap;
    this.lap_duration = data.lap_duration;
    this.lap_number = data.lap_number;
    this.meeting_key = data.meeting_key;
    this.segments_sector_1 = data.segments_sector_1;
    this.segments_sector_2 = data.segments_sector_2;
    this.segments_sector_3 = data.segments_sector_3;
    this.session_key = data.session_key;
    this.st_speed = data.st_speed;
  }

  get durationMs(): number {
    return this.lap_duration * 1000;
  }

  deltaTo(reference: Lap): number {
    return this.lap_duration - reference.lap_duration;
  }

  formattedDeltaTo(reference: Lap): string {
    const delta = this.deltaTo(reference);
    const sign = delta >= 0 ? "+" : "-";
    return `${sign}${Math.abs(delta).toFixed(3)}s`;
  }

  static fromArray(data: LapType[]): Lap[] {
    return data.map((d) => new Lap(d));
  }
}
