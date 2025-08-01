# openf1-js

![CI](https://github.com/ianleckey/openf1-js/actions/workflows/ci.yml/badge.svg)
![Publish](https://github.com/ianleckey/openf1-js/actions/workflows/publish.yml/badge.svg)

JavaScript SDK for the [OpenF1 API](https://openf1.org/#api-endpoints).

npm install openf1-js

## Installation

```bash
npm install openf1-js
```

## Basic Usage

```js
import { OpenF1 } from "openf1-js";

// Create an API client (default: JSON mode)
const api = new OpenF1();

// Use CSV mode globally
const apiCsv = new OpenF1({ mode: "csv" });
// All endpoint methods support CSV mode, e.g.:
const csvData = await apiCsv.getCarData({ session_key: 1234 }); // returns CSV string
```

## Global Options

The `OpenF1` constructor accepts an options object:

| Option  | Type            | Default                    | Description                       |
| ------- | --------------- | -------------------------- | --------------------------------- |
| baseURL | string          | https://api.openf1.org/v1/ | Override API base URL             |
| mode    | 'json' \| 'csv' | 'json'                     | Response format for all endpoints |

## Endpoint Methods & Parameters

All endpoint methods accept an optional `params` object, which is passed as query parameters to the API. See the [OpenF1 API docs](https://openf1.org/#api-endpoints) for full parameter details. Here are some examples:

```js
// Car data for a specific driver/session, with a filter
await api.getCarData({ driver_number: 55, session_key: 9159, speed: ">=315" });

// Drivers in a session
await api.getDrivers({ driver_number: 1, session_key: 9158 });

// Intervals with a filter
await api.getIntervals({ session_key: 9165, interval: "<0.005" });

// Location data in a time window
await api.getLocation({
  session_key: 9161,
  driver_number: 81,
  date: ">2023-09-16T13:03:35.200",
  date2: "<2023-09-16T13:03:35.800",
});

// Meetings by year/country
await api.getMeetings({ year: 2023, country_name: "Singapore" });

// Pit stops with duration filter
await api.getPit({ session_key: 9158, pit_duration: "<31" });

// Position for a driver in a meeting
await api.getPosition({
  meeting_key: 1217,
  driver_number: 40,
  position: "<=3",
});

// Race control messages
await api.getRaceControl({
  flag: "BLACK AND WHITE",
  driver_number: 1,
  date: ">=2023-01-01",
  date2: "<2023-09-01",
});

// Sessions by country, name, and year
await api.getSessions({
  country_name: "Belgium",
  session_name: "Sprint",
  year: 2023,
});

// Session results for top 3
await api.getSessionResult({ session_key: 7782, position: "<=3" });

// Starting grid for a session
await api.getStartingGrid({ session_key: 7783, position: "<=3" });

// Stints with tyre age filter
await api.getStints({ session_key: 9165, tyre_age_at_start: ">=3" });

// Team radio for a driver/session
await api.getTeamRadio({ session_key: 9158, driver_number: 11 });

// Weather with filters
await api.getWeather({
  meeting_key: 1208,
  wind_direction: ">=130",
  track_temperature: ">=52",
});
```

## Endpoint Attributes & Parameters

Below are the request parameters (query params) and response attributes for each endpoint, based on the OpenF1 API and SDK types.

### Car Data (`getCarData`)

| Name          | Type   | Description                                                                                    |
| ------------- | ------ | ---------------------------------------------------------------------------------------------- |
| brake         | number | 0 or 100                                                                                       |
| date          | string | ISO 8601                                                                                       |
| driver_number | number |                                                                                                |
| drs           | number | The Drag Reduction System (DRS) status (see mapping table below).                              |
| meeting_key   | number | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| n_gear        | number | 0-8. 0 indicates neutral or no gear engaged                                                    |
| rpm           | number |                                                                                                |
| session_key   | number |                                                                                                |
| speed         | number | km/h                                                                                           |
| throttle      | number | %                                                                                              |

| DRS value | Interpretation                             |
| --------- | ------------------------------------------ |
| 0         | DRS off                                    |
| 1         | DRS off                                    |
| 2         | ?                                          |
| 3         | ?                                          |
| 8         | Detected, eligible once in activation zone |
| 9         | ?                                          |
| 10        | DRS on                                     |
| 12        | DRS on                                     |
| 14        | DRS on                                     |

**Request params:** Any of the above fields can be used as a query param (e.g. `driver_number`, `session_key`, `speed`, etc). Filters like `>=`, `<=` are supported for numeric fields.

### Drivers (`getDrivers`)

| Name           | Type   | Description |
| -------------- | ------ | ----------- |
| broadcast_name | string |             |
| country_code   | string |             |
| driver_number  | number |             |
| first_name     | string |             |
| full_name      | string |             |
| headshot_url   | string |             |
| last_name      | string |             |
| meeting_key    | number |             |
| name_acronym   | string |             |
| session_key    | number |             |
| team_colour    | string |             |
| team_name      | string |             |

**Request params:** Any of the above fields can be used as a query param.

### Intervals (`getIntervals`)

| Name          | Type                 | Description                |
| ------------- | -------------------- | -------------------------- |
| date          | string               | ISO 8601                   |
| driver_number | number               |                            |
| gap_to_leader | number\|string\|null | seconds, '+1 LAP', or null |
| interval      | number\|string\|null | seconds, '+1 LAP', or null |
| meeting_key   | number               |                            |
| session_key   | number               |                            |

**Request params:** Any of the above fields can be used as a query param.

### Location (`getLocation`)

| Name          | Type   | Description |
| ------------- | ------ | ----------- |
| date          | string | ISO 8601    |
| driver_number | number |             |
| meeting_key   | number |             |
| session_key   | number |             |
| x             | number |             |
| y             | number |             |
| z             | number |             |

**Request params:** Any of the above fields can be used as a query param.

### Meetings (`getMeetings`)

| Name                  | Type   | Description |
| --------------------- | ------ | ----------- |
| circuit_key           | number |             |
| circuit_short_name    | string |             |
| country_code          | string |             |
| country_key           | number |             |
| country_name          | string |             |
| date_start            | string |             |
| gmt_offset            | string |             |
| location              | string |             |
| meeting_key           | number |             |
| meeting_name          | string |             |
| meeting_official_name | string |             |
| year                  | number |             |

**Request params:** Any of the above fields can be used as a query param.

### Pit (`getPit`)

| Name          | Type   | Description |
| ------------- | ------ | ----------- |
| date          | string |             |
| driver_number | number |             |
| lap_number    | number |             |
| meeting_key   | number |             |
| pit_duration  | number |             |
| session_key   | number |             |

**Request params:** Any of the above fields can be used as a query param.

### Position (`getPosition`)

| Name          | Type   | Description |
| ------------- | ------ | ----------- |
| date          | string |             |
| driver_number | number |             |
| meeting_key   | number |             |
| position      | number |             |
| session_key   | number |             |

**Request params:** Any of the above fields can be used as a query param.

### Race Control (`getRaceControl`)

| Name          | Type         | Description |
| ------------- | ------------ | ----------- |
| category      | string       |             |
| date          | string       |             |
| driver_number | number       |             |
| flag          | string       |             |
| lap_number    | number       |             |
| meeting_key   | number       |             |
| message       | string       |             |
| scope         | string       |             |
| sector        | number\|null |             |
| session_key   | number       |             |

**Request params:** Any of the above fields can be used as a query param.

### Sessions (`getSessions`)

| Name               | Type   | Description |
| ------------------ | ------ | ----------- |
| circuit_key        | number |             |
| circuit_short_name | string |             |
| country_code       | string |             |
| country_key        | number |             |
| country_name       | string |             |
| date_end           | string |             |
| date_start         | string |             |
| gmt_offset         | string |             |
| location           | string |             |
| meeting_key        | number |             |
| session_key        | number |             |
| session_name       | string |             |
| session_type       | string |             |
| year               | number |             |

**Request params:** Any of the above fields can be used as a query param.

### Session Result (`getSessionResult`)

| Name           | Type                     | Description |
| -------------- | ------------------------ | ----------- |
| dnf            | boolean                  |             |
| dns            | boolean                  |             |
| dsq            | boolean                  |             |
| driver_number  | number                   |             |
| duration       | number\|number[]         |             |
| gap_to_leader  | number\|string\|number[] |             |
| number_of_laps | number                   |             |
| meeting_key    | number                   |             |
| position       | number                   |             |
| session_key    | number                   |             |

**Request params:** Any of the above fields can be used as a query param.

### Starting Grid (`getStartingGrid`)

| Name          | Type   | Description |
| ------------- | ------ | ----------- |
| position      | number |             |
| driver_number | number |             |
| lap_duration  | number |             |
| meeting_key   | number |             |
| session_key   | number |             |

**Request params:** Any of the above fields can be used as a query param.

### Stints (`getStints`)

| Name              | Type   | Description |
| ----------------- | ------ | ----------- |
| compound          | string |             |
| driver_number     | number |             |
| lap_end           | number |             |
| lap_start         | number |             |
| meeting_key       | number |             |
| session_key       | number |             |
| stint_number      | number |             |
| tyre_age_at_start | number |             |

**Request params:** Any of the above fields can be used as a query param.

### Team Radio (`getTeamRadio`)

Provides a collection of radio exchanges between Formula 1 drivers and their respective teams during sessions. Only a limited selection of communications are included.

| Name          | Type   | Description                                 |
| ------------- | ------ | ------------------------------------------- |
| date          | string | The UTC date and time, in ISO 8601 format.  |
| driver_number | number | The unique number assigned to an F1 driver. |
| meeting_key   | number | The unique identifier for the meeting.      |
| recording_url | string | URL of the radio recording.                 |
| session_key   | number | The unique identifier for the session.      |

**Request params:** Any of the above fields can be used as a query param (e.g. `session_key`, `driver_number`).

**Sample response:**

```
[
  {
    "date": "2023-09-15T09:40:43.005000",
    "driver_number": 11,
    "meeting_key": 1219,
    "recording_url": "https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-15_Practice_1/TeamRadio/SERPER01_11_20230915_104008.mp3",
    "session_key": 9158
  },
  {
    "date": "2023-09-15T10:32:47.325000",
    "driver_number": 11,
    "meeting_key": 1219,
    "recording_url": "https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-15_Practice_1/TeamRadio/SERPER01_11_20230915_113201.mp3",
    "session_key": 9158
  }
]
```

### Weather (`getWeather`)

The weather over the track, updated every minute.

| Name              | Type   | Description                                |
| ----------------- | ------ | ------------------------------------------ |
| air_temperature   | number | Air temperature (°C).                      |
| date              | string | The UTC date and time, in ISO 8601 format. |
| humidity          | number | Relative humidity (%).                     |
| meeting_key       | number | The unique identifier for the meeting.     |
| pressure          | number | Air pressure (mbar).                       |
| rainfall          | number | Whether there is rainfall.                 |
| session_key       | number | The unique identifier for the session.     |
| track_temperature | number | Track temperature (°C).                    |
| wind_direction    | number | Wind direction (°), from 0° to 359°.       |
| wind_speed        | number | Wind speed (m/s).                          |

**Request params:** Any of the above fields can be used as a query param (e.g. `meeting_key`, `wind_direction`, `track_temperature`).

**Sample response:**

```
[
  {
    "air_temperature": 27.8,
    "date": "2023-05-07T18:42:25.233000+00:00",
    "humidity": 58,
    "meeting_key": 1208,
    "pressure": 1018.7,
    "rainfall": 0,
    "session_key": 9078,
    "track_temperature": 52.5,
    "wind_direction": 136,
    "wind_speed": 2.4
  }
]
```
