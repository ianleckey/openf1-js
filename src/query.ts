type Primitive = string | number | boolean;

/** Comparison operators supported by OpenF1. Combine them for ranges: `{ gte: 300, lt: 320 }`. */
export interface Range<V> {
  gt?: V;
  gte?: V;
  lt?: V;
  lte?: V;
}

/**
 * A filter on one field:
 * - a value for equality: `driver_number: 1`
 * - an array to match any of several values: `driver_number: [1, 44]`
 * - a range: `speed: { gte: 315 }`
 */
export type Filter<V> = V | V[] | Range<V>;

/** Dates are sent as ISO 8601; date fields accept `Date` objects as well as strings. */
type WithDate<K, V> = K extends `date${string}` ? V | Date : V;

type Filterable<V> = Exclude<V, null | undefined | unknown[]>;

/** `session_key` and `meeting_key` also accept `"latest"` for the current or most recent one. */
type KeyFilter<K, V> = K extends "session_key" | "meeting_key"
  ? Filter<V> | "latest"
  : Filter<WithDate<K, V>>;

/**
 * Typed query parameters for a record type `T`. Array-valued fields (e.g. lap segments)
 * are omitted because OpenF1 cannot filter on them.
 */
export type Query<T> = {
  [K in keyof T as [Filterable<T[K]>] extends [never] ? never : K]?: KeyFilter<
    K,
    Filterable<T[K]>
  >;
};

const RANGE_OPS = { gt: ">", gte: ">=", lt: "<", lte: "<=" } as const;

function isRange(value: unknown): value is Range<Primitive> {
  return (
    typeof value === "object" &&
    value !== null &&
    !(value instanceof Date) &&
    !Array.isArray(value) &&
    Object.keys(value).every((k) => k in RANGE_OPS)
  );
}

function enc(value: unknown): string {
  return encodeURIComponent(value instanceof Date ? value.toISOString() : String(value));
}

/**
 * Serialise a query object into an OpenF1 query string (without the leading `?`).
 * Operators go in the key, as OpenF1 expects: `{ speed: { gte: 315 } }` → `speed>=315`.
 */
export function serializeQuery(query: Record<string, unknown> = {}): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) parts.push(`${enc(key)}=${enc(v)}`);
    } else if (isRange(value)) {
      for (const [op, v] of Object.entries(value)) {
        if (v === undefined || v === null) continue;
        parts.push(`${enc(key)}${RANGE_OPS[op as keyof Range<unknown>]}${enc(v)}`);
      }
    } else {
      parts.push(`${enc(key)}=${enc(value)}`);
    }
  }
  return parts.join("&");
}

const LEGACY_OP = /^(>=|<=|>|<)(.*)$/;
const LEGACY_OPS: Record<string, keyof Range<unknown>> = {
  ">": "gt",
  ">=": "gte",
  "<": "lt",
  "<=": "lte",
};

/**
 * Convert 0.1.x-style params into a `Query`. Old code passed operators inside the value
 * (`{ speed: ">=315" }`) and used numbered keys for a second condition on the same field
 * (`{ date: ">2023-01-01", date2: "<2023-02-01" }`).
 */
export function translateLegacyParams(
  params: Record<string, unknown> = {}
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [rawKey, value] of Object.entries(params)) {
    const match = typeof value === "string" ? LEGACY_OP.exec(value) : null;
    if (!match) {
      out[rawKey] = value;
      continue;
    }
    const key = rawKey.replace(/(?<=[a-z])\d+$/, "");
    const existing = out[key];
    const range: Range<unknown> = isRange(existing) ? existing : {};
    range[LEGACY_OPS[match[1]]] = match[2];
    out[key] = range;
  }
  return out;
}
