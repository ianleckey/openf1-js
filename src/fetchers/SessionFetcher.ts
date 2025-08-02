import { Transport } from "../transport/Transport.js";
import type { SessionType } from "../types.js";
import { Session } from "../entities/Session.js";
import { Fetcher } from "./Fetcher.js";

export class SessionFetcher extends Fetcher<SessionType, Session> {
  constructor(transport: Transport) {
    super(transport, "sessions", Session.fromArray);
  }
}
