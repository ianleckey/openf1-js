import { TrackVisualizer } from "../dist/index.js";
import { describe, it, expect } from "@jest/globals";

describe("TrackVisualizer", () => {
  it("generates SVG output", () => {
    const points = [
      { x: 0, y: 0, throttle: 0 },
      { x: 50, y: 50, throttle: 50 },
      { x: 100, y: 0, throttle: 100 }
    ];
    const svg = TrackVisualizer.renderSVG(points, { colorBy: "throttle" });
    expect(svg).toContain("<svg");
    expect(svg).toContain("path");
  });
});
