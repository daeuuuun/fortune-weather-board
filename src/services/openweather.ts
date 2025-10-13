import type { Coordinates, WeatherData } from "../types";

const BASE = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeather(
  coords: Coordinates,
  units: "metric" | "imperial" = "metric",
  lang: "kr" | "en" = "kr" // ← 한국어 기본
): Promise<WeatherData> {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
  const url =
    `${BASE}?lat=${coords.lat}&lon=${coords.lon}` +
    `&appid=${key}&units=${units}&lang=${lang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}
