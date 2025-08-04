import { Fetcher } from "./Fetcher.js";
import { Session } from "../entities/Session.js";
import { Transport } from "../transport/Transport.js";
import { SessionType } from "../types.js";
import {
  CarDataFetcher,
  IntervalFetcher,
  PitFetcher,
  PositionFetcher,
  RaceControlFetcher,
  SessionResultFetcher,
  TeamRadioFetcher,
} from "./index.js";

export class SessionFetcher extends Fetcher<SessionType, Session> {
  constructor(transport: Transport) {
    super("sessions", transport, (rows) =>
      rows.map(
        (r) =>
          new Session(r, {
            pit: new PitFetcher(transport),
            carData: new CarDataFetcher(transport),
            teamRadio: new TeamRadioFetcher(transport),
            raceControl: new RaceControlFetcher(transport),
            interval: new IntervalFetcher(transport),
            position: new PositionFetcher(transport),
            sessionResult: new SessionResultFetcher(transport),
          })
      )
    );
  }
}
