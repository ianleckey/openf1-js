// src/client/OpenF1.ts
import { Transport, OpenF1TransportOptions } from "../transport/Transport.js";
import { RaceWeekend } from "../entities/RaceWeekend.js";
import { SessionType, CarDataType } from "../types.js";

export class OpenF1 {
  private transport: Transport;

  constructor(options: OpenF1TransportOptions = {}) {
    this.transport = new Transport(options);
  }

  /*
  async getSessions(params?: Record<string, any>): Promise<SessionType[]> {
    return this.transport.request<SessionType[]>("sessions", params);
  }

  async getCarData(params?: Record<string, any>): Promise<CarDataType[]> {
    return this.transport.request<CarDataType[]>("car_data", params);
  }
    */

  getRaceWeekend(meetingKey: number): RaceWeekend {
    return new RaceWeekend(meetingKey, this.transport);
  }
}
