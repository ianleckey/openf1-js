import { Fetcher } from "./Fetcher.js";
import { Session } from "../entities/Session.js";
import { Transport } from "../transport/Transport.js";
import { SessionType } from "../types.js";
import { FetcherRegistry } from "./FetcherRegistry.js";

export class SessionFetcher extends Fetcher<SessionType, Session> {
  constructor(transport: Transport, private fetchers: FetcherRegistry) {
    super("sessions", transport, (rows) =>
      rows.map((r) => new Session(r, this.fetchers))
    );
  }
}
