import { Model } from "./Model.js";

export interface WeatherData {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number | "latest";
  pressure: number;
  rainfall: number;
  session_key: number | "latest";
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}

export class WeatherModel extends Model<WeatherData, WeatherModel> {
  static override endpoint = "weather";

  get airTemperature() {
    return this._data.air_temperature;
  }

  get humidity() {
    return this._data.humidity;
  }

  get pressure() {
    return this._data.pressure;
  }

  get rainfall() {
    return this._data.rainfall;
  }

  get trackTemperature() {
    return this._data.track_temperature;
  }

  get windDirection() {
    return this._data.wind_direction;
  }

  get windSpeed() {
    return this._data.wind_speed;
  }
}
