// Compile-time checks, run by `npm run typecheck`. Nothing here executes.
import { OpenF1, type CarData, type Lap, type Session } from "../src/index";

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
const assert = <T extends true>() => {};

async function checks() {
  const f1 = new OpenF1();

  // New API: JSON by default, CSV opt-in.
  assert<Equal<Awaited<ReturnType<typeof f1.laps.list>>, Lap[]>>();
  assert<Equal<Awaited<ReturnType<typeof f1.laps.csv>>, string>>();

  // Nullable fields are typed as nullable.
  assert<Equal<Lap["lap_duration"], number | null>>();
  assert<Equal<CarData["drs"], number | null>>();

  // Typed filters.
  await f1.laps.list({ session_key: "latest", driver_number: [1, 44], lap_duration: { lt: 90 } });
  await f1.carData.list({ date: { gte: new Date(), lt: "2023-09-17" } });
  // @ts-expect-error unknown field
  await f1.laps.list({ lap_time: 90 });
  // @ts-expect-error wrong value type
  await f1.laps.list({ driver_number: "one" });
  // @ts-expect-error array fields can't be filtered
  await f1.laps.list({ segments_sector_1: 2048 });
  // @ts-expect-error "latest" is only for session_key / meeting_key
  await f1.laps.list({ driver_number: "latest" });

  // Session scope binds session_key.
  const s = f1.session("latest");
  await s.weather({ air_temperature: { gte: 30 } });
  // @ts-expect-error session_key is bound by the scope
  await s.weather({ session_key: 1 });
  assert<Equal<Awaited<ReturnType<typeof s.info>>, Session | undefined>>();

  // request() overloads.
  assert<Equal<Awaited<ReturnType<typeof f1.request<Lap>>>, Lap[]>>();
  const csv: string = await f1.request("laps", {}, { format: "csv" });

  // Nullable fields can't be filtered with null, but still accept their value type.
  await f1.laps.list({ lap_duration: { lt: 90 }, st_speed: 300 });
  // @ts-expect-error null is not a filter value
  await f1.laps.list({ lap_duration: null });

  // Legacy API: JSON mode is now typed precisely, CSV mode as string.
  assert<Equal<Awaited<ReturnType<typeof f1.getLaps>>, Lap[]>>();
  const csvClient = new OpenF1({ mode: "csv" });
  assert<Equal<Awaited<ReturnType<typeof csvClient.getLaps>>, string>>();
  const withUrl = new OpenF1({ baseURL: "http://x" });
  assert<Equal<Awaited<ReturnType<typeof withUrl.getLaps>>, Lap[]>>();

  // 0.1.x code that narrows the old union still compiles.
  const legacy: Lap[] | string = await f1.getLaps({ session_key: 1, speed: ">=1" });
  if (typeof legacy !== "string") legacy.map((l) => l.lap_number);
  void csv;
}
void checks;
