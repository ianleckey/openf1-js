import { Model } from "./Model.js";

export interface IntervalData {
  date: string; // ISO 8601
  driver_number: number;
  gap_to_leader: number | string | null; // seconds, "+1 LAP", or null
  interval: number | string | null; // seconds, "+1 LAP", or null
  meeting_key: number | "latest";
  session_key: number | "latest";
}

export class IntervalModel extends Model<IntervalData, IntervalModel> {
  static override endpoint = "interval";
}
