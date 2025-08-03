import { Transport } from "../transport/Transport.js";

export abstract class Fetcher<TType, TEntity> {
  constructor(
    protected endpoint: string,
    protected transport: Transport,
    protected factory: (data: TType[]) => TEntity[]
  ) {}

  async fetch(params: Partial<TType>): Promise<TEntity[]> {
    const data = await this.transport.request<TType[]>(this.endpoint, params);
    if (!Array.isArray(data))
      throw new Error(`${this.endpoint} response not array`);
    return this.factory(data);
  }
}
