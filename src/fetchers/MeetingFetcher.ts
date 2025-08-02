import { Transport } from "../transport/Transport.js";
import type { MeetingType } from "../types.js";
import { Meeting } from "../entities/Meeting.js";
import { Fetcher } from "./Fetcher.js";

export class MeetingFetcher extends Fetcher<MeetingType, Meeting> {
  constructor(transport: Transport) {
    super(transport, "meetings", Meeting.fromArray);
  }
}
