import { fetchFortune } from "./aztro"; // /aztro 프록시 경유
import { makeLocalMock } from "../utils/mockFortune";
import type { FortuneData, ZodiacSign } from "../types";

export async function getFortuneRobust(sign: ZodiacSign): Promise<FortuneData> {
  // 1) today with backoff
  try {
    return await backoff(() => fetchFortune(sign, "today"), { tries: 3, startMs: 500 });
  } catch {
    // err
  }
  // 2) yesterday
  try {
    const y = await backoff(() => fetchFortune(sign, "yesterday"), { tries: 2, startMs: 700 });
    return { ...y, description: `[서버 지연으로 어제 운세 표시] ${y.description}` };
  } catch {
    // err
  }
  // 3) mock
  const mock = makeLocalMock(sign);
  return { ...mock, description: `[임시 운세] ${mock.description}` };
}

async function backoff<T>(fn: () => Promise<T>, opt: { tries: number; startMs: number }): Promise<T> {
  for (let i = 0; i < opt.tries; i++) {
    try {
      return await withTimeout(fn(), 7000);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("❌ 운세 불러오기 실패:", e.message);
      } else {
        console.error("❌ 알 수 없는 에러:", e);
      }
    }
  }
  throw new Error("backoff-failed");
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error("timeout")), ms);
    p.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); });
  });
}