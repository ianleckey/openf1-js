// src/core/QueryBuilder.ts

import { Transport } from "../core/Transport.js";

type FilterOperator = "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
type FilterValue = string | number | boolean;
type FilterCondition =
  | FilterValue
  | FilterValue[]
  | { [key in FilterOperator]?: FilterValue };

type QueryParams = Record<string, FilterCondition>;

export class QueryBuilder<T> {
  private filters: QueryParams = {};

  constructor(private readonly endpoint: string) {}

  static for<T>(endpoint: string): QueryBuilder<T> {
    return new QueryBuilder<T>(endpoint);
  }

  where(key: string, value: FilterValue): this {
    this.filters[key] = value;
    return this;
  }

  whereGt(key: string, value: FilterValue): this {
    this.filters[key] = { gt: value };
    return this;
  }

  whereGte(key: string, value: FilterValue): this {
    this.filters[key] = { gte: value };
    return this;
  }

  whereLt(key: string, value: FilterValue): this {
    this.filters[key] = { lt: value };
    return this;
  }

  whereLte(key: string, value: FilterValue): this {
    this.filters[key] = { lte: value };
    return this;
  }

  whereNe(key: string, value: FilterValue): this {
    this.filters[key] = { ne: value };
    return this;
  }

  whereBetween(key: string, min: FilterValue, max: FilterValue): this {
    this.filters[key] = { gte: min, lte: max };
    return this;
  }

  whereIn(key: string, values: FilterValue[]): this {
    this.filters[key] = values;
    return this;
  }

  whereDateBetween(key: string, from: Date | string, to: Date | string): this {
    const fromStr = from instanceof Date ? from.toISOString() : from;
    const toStr = to instanceof Date ? to.toISOString() : to;
    this.filters[key] = { gte: fromStr, lte: toStr };
    return this;
  }

  toQueryString(): string {
    const query = new URLSearchParams();
    for (const [key, condition] of Object.entries(this.filters)) {
      if (typeof condition === "object" && !Array.isArray(condition)) {
        for (const [op, value] of Object.entries(condition)) {
          const opMap: Record<string, string> = {
            eq: "=",
            ne: "!=",
            lt: "<",
            lte: "<=",
            gt: ">",
            gte: ">=",
          };
          query.append(key, `${opMap[op] ?? op}${value}`);
        }
      } else if (Array.isArray(condition)) {
        for (const v of condition) {
          query.append(key, `${v}`);
        }
      } else {
        query.append(key, `${condition}`);
      }
    }
    return query.toString();
  }

  async execute(): Promise<T[]> {
    return await Transport.getInstance().get<T[]>(this.endpoint, this.filters);
  }

  async first(): Promise<T | null> {
    const results = await Transport.getInstance().get<T[]>(
      this.endpoint,
      this.filters
    );
    return results[0] ?? null;
  }
}

// Usage Example:
// const laps = await QueryBuilder.for<LapData>("laps")
//   .where("driver_number", 55)
//   .whereGte("lap_duration", 120)
//   .execute();
