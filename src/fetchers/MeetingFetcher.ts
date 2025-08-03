import type { MeetingType } from "../types.js";
import { Meeting } from "../entities/Meeting.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class MeetingFetcher extends Fetcher<MeetingType, Meeting> {
  constructor(transport: Transport) {
    super("meetings", transport, (rows) => rows.map((r) => new Meeting(r)));
  }
}
