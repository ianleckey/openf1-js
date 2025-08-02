import { DriverType } from "../types.js";

export class Driver {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;

  constructor(data: DriverType) {
    this.broadcast_name = data.broadcast_name;
    this.country_code = data.country_code;
    this.driver_number = data.driver_number;
    this.first_name = data.first_name;
    this.full_name = data.full_name;
    this.headshot_url = data.headshot_url;
    this.last_name = data.last_name;
    this.meeting_key = data.meeting_key;
    this.name_acronym = data.name_acronym;
    this.session_key = data.session_key;
    this.team_colour = data.team_colour;
    this.team_name = data.team_name;
  }

  static fromArray(data: DriverType[]): Driver[] {
    return data.map((d) => new Driver(d));
  }
}
