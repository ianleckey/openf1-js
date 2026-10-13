/** Thrown when an OpenF1 request fails: a non-2xx response, a timeout, or a network error. */
export class OpenF1Error extends Error {
  /** HTTP status code, or `undefined` for timeouts and network errors. */
  readonly status?: number;
  /** The full request URL. */
  readonly url: string;
  /** The parsed response body (JSON when possible, otherwise text). */
  readonly body?: unknown;

  constructor(
    message: string,
    init: { url: string; status?: number; body?: unknown; cause?: unknown }
  ) {
    super(message, { cause: init.cause });
    this.name = "OpenF1Error";
    this.status = init.status;
    this.url = init.url;
    this.body = init.body;
  }
}

/** True if this is OpenF1's "No results found." 404, i.e. the query matched nothing. */
export function isNoResults(error: unknown): boolean {
  return (
    error instanceof OpenF1Error &&
    error.status === 404 &&
    typeof error.body === "object" &&
    error.body !== null &&
    (error.body as { detail?: unknown }).detail === "No results found."
  );
}
