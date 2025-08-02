import { Transport } from "../transport/Transport.js";
import type { CarDataType } from "../types.js";
import { CarData } from "../entities/CarData.js";
import { Fetcher } from "./Fetcher.js";

export class CarDataFetcher extends Fetcher<CarDataType, CarData> {
  constructor(transport: Transport) {
    super(transport, "car_data", CarData.fromArray);
  }
}
