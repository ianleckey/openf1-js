import { Transport } from "../transport/Transport.js";
import type { SessionResultType } from "../types.js";
import { SessionResult } from "../entities/SessionResult.js";
import { Fetcher } from "./Fetcher.js";

export class SessionResultFetcher extends Fetcher<
  SessionResultType,
  SessionResult
> {
  constructor(transport: Transport) {
    super(transport, "session_results", SessionResult.fromArray);
  }
}
