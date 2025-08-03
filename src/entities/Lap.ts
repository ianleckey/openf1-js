import { LapType } from "../types.js";

export class Lap implements LapType {
  constructor(public readonly data: LapType) {
    Object.assign(this, data);
  }

  readonly date_start = this.data.date_start;
  readonly driver_number = this.data.driver_number;
  readonly duration_sector_1 = this.data.duration_sector_1;
  readonly duration_sector_2 = this.data.duration_sector_2;
  readonly duration_sector_3 = this.data.duration_sector_3;
  readonly i1_speed = this.data.i1_speed;
  readonly i2_speed = this.data.i2_speed;
  readonly is_pit_out_lap = this.data.is_pit_out_lap;
  readonly lap_duration = this.data.lap_duration;
  readonly lap_number = this.data.lap_number;
  readonly meeting_key = this.data.meeting_key;
  readonly segments_sector_1 = this.data.segments_sector_1;
  readonly segments_sector_2 = this.data.segments_sector_2;
  readonly segments_sector_3 = this.data.segments_sector_3;
  readonly session_key = this.data.session_key;
  readonly st_speed = this.data.st_speed;

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
}
