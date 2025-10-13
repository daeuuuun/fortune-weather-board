import dayjs from "dayjs";
import type { FortuneData, ZodiacSign } from "../types";

// 별자리별 날짜 범위 (aztro 형식 맞춤)
const SIGN_DATE_RANGE: Record<string, string> = {
  aries: "Mar 21 - Apr 19",
  taurus: "Apr 20 - May 20",
  gemini: "May 21 - Jun 20",
  cancer: "Jun 21 - Jul 22",
  leo: "Jul 23 - Aug 22",
  virgo: "Aug 23 - Sep 22",
  libra: "Sep 23 - Oct 22",
  scorpio: "Oct 23 - Nov 21",
  sagittarius: "Nov 22 - Dec 21",
  capricorn: "Dec 22 - Jan 19",
  aquarius: "Jan 20 - Feb 18",
  pisces: "Feb 19 - Mar 20",
};

// 🎲 임시 운세 생성 함수
export function makeLocalMock(sign: ZodiacSign): FortuneData {
  // 분위기 랜덤 선택
  const moods = ["Happy", "Calm", "Energetic", "Romantic", "Focus"];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  // 날짜 기반 시드로 살짝 안정적인 결과를 주고 싶다면:
  // const seed = dayjs().dayOfYear() + sign.charCodeAt(0);
  // mood = moods[seed % moods.length];

  // 임시 운세 본문
  const descriptions = [
    "계획했던 일이 순조롭게 진행됩니다.",
    "주변 사람과의 대화에서 힌트를 얻을 수 있어요.",
    "오늘은 여유를 가지고 자신에게 집중해보세요.",
    "작은 행운이 찾아올 수 있는 하루입니다.",
    "차분히 행동하면 좋은 결과가 따를 거예요.",
  ];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    sign,
    description,
    mood,
    compatibility: "Libra",
    lucky_number: String(Math.floor(Math.random() * 9) + 1), // 🔹 string 타입
    lucky_time: `${Math.floor(Math.random() * 12) + 1}:00`,
    date_range: SIGN_DATE_RANGE[String(sign).toLowerCase()] ?? "",
    current_date: dayjs().format("MMMM D, YYYY"),
    color: "Blue",
  };
}
