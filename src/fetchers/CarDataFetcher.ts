import type { CarDataType } from "../types.js";
import { CarData } from "../entities/CarData.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class CarDataFetcher extends Fetcher<CarDataType, CarData> {
  constructor(transport: Transport) {
    super("car_data", transport, (rows) => rows.map((r) => new CarData(r)));
  }
}
