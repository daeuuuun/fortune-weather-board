import type { FortuneData, ZodiacSign } from "../types";
import { pickMood } from "../utils/mood";
import type { MoodCategory } from "../utils/mood";

// 🎨 행운의 색상 후보
const COLORS = ["파랑", "빨강", "초록", "보라", "노랑", "하늘", "검정", "흰색", "분홍", "회색"];
// 🍀 행운의 시간대 후보
const TIMES = Array.from({ length: 24 }, (_, i) => `${i}시`);

// 🌐 간단 번역기 (영→한)
async function translateToKorean(text: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.[0]?.[0]?.[0] || text;
  } catch {
    return text;
  }
}

// 🌦️ 현재 날씨 가져오기
async function fetchWeather(): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=37.57&longitude=126.98&current=weather_code`
    );
    const data = await res.json();
    const code = data?.current?.weather_code;

    if (code >= 95) return "Thunderstorm";
    if (code >= 80) return "Rain";
    if (code >= 70) return "Snow";
    if (code >= 45) return "Fog";
    if (code >= 1) return "Clouds";
    return "Clear";
  } catch {
    return undefined;
  }
}

// 🌟 최종 운세 함수
export async function fetchFortune(sign: ZodiacSign): Promise<FortuneData> {
  const cleanSign = sign.toLowerCase().replace(/[^a-z]/g, "");

  // 🎲 간단한 시드 기반 난수 생성기
  function seededRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 1000000;
    }
    return () => {
      hash = (hash * 1664525 + 1013904223) % 4294967296;
      return hash / 4294967296;
    };
  }


  // 🪄 1. 운세 API 호출
  const res = await fetch(`http://localhost:5174/horoscope/${cleanSign}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log("🔮 API data:", data);

  // 🪄 2. 번역
  const translated = await translateToKorean(data.horoscope);

  // 🌦️ 3. 날씨
  const weatherMain = await fetchWeather();

  // 💫 4. mood 결정
  const mood: MoodCategory = pickMood(data.horoscope, weatherMain);

  // 🎁 5. 행운 요소 생성 (날짜+별자리로 고정)
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const seed = `${cleanSign}-${today}`;
  const rand = seededRandom(seed);

  const randomColor = COLORS[Math.floor(rand() * COLORS.length)];
  const randomNumber = String(Math.floor(rand() * 99) + 1);
  const randomTime = TIMES[Math.floor(rand() * TIMES.length)];

  // 🧾 6. 최종 반환
  return {
    sign: cleanSign as ZodiacSign,
    current_date: data.date,
    description: translated,
    date_range: data.date_range || "",
    mood,
    color: randomColor,
    lucky_number: randomNumber,
    lucky_time: randomTime,
  };
}