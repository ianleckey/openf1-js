import { OpenF1Error } from "../errors/OpenF1Error.js";
import { FetcherRegistry } from "../fetchers/FetcherRegistry.js";
import { SessionResultType } from "../types.js";
import { Driver } from "./Driver.js";

export class SessionResult implements SessionResultType {
  constructor(
    public readonly data: SessionResultType,
    private readonly fetchers: Pick<FetcherRegistry, "driver">
  ) {}

  get dnf(): boolean {
    return this.data.dnf;
  }

  get dns(): boolean {
    return this.data.dns;
  }

  get dsq(): boolean {
    return this.data.dsq;
  }

  get driver_number(): number {
    return this.data.driver_number;
  }

  get duration(): number | null {
    return this.data.duration;
  }

  get gap_to_leader(): number | string | null {
    return this.data.gap_to_leader;
  }

  get number_of_laps(): number {
    return this.data.number_of_laps;
  }

  get meeting_key(): number | "latest" {
    return this.data.meeting_key;
  }

  get position(): number {
    return this.data.position;
  }

  get session_key(): number | "latest" {
    return this.data.session_key;
  }

  private cache = {
    driver: undefined as Driver | undefined,
  };

  async driver(): Promise<Driver> {
    if (!this.cache.driver) {
      const driver = await this.fetchers.driver.fetchOneForSession({
        driver_number: this.driver_number,
        session_key: this.session_key,
      });
      if (!driver) {
        throw new OpenF1Error(
          `Failed to fetch driver ${this.driver_number} for session ${this.session_key}`
        );
      }
      this.cache.driver = driver;
    }
    return this.cache.driver!;
  }

  get isInPoints(): boolean {
    return !this.dnf && !this.dns && !this.dsq && this.position <= 10;
  }

  get isPodium(): boolean {
    return !this.dnf && !this.dns && !this.dsq && this.position <= 3;
  }

  get isWinner(): boolean {
    return !this.dnf && !this.dns && !this.dsq && this.position === 1;
  }

  get points(): number {
    if (this.dnf || this.dns || this.dsq) {
      return 0;
    }
    switch (this.position) {
      case 1:
        return 25;
      case 2:
        return 18;
      case 3:
        return 15;
      case 4:
        return 12;
      case 5:
        return 10;
      case 6:
        return 8;
      case 7:
        return 6;
      case 8:
        return 4;
      case 9:
        return 2;
      case 10:
        return 1;
      default:
        return 0;
    }
  }

  loaded() {
    return {
      driver: !!this.cache.driver,
    };
  }
}
