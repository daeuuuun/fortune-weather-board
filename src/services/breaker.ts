let failCount = 0;
let openedAt = 0;
const OPEN_AFTER_FAILS = 3;
const OPEN_MS = 5 * 60 * 1000; // 5분

export function assertBreaker() {
  if (failCount >= OPEN_AFTER_FAILS && Date.now() - openedAt < OPEN_MS) {
    const left = OPEN_MS - (Date.now() - openedAt);
    const err: Error & { retryAfterMs?: number } = new Error("circuit-open");
    err.retryAfterMs = Math.max(5_000, left); // 남은 시간만큼 기다리라고 힌트
    throw err;
  }
}

export function onSuccess() {
  failCount = 0;
}

export function onFailure() {
  failCount++;
  if (failCount === OPEN_AFTER_FAILS) openedAt = Date.now();
}
