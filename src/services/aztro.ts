export async function fetchFortune(sign: string, day: "today" | "tomorrow" | "yesterday") {
  const url = `/aztro?sign=${sign}&day=${day}`; // Vite 프록시 경유
  let delay = 500;
  for (let i = 0; i < 3; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000); // 7초 타임아웃
    try {
      const res = await fetch(url, { method: "POST", signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) return res.json();
      if (res.status !== 503) break; // 다른 상태면 재시도 의미 적음
    } catch {
      clearTimeout(t);
      // 네트워크/타임아웃은 재시도
    }
    await new Promise(r => setTimeout(r, delay));
    delay *= 2;
  }
  throw new Error("fortune-503");
}
