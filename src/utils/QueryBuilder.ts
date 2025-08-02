export class QueryBuilder {
  private params: Record<string, any> = {};

  with(key: string, value: any): this {
    if (value !== undefined && value !== null) {
      this.params[key] = value;
    }
    return this;
  }

  withDriverNumber(driverNumber: number): this {
    return this.with("driver_number", driverNumber);
  }

  withSessionKey(sessionKey: number): this {
    return this.with("session_key", sessionKey);
  }

  withMeetingKey(meetingKey: number): this {
    return this.with("meeting_key", meetingKey);
  }

  withDateRange(start: string, end: string): this {
    return this.with("date_start", start).with("date_end", end);
  }

  withLapRange(min: number, max: number): this {
    return this.with("lap_number_gte", min).with("lap_number_lte", max);
  }

  withCustomParam(key: string, value: any): this {
    return this.with(key, value);
  }

  build(): Record<string, any> {
    return { ...this.params };
  }
}
