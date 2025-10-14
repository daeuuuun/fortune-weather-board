import type { FortuneData, ZodiacSign } from "../types";

const inflight = new Map<string, Promise<FortuneData>>();
const cache = new Map<string, { data: FortuneData; ts: number }>();
const TTL_MS = 60_000;

export function getCached(sign: ZodiacSign): FortuneData | null {
  const hit = cache.get(sign);
  if (hit && Date.now() - hit.ts < TTL_MS) return hit.data;
  return null;
}

export function setCached(sign: ZodiacSign, data: FortuneData) {
  cache.set(sign, { data, ts: Date.now() });
}

export function dedupe(sign: ZodiacSign, producer: () => Promise<FortuneData>) {
  const key = String(sign);
  if (inflight.has(key)) return inflight.get(key)!;
  const p = producer().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
