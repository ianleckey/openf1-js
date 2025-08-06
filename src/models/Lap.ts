import { Model } from "./Model.js";

export interface LapData {
  date_start: string; // ISO 8601
  driver_number: number;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  i1_speed: number;
  i2_speed: number;
  is_pit_out_lap: boolean;
  lap_duration: number;
  lap_number: number;
  meeting_key: number | "latest";
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
  session_key: number | "latest";
  st_speed: number;
}

export class LapModel extends Model<LapData, LapModel> {
  static override endpoint = "laps";

  delta(reference: LapModel): number {
    return this.time - reference.time;
  }

  get time(): number {
    return this._data.lap_duration;
  }

  get timeFormatted(): string {
    //format to mm:ss.sss
    const minutes = Math.floor(this._data.lap_duration / 60);
    const seconds = (this._data.lap_duration % 60).toFixed(3);
    return `${minutes}:${seconds}`;
  }

  get speedTrap(): number {
    return this._data.st_speed;
  }

  get isOutLap(): boolean {
    return this._data.is_pit_out_lap;
  }

  get lapNumber(): number {
    return this._data.lap_number;
  }

  get sectorTimes(): number[] {
    return [this.sector1Time, this.sector2Time, this.sector3Time];
  }

  get sector1Time(): number {
    return this._data.duration_sector_1;
  }

  get sector2Time(): number {
    return this._data.duration_sector_2;
  }

  get sector3Time(): number {
    return this._data.duration_sector_3;
  }

  get driverNumber(): number {
    return this._data.driver_number;
  }
}
