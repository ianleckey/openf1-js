import { Location } from "../entities/Location.js";
import { Lap } from "../entities/Lap.js";

export interface PathPoint {
  x: number;
  y: number;
  driver_number: number;
  lap_number?: number;
  timestamp: string;
}

export class TrackPathBuilder {
  static groupByDriver(
    locations: Location[],
    laps: Lap[]
  ): Record<number, PathPoint[]> {
    // Build a lookup for lap_number by driver_number and date_start
    const lapLookup: Record<
      number,
      Array<{ lap_number: number; date_start: string }>
    > = {};
    for (const lap of laps) {
      if (!lapLookup[lap.driver_number]) lapLookup[lap.driver_number] = [];
      lapLookup[lap.driver_number].push({
        lap_number: lap.lap_number,
        date_start: lap.date_start,
      });
    }

    const result: Record<number, PathPoint[]> = {};
    for (const loc of locations) {
      if (!result[loc.driver_number]) result[loc.driver_number] = [];
      // Find lap_number for this location
      let lap_number: number | undefined = undefined;
      const driverLaps = lapLookup[loc.driver_number] || [];
      for (const lap of driverLaps) {
        if (loc.date >= lap.date_start) {
          lap_number = lap.lap_number;
        }
      }
      result[loc.driver_number].push({
        x: loc.x,
        y: loc.y,
        driver_number: loc.driver_number,
        lap_number,
        timestamp: loc.date,
      });
    }
    return result;
  }

  static groupByLap(
    locations: Location[],
    laps: Lap[]
  ): Record<number, PathPoint[]> {
    // Build a lookup for lap_number by driver_number and date_start
    const lapLookup: Record<
      number,
      Array<{ lap_number: number; date_start: string }>
    > = {};
    for (const lap of laps) {
      if (!lapLookup[lap.driver_number]) lapLookup[lap.driver_number] = [];
      lapLookup[lap.driver_number].push({
        lap_number: lap.lap_number,
        date_start: lap.date_start,
      });
    }

    const result: Record<number, PathPoint[]> = {};
    for (const loc of locations) {
      // Find lap_number for this location
      let lap_number: number | undefined = undefined;
      const driverLaps = lapLookup[loc.driver_number] || [];
      for (const lap of driverLaps) {
        if (loc.date >= lap.date_start) {
          lap_number = lap.lap_number;
        }
      }
      const lap = lap_number || 0;
      if (!result[lap]) result[lap] = [];
      result[lap].push({
        x: loc.x,
        y: loc.y,
        driver_number: loc.driver_number,
        lap_number,
        timestamp: loc.date,
      });
    }
    return result;
  }

  static toGeoJSON(locations: Location[]): any {
    return {
      type: "FeatureCollection",
      features: locations.map((loc) => ({
        type: "Feature",
        properties: {
          driver_number: loc.driver_number,
          timestamp: loc.date,
        },
        geometry: {
          type: "Point",
          coordinates: [loc.x, loc.y],
        },
      })),
    };
  }
}
