import type { ZodiacSign } from "../types";

const RANGES: Array<{
  sign: ZodiacSign;
  start: { month: number; day: number };
  end: { month: number; day: number };
}> = [
  { sign: "capricorn",  start: { month: 12, day: 22 }, end: { month: 1,  day: 19 } },
  { sign: "aquarius",   start: { month: 1,  day: 20 }, end: { month: 2,  day: 18 } },
  { sign: "pisces",     start: { month: 2,  day: 19 }, end: { month: 3,  day: 20 } },
  { sign: "aries",      start: { month: 3,  day: 21 }, end: { month: 4,  day: 19 } },
  { sign: "taurus",     start: { month: 4,  day: 20 }, end: { month: 5,  day: 20 } },
  { sign: "gemini",     start: { month: 5,  day: 21 }, end: { month: 6,  day: 21 } },
  { sign: "cancer",     start: { month: 6,  day: 22 }, end: { month: 7,  day: 22 } },
  { sign: "leo",        start: { month: 7,  day: 23 }, end: { month: 8,  day: 22 } },
  { sign: "virgo",      start: { month: 8,  day: 23 }, end: { month: 9,  day: 22 } },
  { sign: "libra",      start: { month: 9,  day: 23 }, end: { month: 10, day: 22 } },
  { sign: "scorpio",    start: { month: 10, day: 23 }, end: { month: 11, day: 22 } },
  { sign: "sagittarius",start: { month: 11, day: 23 }, end: { month: 12, day: 21 } },
];

export const KOREAN_SIGN_LABEL: Record<ZodiacSign, string> = {
  aries: "양자리",
  taurus: "황소자리",
  gemini: "쌍둥이자리",
  cancer: "게자리",
  leo: "사자자리",
  virgo: "처녀자리",
  libra: "천칭자리",
  scorpio: "전갈자리",
  sagittarius: "사수자리",
  capricorn: "염소자리",
  aquarius: "물병자리",
  pisces: "물고기자리",
};

export function getZodiacFromDate(date: Date): ZodiacSign {
  const m = date.getMonth() + 1; // 1~12
  const d = date.getDate();

  for (const { sign, start, end } of RANGES) {
    const crossesYear = start.month > end.month; // 예: capricorn (12월 → 1월)

    if (crossesYear) {
      const inStartYear =
        (m === start.month && d >= start.day) || (m > start.month && m <= 12);
      const inEndYear =
        (m === end.month && d <= end.day) || (m < end.month && m >= 1);
      if (inStartYear || inEndYear) return sign;
    } else {
      const afterStart = m > start.month || (m === start.month && d >= start.day);
      const beforeEnd  = m < end.month || (m === end.month && d <= end.day);
      if (afterStart && beforeEnd) return sign;
    }
  }

  // 안전망
  return "capricorn";
}