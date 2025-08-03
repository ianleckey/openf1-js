import { PitFetcher } from "./PitFetcher.js";
import { Transport } from "../transport/Transport.js";
import {
  CarDataFetcher,
  DriverFetcher,
  IntervalFetcher,
  MeetingFetcher,
  PositionFetcher,
  RaceControlFetcher,
  SessionResultFetcher,
  TeamRadioFetcher,
  WeatherFetcher,
  SessionFetcher,
} from "./index.js";

export interface FetcherRegistry {
  pit: PitFetcher;
  session: SessionFetcher;
  driver: DriverFetcher;
  weather: WeatherFetcher;
  interval: IntervalFetcher;
  position: PositionFetcher;
  carData: CarDataFetcher;
  teamRadio: TeamRadioFetcher;
  raceControl: RaceControlFetcher;
  sessionResult: SessionResultFetcher;
  meeting: MeetingFetcher;
}

export function createFetcherRegistry(transport: Transport): FetcherRegistry {
  const sessionRegistry = {} as FetcherRegistry;
  sessionRegistry.pit = new PitFetcher(transport);
  sessionRegistry.carData = new CarDataFetcher(transport);
  sessionRegistry.teamRadio = new TeamRadioFetcher(transport);
  sessionRegistry.raceControl = new RaceControlFetcher(transport);
  sessionRegistry.interval = new IntervalFetcher(transport);
  sessionRegistry.position = new PositionFetcher(transport);
  sessionRegistry.sessionResult = new SessionResultFetcher(transport);
  return {
    pit: new PitFetcher(transport),
    session: new SessionFetcher(transport, sessionRegistry),
    driver: new DriverFetcher(transport),
    weather: new WeatherFetcher(transport),
    interval: new IntervalFetcher(transport),
    position: new PositionFetcher(transport),
    carData: new CarDataFetcher(transport),
    teamRadio: new TeamRadioFetcher(transport),
    raceControl: new RaceControlFetcher(transport),
    sessionResult: new SessionResultFetcher(transport),
    meeting: new MeetingFetcher(transport),
  };
}
