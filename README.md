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

...

## Endpoint Attributes & Parameters

...

---
## 📸 Export Visuals to PNG

```ts
import { svgToPng } from "openf1-js";

const png = await svgToPng(svg, 1000, 800);
```
Use in browser to convert visualizations to images.