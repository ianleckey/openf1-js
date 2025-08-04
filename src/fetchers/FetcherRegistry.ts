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
  PitFetcher,
  StintFetcher,
  StartingGridFetcher,
  LapFetcher,
  LocationFetcher,
} from "./index.js";

export type FetcherRegistry = {
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
  location: LocationFetcher;
  stint: StintFetcher;
  startingGrid: StartingGridFetcher;
  lap: LapFetcher;
};

export function createFetcherRegistry(transport: Transport): FetcherRegistry {
  return {
    pit: new PitFetcher(transport),
    session: new SessionFetcher(transport),
    driver: new DriverFetcher(transport),
    weather: new WeatherFetcher(transport),
    interval: new IntervalFetcher(transport),
    position: new PositionFetcher(transport),
    carData: new CarDataFetcher(transport),
    teamRadio: new TeamRadioFetcher(transport),
    raceControl: new RaceControlFetcher(transport),
    sessionResult: new SessionResultFetcher(transport),
    meeting: new MeetingFetcher(transport),
    location: new LocationFetcher(transport),
    stint: new StintFetcher(transport),
    startingGrid: new StartingGridFetcher(transport),
    lap: new LapFetcher(transport),
  };
}
