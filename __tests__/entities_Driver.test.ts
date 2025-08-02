import { Driver } from "../dist/index.js";
import { describe, it, expect } from "@jest/globals";

describe("Driver", () => {
  const driver = new Driver({
    driver_number: 1,
    full_name: "Max Verstappen",
    country_code: "NL",
    team_name: "Red Bull Racing"
  });

  it("should expose driver details", () => {
    expect(driver.fullName).toBe("Max Verstappen");
    expect(driver.driverNumber).toBe(1);
  });
});
