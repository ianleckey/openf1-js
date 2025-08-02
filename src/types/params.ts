export interface BaseParams {
  meeting_key?: number;
  session_key?: number;
  driver_number?: number;
  [key: string]: any;
}

export type CarDataParams = BaseParams;
export type LapParams = BaseParams;
export type SessionParams = BaseParams;
export type SessionResultParams = BaseParams;
export type StartingGridParams = BaseParams;
export type StintParams = BaseParams;
export type PitParams = BaseParams;
export type PositionParams = BaseParams;
export type RaceControlParams = BaseParams;
export type LocationParams = BaseParams;
export type DriverParams = BaseParams;
export type IntervalParams = BaseParams;
export type TeamRadioParams = BaseParams;
export type WeatherParams = BaseParams;
