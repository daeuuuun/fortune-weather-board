export type Coordinates = { lat: number; lon: number };


export type WeatherData = {
name: string; // city
main: { temp: number; humidity: number };
weather: { main: string; description: string; icon: string }[];
};


export type ZodiacSign =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

// 표시용 이름
export const ZODIAC_KR: Record<ZodiacSign, string> = {
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

export type FortuneData = {
sign: ZodiacSign;
date_range: string;
current_date: string;
description: string;
mood: string;
color: string;
lucky_number: string;
lucky_time: string;
};


export type SavedFortune = {
dateISO: string; // e.g. 2025-10-13
sign: ZodiacSign;
description: string;
mood: string;
};

export type UserProfile = {
  name: string;
  birthISO: string; // 'YYYY-MM-DD'
};