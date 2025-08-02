import { Transport } from "../transport/Transport.js";

export class Fetcher<TType, TEntity> {
  constructor(
    protected transport: Transport,
    protected endpoint: string,
    protected entityFactory: (data: TType[]) => TEntity[]
  ) {}

  async fetch(params: Partial<TType>): Promise<TEntity[]> {
    const raw = await this.transport.request<TType[]>(this.endpoint, params);
    if (!Array.isArray(raw))
      throw new Error(`${this.endpoint} fetcher: response is not an array`);
    return this.entityFactory(raw);
  }
}
