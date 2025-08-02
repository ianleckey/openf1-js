import { Transport } from "../transport/Transport.js";
import type { WeatherType } from "../types.js";
import { Weather } from "../entities/Weather.js";
import { Fetcher } from "./Fetcher.js";

export class WeatherFetcher extends Fetcher<WeatherType, Weather> {
  constructor(transport: Transport) {
    super(transport, "weather", Weather.fromArray);
  }
}
