export type Coordinates = { lat: number; lon: number };


export type WeatherData = {
name: string; // city
main: { temp: number; humidity: number };
weather: { main: string; description: string; icon: string }[];
};


export type ZodiacSign =
| "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
| "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";


export type FortuneData = {
sign: ZodiacSign;
date_range: string;
current_date: string;
description: string;
compatibility: string;
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