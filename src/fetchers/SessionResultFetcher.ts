import type { SessionResultType } from "../types.js";
import { SessionResult } from "../entities/SessionResult.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";
import { DriverFetcher } from "./DriverFetcher.js";

export class SessionResultFetcher extends Fetcher<
  SessionResultType,
  SessionResult
> {
  constructor(transport: Transport) {
    super("session_result", transport, (rows) => {
      return rows.map(
        (r) =>
          new SessionResult(r, {
            driver: new DriverFetcher(transport),
          })
      );
    });
  }
}
