import { Model } from "./Model.js";

export interface PitData {
  date: string;
  driver_number: number;
  lap_number: number;
  meeting_key: number | "latest";
  pit_duration: number;
  session_key: number | "latest";
}

export class PitModel extends Model<PitData, PitModel> {
  static override endpoint = "pit";
}
