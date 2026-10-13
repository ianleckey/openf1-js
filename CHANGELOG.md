# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.0.0 (unreleased)

The 0.2 API is now stable. See "Versioning" in the README for what that covers.

#### ⚠ Breaking changes

- **Response fields that OpenF1 can return as `null` are typed as nullable.** The affected types are `Lap`, `SessionResult`, `Stint`, `RaceControl`, `StartingGrid.lap_duration`, `CarData.drs`, `Driver.country_code` and `Pit.pit_duration`. This is type-only; runtime behaviour is unchanged.
- **`Resource` and `SessionScope` are exported as types only.** Get instances from `f1.<endpoint>` and `f1.session()`.
- **The `serializeQuery` helper is no longer exported.**

### 0.2.0 (2026-10-13)

#### Features

- **Typed resource API.** `f1.laps.list(query)` returns `Lap[]`, and `f1.laps.csv(query)` returns a CSV string. Query objects are typed per endpoint: equality, multiple values (`[1, 44]`), ranges (`{ gte, gt, lte, lt }`), `Date` values, and `"latest"` for `session_key`/`meeting_key`.
- **Session scope.** `f1.session(key | "latest")` binds `session_key` for every endpoint, and `info()` returns the session record.
- **New endpoints:** `overtakes`, `championshipDrivers` (beta) and `championshipTeams` (beta).
- **Escape hatch:** `request(endpoint, query, { format })` calls any endpoint.
- **Errors:** an `OpenF1Error` class with `status`, `url` and `body`.
- **Transport:** configurable timeout, `AbortSignal` support, automatic retry on HTTP 429 (honours `Retry-After`), custom `fetch`, and extra `headers`.
- **Sponsor-tier auth:** an `accessToken` option and an `OpenF1.fetchToken()` helper.
- **Types:** updated to match current API responses, with TSDoc on every field and the new pit fields (`lane_duration`, `stop_duration`).

#### Bug fixes

- **Filters now work.** Operators are sent in the key as OpenF1 expects (`speed>=315`). Before, they were sent as `speed=%3E%3D315` and matched nothing. Legacy `getX()` calls such as `{ speed: ">=315" }` and `{ date: ">…", date2: "<…" }` are translated automatically.
- **Arrays are sent as repeated keys** (`driver_number=1&driver_number=44`), not `driver_number[]=`.
- **CommonJS `require("openf1-js")` works.** Previously it resolved to an ESM file.

#### Changes to be aware of

- **axios has been removed**, and the package now has zero dependencies. Errors are `OpenF1Error` rather than `AxiosError`.
- **Legacy `getX()` return types are narrowed** to `T[]` in JSON mode and `string` in CSV mode.
- **`pit_duration` and `Driver.country_code` are marked `@deprecated`**, matching OpenF1's planned removal at the end of 2026.
- **Fields that the API can return as `null` are documented as such** but keep their 0.1.x non-null types. They become nullable in 1.0.
- **The legacy `getX()` methods are deprecated** in favour of `f1.<endpoint>.list()`. They keep working.

### [0.1.3](https://github.com/ianleckey/openf1-js/compare/v0.1.2...v0.1.3) (2025-08-01)

### [0.1.2](https://github.com/ianleckey/openf1-js/compare/v0.1.1...v0.1.2) (2025-08-01)

### 0.1.1 (2025-08-01)
