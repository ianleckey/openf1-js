import { StartingGridType } from "../types.js";

export class StartingGrid {
  position: number;
  driver_number: number;
  lap_duration: number;
  meeting_key: number;
  session_key: number;

  constructor(data: StartingGridType) {
    this.position = data.position;
    this.driver_number = data.driver_number;
    this.lap_duration = data.lap_duration;
    this.meeting_key = data.meeting_key;
    this.session_key = data.session_key;
  }

  static fromArray(data: StartingGridType[]): StartingGrid[] {
    return data.map((d) => new StartingGrid(d));
  }
}
