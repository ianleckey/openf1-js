import { Location } from "../entities/Location.js";

export type Sector = 1 | 2 | 3;

export interface SectorBoundary {
  sector: Sector;
  startPct: number; // 0 to 1, start distance percentage
  endPct: number; // 0 to 1, end distance percentage
}

export const DEFAULT_SECTOR_BOUNDARIES: SectorBoundary[] = [
  { sector: 1, startPct: 0.0, endPct: 0.333 },
  { sector: 2, startPct: 0.333, endPct: 0.666 },
  { sector: 3, startPct: 0.666, endPct: 1.0 },
];

export class SectorModeler {
  constructor(
    private boundaries: SectorBoundary[] = DEFAULT_SECTOR_BOUNDARIES
  ) {}

  getSectorByDistanceFraction(fraction: number): Sector {
    for (const b of this.boundaries) {
      if (fraction >= b.startPct && fraction < b.endPct) {
        return b.sector;
      }
    }
    return 3; // Default to sector 3 if beyond final boundary
  }

  /**
   * Annotate each location with a sector field based on distance %.
   * You must supply a parallel array of fractions (0–1) for each location.
   */
  assignSectors(
    locations: Location[],
    fractions: number[]
  ): (Location & { sector: Sector })[] {
    return locations.map((loc, i) => {
      const fraction = fractions[i] ?? 0;
      const sector = this.getSectorByDistanceFraction(fraction);
      return { ...loc, sector };
    });
  }
}
