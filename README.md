# openf1-js

![CI](https://github.com/ianleckey/openf1-js/actions/workflows/ci.yml/badge.svg)
![Publish](https://github.com/ianleckey/openf1-js/actions/workflows/publish.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/openf1-js)](https://www.npmjs.com/package/openf1-js)

A typed JavaScript/TypeScript client for the [OpenF1 API](https://openf1.org): real-time and historical Formula 1 data (lap times, telemetry, positions, pit stops, team radio, weather and more).

- **Typed queries and results.** You get autocomplete for every field and filter, and results come back typed as `Lap[]` and so on.
- **Zero dependencies.** It uses the native `fetch`, so it runs in Node 18+, browsers, Deno, Bun and edge runtimes.
- **ESM and CommonJS** builds are both included.

```bash
npm install openf1-js
```

## Quick start

```ts
import { OpenF1 } from "openf1-js";

const f1 = new OpenF1();

const laps = await f1.laps.list({ session_key: 9161, driver_number: 1 });
console.log(laps[0].lap_duration); // lap time in seconds
```

Every endpoint is a property of the client, with a `list()` method that returns an array of JSON records. CommonJS works too: `const { OpenF1 } = require("openf1-js")`.

## Querying and filters

Pass a query object to `list()`. Each key is a field of the record you're fetching, and TypeScript checks both the names and the value types.

```ts
// Equality
await f1.drivers.list({ session_key: 9158, driver_number: 1 });

// Several values: matches any of them
await f1.drivers.list({ session_key: 9158, driver_number: [1, 44, 81] });

// Comparisons: gt, gte, lt, lte
await f1.carData.list({ session_key: 9159, driver_number: 55, speed: { gte: 315 } });

// Ranges: combine operators
await f1.intervals.list({ session_key: 9165, interval: { gt: 0, lt: 0.005 } });

// Dates: ISO strings or Date objects
await f1.location.list({
  session_key: 9161,
  driver_number: 81,
  date: { gt: "2023-09-16T13:03:35.200", lt: new Date("2023-09-16T13:03:35.800Z") },
});

// "latest": the current or most recent session/meeting
await f1.weather.list({ meeting_key: "latest" });
```

If nothing matches, `list()` returns `[]`.

## Session scope

Most F1 questions are about one session. `f1.session(key)` returns an object whose methods are already filtered to that session:

```ts
const race = f1.session("latest"); // or a session key, e.g. f1.session(9158)

const info    = await race.info();                            // Session | undefined
const drivers = await race.drivers();
const stints  = await race.stints({ driver_number: 1 });
const radio   = await race.teamRadio({ driver_number: [1, 44] });
const yellows = await race.raceControl({ flag: "YELLOW" });
```

Each method takes the same query object as `list()`, except `session_key`, which the scope sets.

## Endpoints

| Property | OpenF1 endpoint | Notes |
| --- | --- | --- |
| `f1.carData` | [`/car_data`](https://openf1.org/docs/#car-data) | Speed, throttle, brake, gear, RPM, DRS at ~3.7 Hz. Filter by driver and time; responses are large. |
| `f1.championshipDrivers` | [`/championship_drivers`](https://openf1.org/docs/#drivers-championship-beta) | Beta. Races only. |
| `f1.championshipTeams` | [`/championship_teams`](https://openf1.org/docs/#teams-championship-beta) | Beta. Races only. |
| `f1.drivers` | [`/drivers`](https://openf1.org/docs/#drivers) | Names, teams, team colours, headshots. |
| `f1.intervals` | [`/intervals`](https://openf1.org/docs/#intervals) | Gaps to leader and car ahead, ~every 4 s. Races only. |
| `f1.laps` | [`/laps`](https://openf1.org/docs/#laps) | Lap and sector times, speed traps. |
| `f1.location` | [`/location`](https://openf1.org/docs/#location) | Car x/y/z on track at ~3.7 Hz. |
| `f1.meetings` | [`/meetings`](https://openf1.org/docs/#meetings) | Grand Prix and testing weekends. |
| `f1.overtakes` | [`/overtakes`](https://openf1.org/docs/#overtakes) | Races only; may be incomplete. |
| `f1.pit` | [`/pit`](https://openf1.org/docs/#pit) | Pit lane and stop durations. |
| `f1.position` | [`/position`](https://openf1.org/docs/#position) | Position changes over a session. |
| `f1.raceControl` | [`/race_control`](https://openf1.org/docs/#race-control) | Flags, safety car, incidents. |
| `f1.sessions` | [`/sessions`](https://openf1.org/docs/#sessions) | Practice, qualifying, sprint, race. |
| `f1.sessionResult` | [`/session_result`](https://openf1.org/docs/#session-result) | Final classification. |
| `f1.startingGrid` | [`/starting_grid`](https://openf1.org/docs/#starting-grid) | Race starting grid. |
| `f1.stints` | [`/stints`](https://openf1.org/docs/#stints) | Tyre compounds and stint laps. |
| `f1.teamRadio` | [`/team_radio`](https://openf1.org/docs/#team-radio) | Links to radio recordings (a selection only). |
| `f1.weather` | [`/weather`](https://openf1.org/docs/#weather) | Track weather, every minute. |

Field-by-field descriptions are in the exported types (`Lap`, `CarData` and so on) and show up in your editor on hover. OpenF1's [documentation](https://openf1.org/docs) is the source of truth.

For an endpoint this package doesn't wrap yet, use `request()`:

```ts
const rows = await f1.request<MyType>("some_new_endpoint", { session_key: 9158 });
```

## CSV

Responses are JSON unless you ask for CSV. To get a CSV string instead, call `.csv()`:

```ts
const csv = await f1.laps.csv({ session_key: 9161, driver_number: 1 }); // string
```

## Options

```ts
const f1 = new OpenF1({
  timeoutMs: 10_000,
  retries: 3,
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `baseURL` | `string` | `https://api.openf1.org/v1/` | API base URL. |
| `timeoutMs` | `number` | `30000` | Per-request timeout. |
| `retries` | `number` | `2` | Retries after a `429 Too Many Requests` response. Honours `Retry-After`. |
| `headers` | `Record<string, string>` | `{}` | Extra headers for every request. |
| `accessToken` | `string \| () => string \| Promise<string>` | | Sponsor-tier token; see below. |
| `fetch` | `typeof fetch` | global `fetch` | Custom fetch, e.g. for proxies, caching or tests. |
| `mode` | `"json" \| "csv"` | `"json"` | Only affects the legacy `getX()` methods. |

Every `list()`, `csv()` and session method also takes `{ signal }` as a second argument to support cancellation:

```ts
const controller = new AbortController();
await f1.carData.list({ session_key: 9159 }, { signal: controller.signal });
```

## Errors and rate limits

Failed requests throw an `OpenF1Error` with `status`, `url` and `body`:

```ts
import { OpenF1Error } from "openf1-js";

try {
  await f1.laps.list({ session_key: 9161 });
} catch (error) {
  if (error instanceof OpenF1Error) {
    console.error(error.status, error.message);
  }
}
```

The free tier allows 3 requests per second and 30 per minute. A `429` is retried automatically (see `retries`). If you make many calls in a loop, space them out.

## Live data (sponsor tier)

Historical data needs no account. Real-time data requires an [OpenF1 sponsor account](https://openf1.org/auth.html). Exchange your credentials for a token **on a server**, never in browser code:

```ts
const { accessToken, expiresAt } = await OpenF1.fetchToken({
  username: process.env.OPENF1_USERNAME!,
  password: process.env.OPENF1_PASSWORD!,
});

const f1 = new OpenF1({ accessToken });
```

Tokens last one hour. To refresh automatically, pass a function:

```ts
let token: { accessToken: string; expiresAt: Date } | undefined;

const f1 = new OpenF1({
  accessToken: async () => {
    if (!token || token.expiresAt.getTime() - Date.now() < 60_000) {
      token = await OpenF1.fetchToken({ username, password });
    }
    return token.accessToken;
  },
});
```

## TypeScript

All record types are exported, along with `Query<T>` for building queries ahead of time:

```ts
import type { Lap, Query } from "openf1-js";

const fastLaps: Query<Lap> = { session_key: 9161, lap_duration: { lt: 100 } };
const laps: Lap[] = await f1.laps.list(fastLaps);
```

Fields that OpenF1 can return as `null` are typed that way, for example `lap_duration` on an out-lap or `drs` from 2026 onwards. Handle `null` before doing arithmetic:

```ts
const timed = laps.filter((lap): lap is Lap & { lap_duration: number } => lap.lap_duration !== null);
```

## Upgrading to 1.0

1.0 freezes the API introduced in 0.2. The only breaking change is in the types: **response fields that OpenF1 can return as `null` are now typed as nullable.** With `strictNullChecks`, TypeScript will point out the places that need a null check. Runtime behaviour is unchanged, and the legacy `getX()` methods still work.

The affected fields are:

- **`Lap`:** sector times, speeds, `lap_duration`, `date_start` and segments
- **`SessionResult`:** `position`, `duration`, `gap_to_leader` and `number_of_laps`
- **`Stint`:** all lap and tyre fields
- **`RaceControl`:** `driver_number`, `flag`, `lap_number` and `scope`
- **Others:** `CarData.drs`, `Driver.country_code`, `Pit.pit_duration` and `StartingGrid.lap_duration`

## Migrating from 0.1.x

If you're going straight from 0.1.x to 1.0, also read [Upgrading to 1.0](#upgrading-to-10) for the nullable types.

0.2 is backwards compatible: the `getX()` methods still work, so you can migrate one call at a time. They are marked `@deprecated` in favour of the new API.

| 0.1.x | 0.2 |
| --- | --- |
| `api.getLaps({ session_key: 1 })` | `f1.laps.list({ session_key: 1 })` |
| `api.getCarData({ speed: ">=315" })` | `f1.carData.list({ speed: { gte: 315 } })` |
| `{ date: ">2023-01-01", date2: "<2023-02-01" }` | `{ date: { gt: "2023-01-01", lt: "2023-02-01" } }` |
| `new OpenF1({ mode: "csv" }).getLaps(q)` | `f1.laps.csv(q)` |
| return type `Lap[] \| string` | `Lap[]` from `list()`, `string` from `csv()` |
| `getSessionResult`, `getStartingGrid`, … | `sessionResult`, `startingGrid`, … (camelCase, no `get`) |

What changed in 0.2:

- **Filters in 0.1.x didn't work.** Values like `speed: ">=315"` were sent as `speed=%3E%3D315`, which OpenF1 reads as "speed equals `>=315`". The legacy methods now translate them into the correct `speed>=315`, so those calls start returning data.
- **Errors are now `OpenF1Error`** instead of axios's `AxiosError`. `status` is available directly on the error, where it used to be `error.response.status`.
- **axios is no longer a dependency.**
- **Legacy method return types are narrower.** In JSON mode they return `T[]` instead of `T[] | string`, and in CSV mode they return `string`. Existing code that narrows the union still compiles.
- **Legacy methods still throw on "No results found"** (404), as before. The new `list()` returns `[]` instead.

## Versioning

This package follows [semver](https://semver.org).

- **Stable from 1.0:** everything exported from `openf1-js` and every documented method and option.
- **Kept for all of 1.x:** the legacy `getX()` methods and the `mode` option. They are deprecated but won't be removed before 2.0.
- **Minor releases** can add endpoints, fields and options. They can also make a field optional or nullable when OpenF1 changes its data, because that reflects what the API actually returns.
- **Fields OpenF1 removes,** such as `pit_duration` and `Driver.country_code` at the end of 2026, are marked `@deprecated` first. Removing them from the types waits for a major release.

## Contributing

```bash
npm install
npm test           # unit tests (nock-mocked)
npm run typecheck  # source plus compile-time API checks in test/types.check.ts
npm run build      # ESM + CJS + .d.ts into dist/
```

Issues and PRs are welcome at [github.com/ianleckey/openf1-js](https://github.com/ianleckey/openf1-js).

## License

MIT. Not affiliated with Formula 1 or OpenF1; data provided by [OpenF1](https://openf1.org).
