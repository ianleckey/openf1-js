import { OpenF1Error } from "./errors.js";

export type Format = "json" | "csv";

/** Per-request options. */
export interface RequestOptions {
  /** Abort the request, e.g. from an `AbortController`. */
  signal?: AbortSignal;
}

export interface HttpConfig {
  baseURL: string;
  fetch: typeof fetch;
  timeoutMs: number;
  retries: number;
  headers: Record<string, string>;
  accessToken?: string | (() => string | Promise<string>);
}

/** Wait `ms`, rejecting early if `signal` aborts. */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true }
    );
  });
}

/** `AbortSignal.any` equivalent that also works on Node 18. */
function anySignal(signals: (AbortSignal | undefined)[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (!signal) continue;
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), {
      once: true,
    });
  }
  return controller.signal;
}

function retryDelay(res: Response, attempt: number): number {
  const header = res.headers.get("retry-after");
  const seconds = header === null ? NaN : Number(header);
  if (Number.isFinite(seconds)) return seconds * 1000;
  return 500 * 2 ** attempt;
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function httpGet(
  config: HttpConfig,
  endpoint: string,
  queryString: string,
  format: Format,
  options: RequestOptions = {}
): Promise<unknown> {
  const base = config.baseURL.endsWith("/") ? config.baseURL : config.baseURL + "/";
  const qs = format === "csv" ? (queryString ? queryString + "&csv=true" : "csv=true") : queryString;
  const url = base + endpoint + (qs ? "?" + qs : "");

  const headers: Record<string, string> = {
    Accept: format === "csv" ? "text/csv" : "application/json",
    ...config.headers,
  };
  if (config.accessToken) {
    const token =
      typeof config.accessToken === "function"
        ? await config.accessToken()
        : config.accessToken;
    headers.Authorization = `Bearer ${token}`;
  }

  for (let attempt = 0; ; attempt++) {
    const timeout = AbortSignal.timeout(config.timeoutMs);
    const signal = anySignal([options.signal, timeout]);
    let res: Response;
    try {
      res = await config.fetch(url, { headers, signal });
    } catch (cause) {
      throw new OpenF1Error(
        timeout.aborted
          ? `Request timed out after ${config.timeoutMs}ms: ${url}`
          : `Request failed: ${url}`,
        { url, cause }
      );
    }

    if (res.status === 429 && attempt < config.retries) {
      try {
        await sleep(retryDelay(res, attempt), options.signal);
      } catch (cause) {
        throw new OpenF1Error(`Request aborted: ${url}`, { url, status: 429, cause });
      }
      continue;
    }
    if (!res.ok) {
      const body = await readBody(res);
      const detail =
        typeof body === "object" && body !== null && "detail" in body
          ? `: ${String((body as { detail: unknown }).detail)}`
          : "";
      throw new OpenF1Error(`OpenF1 request failed with status ${res.status}${detail}`, {
        url,
        status: res.status,
        body,
      });
    }
    return format === "csv" ? res.text() : res.json();
  }
}
