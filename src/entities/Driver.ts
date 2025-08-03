import { DriverType } from "../types.js";

export class Driver implements DriverType {
  constructor(public readonly data: DriverType) {
    Object.assign(this, data);
  }

  readonly broadcast_name = this.data.broadcast_name;
  readonly country_code = this.data.country_code;
  readonly driver_number = this.data.driver_number;
  readonly first_name = this.data.first_name;
  readonly full_name = this.data.full_name;
  readonly headshot_url = this.data.headshot_url;
  readonly last_name = this.data.last_name;
  readonly meeting_key = this.data.meeting_key;
  readonly name_acronym = this.data.name_acronym;
  readonly session_key = this.data.session_key;
  readonly team_colour = this.data.team_colour;
  readonly team_name = this.data.team_name;
}
