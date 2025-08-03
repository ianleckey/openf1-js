import { WeatherType } from "../types.js";

export class Weather implements WeatherType {
  constructor(public readonly data: WeatherType) {
    Object.assign(this, data);
  }

  readonly air_temperature = this.data.air_temperature;
  readonly date = this.data.date;
  readonly humidity = this.data.humidity;
  readonly meeting_key = this.data.meeting_key;
  readonly pressure = this.data.pressure;
  readonly rainfall = this.data.rainfall;
  readonly session_key = this.data.session_key;
  readonly track_temperature = this.data.track_temperature;
  readonly wind_direction = this.data.wind_direction;
  readonly wind_speed = this.data.wind_speed;

  get formattedTemperature(): string {
    return `${this.air_temperature.toFixed(1)} \u00b0C`;
  }

  get humidityPercent(): string {
    return `${this.humidity}%`;
  }
}
