// 🎭 mood.ts — 날씨 & 운세 기반 감정 분류 유틸

export type MoodCategory = "Happy" | "Calm" | "Energetic" | "Romantic" | "Focus";

/** 🔤 문자열 소문자 정규화 */
function normalize(s?: string) {
  return (s || "").toLowerCase();
}

/**
 * 💫 운세 텍스트(fortuneMood)와 날씨(weatherMain)를 조합해 mood 결정
 */
export function pickMood(fortuneMood?: string, weatherMain?: string): MoodCategory {
  const m = normalize(fortuneMood);
  const w = normalize(weatherMain);

  // 운세 텍스트 우선 판단
  if (m.includes("romantic") || m.includes("love")) return "Romantic";
  if (m.includes("energetic") || m.includes("active") || m.includes("challenge")) return "Energetic";
  if (m.includes("happy") || m.includes("joy") || m.includes("good")) return "Happy";
  if (m.includes("calm") || m.includes("relax") || w.includes("cloud")) return "Calm";

  // 날씨 기반 보정
  if (w.includes("thunder") || w.includes("storm") || w.includes("snow")) return "Calm";
  if (w.includes("clear") || w.includes("sun")) return "Happy";
  if (w.includes("rain") || w.includes("drizzle") || w.includes("fog")) return "Focus";

  // 기본값
  return "Focus";
}

/**
 * 🎧 MoodCategory에 맞는 YouTube 음악 링크
 * (Lo-Fi, 카페음악, 에너지송 등)
 */
export function moodToYoutube(m: MoodCategory): string {
  const map: Record<MoodCategory, string> = {
    Happy: "https://www.youtube.com/embed/5qap5aO4i9A",     // ☀️ lofi hip hop radio
    Calm: "https://www.youtube.com/embed/DWcJFNfaw9c",      // 🌿 relaxing lofi
    Energetic: "https://www.youtube.com/embed/f02mOEt11OQ",  // ⚡ upbeat mix
    Romantic: "https://www.youtube.com/embed/1w7OgIMMRc4",  // 💖 romantic vibe
    Focus: "https://www.youtube.com/embed/jfKfPfyJRdk",     // 💡 study lofi
  };
  return map[m];
}

/**
 * 💬 한국어 mood 라벨 (UI용)
 */
export const MOOD_LABELS: Record<MoodCategory, string> = {
  Happy: "좋음 💫",
  Calm: "차분함 🌿",
  Energetic: "에너지 넘침 ⚡",
  Romantic: "로맨틱 💖",
  Focus: "집중 💡",
};