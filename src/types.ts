export interface TeamRadioType {
  date: string;
  driver_number: number;
  meeting_key: number | "latest";
  recording_url: string;
  session_key: number | "latest";
}

export interface WeatherType {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number | "latest";
  pressure: number;
  rainfall: number;
  session_key: number | "latest";
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}
export interface SessionType {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number | "latest";
  session_key: number | "latest";
  session_name: string;
  session_type: string;
  year: number;
}

export interface SessionResultType {
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  driver_number: number;
  duration: number | null; // seconds, null if dnf etc
  gap_to_leader: number | string | null; // seconds, "+1 LAP", or null if dnf etc
  number_of_laps: number;
  meeting_key: number | "latest";
  position: number;
  session_key: number | "latest";
}

export interface StartingGridType {
  position: number;
  driver_number: number;
  lap_duration: number;
  meeting_key: number | "latest";
  session_key: number | "latest";
}

export interface StintType {
  compound: string;
  driver_number: number;
  lap_end: number;
  lap_start: number;
  meeting_key: number | "latest";
  session_key: number | "latest";
  stint_number: number;
  tyre_age_at_start: number;
}
export interface MeetingType {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number | "latest";
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

export interface PitType {
  date: string;
  driver_number: number;
  lap_number: number;
  meeting_key: number | "latest";
  pit_duration: number;
  session_key: number | "latest";
}

export interface PositionType {
  date: string;
  driver_number: number;
  meeting_key: number | "latest";
  position: number;
  session_key: number | "latest";
}

export interface RaceControlType {
  category: string;
  date: string;
  driver_number: number;
  flag: string;
  lap_number: number;
  meeting_key: number | "latest";
  message: string;
  scope: string;
  sector: number | null;
  session_key: number | "latest";
}
export interface LocationType {
  date: string; // ISO 8601
  driver_number: number;
  meeting_key: number | "latest";
  session_key: number | "latest";
  x: number;
  y: number;
  z: number;
}

// Types and interfaces for OpenF1 SDK
export interface LapType {
  date_start: string; // ISO 8601
  driver_number: number;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  i1_speed: number;
  i2_speed: number;
  is_pit_out_lap: boolean;
  lap_duration: number;
  lap_number: number;
  meeting_key: number | "latest";
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
  session_key: number | "latest";
  st_speed: number;
}

export interface CarDataType {
  brake: number; // 0 or 100
  date: string; // ISO 8601
  driver_number: number;
  drs: number;
  meeting_key: number | "latest";
  n_gear: number;
  rpm: number;
  session_key: number | "latest";
  speed: number;
  throttle: number;
}

export interface DriverType {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number | "latest";
  name_acronym: string;
  session_key: number | "latest";
  team_colour: string;
  team_name: string;
}

export interface IntervalType {
  date: string; // ISO 8601
  driver_number: number;
  gap_to_leader: number | string | null; // seconds, "+1 LAP", or null
  interval: number | string | null; // seconds, "+1 LAP", or null
  meeting_key: number | "latest";
  session_key: number | "latest";
}
