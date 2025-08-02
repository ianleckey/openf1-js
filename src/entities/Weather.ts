import { WeatherType } from "../types.js";

export class Weather {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number;
  pressure: number;
  rainfall: number;
  session_key: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;

  constructor(data: WeatherType) {
    this.air_temperature = data.air_temperature;
    this.date = data.date;
    this.humidity = data.humidity;
    this.meeting_key = data.meeting_key;
    this.pressure = data.pressure;
    this.rainfall = data.rainfall;
    this.session_key = data.session_key;
    this.track_temperature = data.track_temperature;
    this.wind_direction = data.wind_direction;
    this.wind_speed = data.wind_speed;
  }

  get formattedTemperature(): string {
    return `${this.air_temperature.toFixed(1)} \u00b0C`;
  }

  get humidityPercent(): string {
    return `${this.humidity}%`;
  }

  static fromArray(data: WeatherType[]): Weather[] {
    return data.map((d) => new Weather(d));
  }
}
