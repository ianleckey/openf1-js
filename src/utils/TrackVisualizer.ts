import { Location } from "../entities/Location.js";
import { CarData } from "../entities/CarData.js";
import { Sector } from "./SectorModeler.js";

interface RenderOptions {
  colorBy?: "sector" | "driver" | "throttle" | "brake";
  width?: number;
  height?: number;
  smoothPath?: boolean;
}

export class TrackVisualizer {
  static renderSVG(
    locations: (Location & { sector?: Sector; driver_number?: number })[],
    carData: CarData[],
    options: RenderOptions = {}
  ): string {
    const width = options.width ?? 800;
    const height = options.height ?? 600;

    const xs = locations.map((l) => l.x);
    const ys = locations.map((l) => l.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const scaleX = width / (maxX - minX || 1);
    const scaleY = height / (maxY - minY || 1);

    const colorMap: Record<string, string> = {
      "1": "red",
      "2": "yellow",
      "3": "green",
    };

    const driverColors = [
      "blue",
      "orange",
      "purple",
      "teal",
      "pink",
      "gray",
      "brown",
    ];
    const driverColorMap: Record<number, string> = {};
    let driverIndex = 0;

    // Build a lookup for carData by driver_number
    const carDataByDriver: Record<number, CarData> = {};
    for (const cd of carData) {
      if (typeof cd.driver_number === "number") {
        carDataByDriver[cd.driver_number] = cd;
      }
    }

    const circles = locations.map((loc, i) => {
      const x = ((loc.x - minX) * scaleX).toFixed(2);
      const y = ((maxY - loc.y) * scaleY).toFixed(2); // flip y for SVG
      let color = "black";
      let opacity = 1.0;

      if (options.colorBy === "sector" && loc.sector) {
        color = colorMap[String(loc.sector)] ?? "black";
      } else if (
        options.colorBy === "driver" &&
        typeof loc.driver_number === "number"
      ) {
        if (!driverColorMap[loc.driver_number]) {
          driverColorMap[loc.driver_number] =
            driverColors[driverIndex++ % driverColors.length];
        }
        color = driverColorMap[loc.driver_number];
      } else if (
        options.colorBy === "throttle" &&
        typeof loc.driver_number === "number" &&
        carDataByDriver[loc.driver_number] &&
        typeof carDataByDriver[loc.driver_number].throttle === "number"
      ) {
        const t = Math.max(
          0,
          Math.min(100, carDataByDriver[loc.driver_number].throttle)
        );
        color = `rgba(0, 200, 0, ${t / 100})`;
        opacity = t / 100;
      } else if (
        options.colorBy === "brake" &&
        typeof loc.driver_number === "number" &&
        carDataByDriver[loc.driver_number] &&
        typeof carDataByDriver[loc.driver_number].brake === "number"
      ) {
        const b = Math.max(
          0,
          Math.min(100, carDataByDriver[loc.driver_number].brake)
        );
        color = `rgba(200, 0, 0, ${b / 100})`;
        opacity = b / 100;
      }

      return `<circle cx="${x}" cy="${y}" r="1" fill="${color}" opacity="${opacity.toFixed(
        2
      )}" />`;
    });

    let svgPath = "";
    if (options.smoothPath) {
      const pathD = locations
        .map((loc, i) => {
          const x = ((loc.x - minX) * scaleX).toFixed(2);
          const y = ((maxY - loc.y) * scaleY).toFixed(2);
          return `${i === 0 ? "M" : "L"}${x} ${y}`;
        })
        .join(" ");
      svgPath = `<path d="${pathD}" fill="none" stroke="black" stroke-width="0.5" opacity="0.3" />`;
    }

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <g>
    ${svgPath}
    ${circles.join("\n")}
  </g>
</svg>`;
  }
}
