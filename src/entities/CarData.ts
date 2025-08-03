import { CarDataType } from "../types.js";

export class CarData implements CarDataType {
  constructor(public readonly data: CarDataType) {
    Object.assign(this, data);
  }

  readonly brake = this.data.brake;
  readonly date = this.data.date;
  readonly driver_number = this.data.driver_number;
  readonly drs = this.data.drs;
  readonly meeting_key = this.data.meeting_key;
  readonly n_gear = this.data.n_gear;
  readonly rpm = this.data.rpm;
  readonly session_key = this.data.session_key;
  readonly speed = this.data.speed;
  readonly throttle = this.data.throttle;

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
}
