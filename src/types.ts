// Response types for each OpenF1 endpoint.
// Field reference: https://openf1.org/docs

/** Car telemetry sampled at roughly 3.7 Hz. */
export interface CarData {
  /** Whether the brake pedal is pressed (100) or not (0). */
  brake: number;
  /** UTC date and time, ISO 8601. */
  date: string;
  driver_number: number;
  /** DRS status: 0/1 off, 8 detected (eligible in activation zone), 10/12/14 on. `null` from 2026 onwards, when DRS was removed from the regulations. */
  drs: number | null;
  meeting_key: number;
  /** Current gear, 1-8. 0 is neutral or no gear engaged. */
  n_gear: number;
  /** Engine revolutions per minute. */
  rpm: number;
  session_key: number;
  /** Speed in km/h. */
  speed: number;
  /** Throttle pedal position, 0-100 %. */
  throttle: number;
}

/** Championship standings for drivers, before and after a race. Beta, race sessions only. */
export interface ChampionshipDriver {
  driver_number: number;
  meeting_key: number;
  /** Points after the session. */
  points_current: number;
  /** Points before the session. */
  points_start: number;
  /** Championship position after the session. */
  position_current: number;
  /** Championship position before the session. */
  position_start: number;
  session_key: number;
}

/** Championship standings for teams, before and after a race. Beta, race sessions only. */
export interface ChampionshipTeam {
  meeting_key: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
  session_key: number;
  team_name: string;
}

/** Driver information for a session. */
export interface Driver {
  /** Name as shown on TV graphics, e.g. "M VERSTAPPEN". */
  broadcast_name: string;
  /** @deprecated Slated for removal by OpenF1 at the end of 2026; often `null` already. */
  country_code: string | null;
  driver_number: number;
  first_name: string;
  full_name: string;
  /** URL of the driver's face photo. */
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  /** Three-letter acronym, e.g. "VER". */
  name_acronym: string;
  session_key: number;
  /** Team colour as a hex RGB string without the leading `#`, e.g. "3671C6". */
  team_colour: string;
  team_name: string;
}

/** Gaps between drivers, updated about every 4 seconds. Race sessions only. */
export interface Interval {
  date: string;
  driver_number: number;
  /** Seconds to the race leader, "+1 LAP"-style string when lapped, or `null` for the leader. */
  gap_to_leader: number | string | null;
  /** Seconds to the car ahead, "+1 LAP"-style string when lapped, or `null` for the leader. */
  interval: number | string | null;
  meeting_key: number;
  session_key: number;
}

/** Detailed information about a single lap. */
export interface Lap {
  /** Approximate UTC start time of the lap, ISO 8601. */
  date_start: string | null;
  driver_number: number;
  /** Sector 1 time in seconds. */
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  /** Speed (km/h) at the first intermediate point. */
  i1_speed: number | null;
  /** Speed (km/h) at the second intermediate point. */
  i2_speed: number | null;
  /** Whether this is the lap out of the pits. */
  is_pit_out_lap: boolean;
  /** Total lap time in seconds. */
  lap_duration: number | null;
  lap_number: number;
  meeting_key: number;
  /** Mini-sector colour codes for sector 1. Not available during races. Cannot be filtered. */
  segments_sector_1: (number | null)[] | null;
  segments_sector_2: (number | null)[] | null;
  segments_sector_3: (number | null)[] | null;
  session_key: number;
  /** Speed (km/h) at the speed trap. */
  st_speed: number | null;
}

/** Approximate car position on the circuit, sampled at roughly 3.7 Hz. */
export interface Location {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  /** Cartesian coordinates. Do not include lateral position on track. */
  x: number;
  y: number;
  z: number;
}

