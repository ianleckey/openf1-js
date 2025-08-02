import { CarDataType } from "../types.js";

export class CarData {
  brake: number;
  date: string;
  driver_number: number;
  drs: number;
  meeting_key: number;
  n_gear: number;
  rpm: number;
  session_key: number;
  speed: number;
  throttle: number;

  constructor(data: CarDataType) {
    this.brake = data.brake;
    this.date = data.date;
    this.driver_number = data.driver_number;
    this.drs = data.drs;
    this.meeting_key = data.meeting_key;
    this.n_gear = data.n_gear;
    this.rpm = data.rpm;
    this.session_key = data.session_key;
    this.speed = data.speed;
    this.throttle = data.throttle;
  }

  get speedKmh(): number {
    return this.speed;
  }

  get throttlePercent(): string {
    return `${(this.throttle * 100).toFixed(0)}%`;
  }

  estimateDistance(travelTimeSec: number): number | null {
    if (typeof this.speed !== "number") return null;
    return this.speed * (travelTimeSec / 3600); // speed in km/h, result in km
  }

  static fromArray(data: CarDataType[]): CarData[] {
    return data.map((d) => new CarData(d));
  }
}
