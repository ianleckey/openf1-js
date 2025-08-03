import type { WeatherType } from "../types.js";
import { Weather } from "../entities/Weather.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export interface WeatherAlert {
  type: "temperature" | "wind" | "rain";
  value: number;
  threshold: number;
  timestamp: string;
  message: string;
}

export class WeatherFetcher extends Fetcher<WeatherType, Weather> {
  constructor(transport: Transport) {
    super("weather", transport, (rows) => rows.map((r) => new Weather(r)));
  }

  /**
   * Returns alerts for weather data exceeding thresholds.
   * @param weatherData Array of Weather entities
   * @param thresholds Object with threshold values
   */
  getAlerts(
    weatherData: Weather[],
    thresholds: {
      temperature?: number;
      wind?: number;
      rain?: number;
    }
  ): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    for (const w of weatherData) {
      if (
        thresholds.temperature !== undefined &&
        w.air_temperature >= thresholds.temperature
      ) {
        alerts.push({
          type: "temperature",
          value: w.air_temperature,
          threshold: thresholds.temperature,
          timestamp: w.date,
          message: `High temperature: ${w.air_temperature}°C at ${w.date}`,
        });
      }
      if (thresholds.wind !== undefined && w.wind_speed >= thresholds.wind) {
        alerts.push({
          type: "wind",
          value: w.wind_speed,
          threshold: thresholds.wind,
          timestamp: w.date,
          message: `High wind speed: ${w.wind_speed} km/h at ${w.date}`,
        });
      }
      if (thresholds.rain !== undefined && w.rainfall >= thresholds.rain) {
        alerts.push({
          type: "rain",
          value: w.rainfall,
          threshold: thresholds.rain,
          timestamp: w.date,
          message: `Heavy rain: ${w.rainfall} mm at ${w.date}`,
        });
      }
    }
    return alerts;
  }
}
