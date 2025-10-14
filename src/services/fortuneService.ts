import { fetchFortune } from "./aztro";
import { makeLocalMock } from "../utils/mockFortune";
import type { FortuneData, ZodiacSign } from "../types";
import { dedupe, getCached, setCached } from "./cache";

export async function getFortuneRobust(sign: ZodiacSign): Promise<FortuneData> {
  const cached = getCached(sign);
  if (cached) return cached;

  return dedupe(sign, async () => {
    try {
      const today = await backoff(() => fetchFortune(sign), { tries: 3, startMs: 700 });
      setCached(sign, today);
      return today;
    } catch (err) {
      console.warn("🚧 오늘 운세 불러오기 실패, 임시 운세를 불러옵니다.", err);
    }

    const mock = makeLocalMock(sign);
    const val = { ...mock, description: `[임시 운세] ${mock.description}` };
    setCached(sign, val);
    return val;
  });
}

async function backoff<T>(
  fn: () => Promise<T>,
  opt: { tries: number; startMs: number; maxMs?: number }
): Promise<T> {
  const max = opt.maxMs ?? 10_000;
  let delay = opt.startMs;

  for (let i = 0; i < opt.tries; i++) {
    try {
      return await withTimeout(fn(), 12_000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`❌ 운세 불러오기 실패(${i + 1}/${opt.tries}):`, msg);

      if (i === opt.tries - 1) break;

      const wait = Math.min(max, Math.floor(delay * (1 + Math.random())));
      await new Promise((r) => setTimeout(r, wait));
      delay = Math.min(max, delay * 2);
    }
  }
  throw new Error("backoff-failed");
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error("timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        res(v);
      },
      (e) => {
        clearTimeout(t);
        rej(e);
      }
    );
  });
}