/** A Grand Prix or testing weekend. */
export interface Meeting {
  circuit_image?: string;
  circuit_info_url?: string;
  circuit_key: number;
  circuit_short_name: string;
  circuit_type?: string;
  country_code: string;
  country_flag?: string;
  country_key: number;
  country_name: string;
  date_end?: string;
  date_start: string;
  /** Offset from UTC, e.g. "08:00:00". */
  gmt_offset: string;
  is_cancelled?: boolean;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

/** An on-track overtake. Race sessions only; may be incomplete. */
export interface Overtake {
  date: string;
  meeting_key: number;
  overtaken_driver_number: number;
  overtaking_driver_number: number;
  /** Position gained by the overtaking driver. */
  position: number;
  session_key: number;
}

/** A pit lane visit. */
export interface Pit {
  date: string;
  driver_number: number;
  /** Time spent in the pit lane, entry to exit, in seconds. */
  lane_duration?: number | null;
  lap_number: number;
  meeting_key: number;
  /** @deprecated Use `lane_duration`. Slated for removal by OpenF1 at the end of 2026. */
  pit_duration: number | null;
  session_key: number;
  /** Stationary time in seconds. Only available from the 2024 US GP onwards. */
  stop_duration?: number | null;
}

/** Driver positions throughout a session. */
export interface Position {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

/** Race control messages: flags, incidents, safety car, etc. */
export interface RaceControl {
  /** e.g. "Flag", "SafetyCar", "Drs", "CarEvent", "Other". */
  category: string;
  date: string;
  driver_number: number | null;
  /** e.g. "GREEN", "YELLOW", "DOUBLE YELLOW", "CHEQUERED", "BLACK AND WHITE". */
  flag: string | null;
  lap_number: number | null;
  meeting_key: number;
  message: string;
  /** Qualifying part (1, 2 or 3) when relevant. */
  qualifying_phase?: number | null;
  /** "Track", "Driver" or "Sector". */
  scope: string | null;
  /** Mini-sector the message refers to, when `scope` is "Sector". */
  sector: number | null;
  session_key: number;
}

/** A session (practice, qualifying, sprint, race) within a meeting. */
export interface Session {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  is_cancelled?: boolean;
  location: string;
  meeting_key: number;
  session_key: number;
  /** e.g. "Practice 1", "Qualifying", "Sprint", "Race". */
  session_name: string;
  /** e.g. "Practice", "Qualifying", "Race". */
  session_type: string;
  year: number;
}

/** Final classification of a session. */
export interface SessionResult {
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  driver_number: number;
  /** Total race time, or best lap time per qualifying part (`[Q1, Q2, Q3]`), in seconds. */
  duration: number | (number | null)[] | null;
  /** Gap to the winner/pole in seconds, a "+N LAP(S)" string, or per qualifying part. */
  gap_to_leader: number | string | (number | string | null)[] | null;
  meeting_key: number;
  number_of_laps: number | null;
  /** Championship points scored in this session. */
  points?: number | null;
  position: number | null;
  session_key: number;
}

/** Starting grid for a race. */
export interface StartingGrid {
  driver_number: number;
  /** Qualifying lap time in seconds. */
  lap_duration: number | null;
  meeting_key: number;
  position: number;
  session_key: number;
}

/** A stint: a run of consecutive laps on one set of tyres. */
export interface Stint {
  /** e.g. "SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET". */
  compound: string | null;
  driver_number: number;
  lap_end: number | null;
  lap_start: number | null;
  meeting_key: number;
  session_key: number;
  stint_number: number;
  /** Tyre age in laps at the start of the stint. */
  tyre_age_at_start: number | null;
}

/** A team radio recording. Only a selection of exchanges is published. */
export interface TeamRadio {
  date: string;
  driver_number: number;
  meeting_key: number;
  /** URL of the MP3 recording. */
  recording_url: string;
  session_key: number;
}

/** Track weather, updated every minute. */
export interface Weather {
  /** Air temperature in °C. */
  air_temperature: number;
  date: string;
  /** Relative humidity, %. */
  humidity: number;
  meeting_key: number;
  /** Air pressure in mbar. */
  pressure: number;
  /** Whether there is rainfall (1) or not (0). */
  rainfall: number;
  session_key: number;
  /** Track temperature in °C. */
  track_temperature: number;
  /** Wind direction in degrees, 0-359. */
  wind_direction: number;
  /** Wind speed in m/s. */
  wind_speed: number;
}

/** Maps each OpenF1 endpoint path to its record type. */
export interface Endpoints {
  car_data: CarData;
  championship_drivers: ChampionshipDriver;
  championship_teams: ChampionshipTeam;
  drivers: Driver;
  intervals: Interval;
  laps: Lap;
  location: Location;
  meetings: Meeting;
  overtakes: Overtake;
  pit: Pit;
  position: Position;
  race_control: RaceControl;
  session_result: SessionResult;
  sessions: Session;
  starting_grid: StartingGrid;
  stints: Stint;
  team_radio: TeamRadio;
  weather: Weather;
}

export type Endpoint = keyof Endpoints;
