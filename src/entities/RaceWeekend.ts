import { Meeting } from "./Meeting.js";
import { Driver } from "./Driver.js";
import { Session } from "./Session.js";
import { FetcherRegistry } from "../fetchers/FetcherRegistry.js";
import { OpenF1Error } from "../errors/OpenF1Error.js";

export class RaceWeekend {
  private _meeting?: Meeting;
  private _sessions?: Session[];
  private _drivers?: Driver[];

  constructor(
    public readonly meetingKey: number,
    private readonly fetchers: Pick<
      FetcherRegistry,
      "meeting" | "session" | "driver"
    >
  ) {}

  async meeting(): Promise<Meeting> {
    if (!this._meeting) {
      const [meeting] = await this.fetchers.meeting.fetch({
        meeting_key: this.meetingKey,
      });
      if (!meeting)
        throw new OpenF1Error(`No meeting found for key ${this.meetingKey}`);
      this._meeting = meeting;
    }
    return this._meeting!;
  }

  async drivers(): Promise<Driver[]> {
    if (!this._drivers) {
      this._drivers = await this.fetchers.driver.fetch({
        meeting_key: this.meetingKey,
      });
    }
    return this._drivers;
  }

  async sessions(): Promise<Session[]> {
    if (!this._sessions) {
      this._sessions = await this.fetchers.session.fetch({
        meeting_key: this.meetingKey,
      });
    }
    return this._sessions;
  }

  loaded() {
    return {
      meeting: !!this._meeting,
      drivers: !!this._drivers,
      sessions: !!this._sessions,
    };
  }
}
