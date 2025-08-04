import { Transport } from "../transport/Transport.js";
import { FetchError } from "../errors/OpenF1Error.js";

export abstract class Fetcher<TType, TEntity> {
  private cache = new Map<string, TEntity[]>();

  constructor(
    protected endpoint: string,
    protected transport: Transport,
    protected factory: (data: TType[]) => TEntity[]
  ) {}

  async fetch(params: Partial<TType>): Promise<TEntity[]> {
    const cacheKey = JSON.stringify(params ?? {});
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const data = await this.transport.request<TType[]>(this.endpoint, params);
    if (!Array.isArray(data))
      throw new FetchError(`${this.endpoint} response not array`);
    const entities = this.factory(data);
    this.cache.set(cacheKey, entities);
    return entities;
  }
}
