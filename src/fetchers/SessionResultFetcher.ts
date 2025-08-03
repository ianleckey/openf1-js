import type { SessionResultType } from "../types.js";
import { SessionResult } from "../entities/SessionResult.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class SessionResultFetcher extends Fetcher<
  SessionResultType,
  SessionResult
> {
  constructor(transport: Transport) {
    super("session_results", transport, (rows) =>
      rows.map((r) => new SessionResult(r))
    );
  }
}
