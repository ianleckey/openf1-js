// src/models/Model.ts

import { Transport } from "../core/Transport.js";
export abstract class Model<TData, TSelf extends Model<TData, TSelf>> {
  constructor(protected readonly _data: TData) {}

  static endpoint: string;

  toJSON(): TData {
    return this._data;
  }

  static fromMany(this: ModelStatic<any, any>, data: any[]): any[] {
    return data.map((item) => new this(item));
  }

  static fromOne(this: ModelStatic<any, any>, data: any[]): any {
    if (!data || data.length === 0) return null;
    return new this(data[0]);
  }

  static async all<TData, TSelf extends Model<TData, TSelf>>(
    this: ModelStatic<TData, TSelf>,
    params: Record<string, any> = {}
  ): Promise<TSelf[]> {
    const data = await Transport.getInstance().get<TData[]>(
      this.endpoint,
      params
    );
    return this.fromMany(data);
  }

  static async where<TData, TSelf extends Model<TData, TSelf>>(
    this: ModelStatic<TData, TSelf>,
    params: Record<string, any>
  ): Promise<TSelf[]> {
    return this.all(params);
  }

  static async find<TData, TSelf extends Model<TData, TSelf>>(
    this: ModelStatic<TData, TSelf>,
    baseParams: Record<string, any> = {}
  ): Promise<TSelf | null> {
    const data = await Transport.getInstance().get<TData[]>(this.endpoint, {
      ...baseParams,
    });
    return this.fromOne(data);
  }
}

export interface ModelStatic<TData, TSelf extends Model<TData, TSelf>> {
  new (data: TData): TSelf;

  endpoint: string;

  fromMany(data: TData[]): TSelf[];
  fromOne(data: TData[] | null | undefined): TSelf | null;

  all(params?: Record<string, any>): Promise<TSelf[]>;
  where(params: Record<string, any>): Promise<TSelf[]>;
  find(baseParams?: Record<string, any>): Promise<TSelf | null>;
}
