import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import a from "./styles/app.module.css";
import WeatherCard from "./components/WeatherCard";
import FortuneCard from "./components/FortuneCard";
import WeeklyFortune from "./components/WeeklyFortune";
import MoodPlayer from "./components/MoodPlayer";
import ThemeToggle from "./components/ThemeToggle";
import { fetchWeather } from "./services/openweather";
import { getFortuneRobust } from "./services/fortuneService";
import type {
  Coordinates,
  FortuneData,
  SavedFortune,
  WeatherData,
  ZodiacSign,
  UserProfile as TUserProfile,
} from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import UserIntro from "./components/UserIntro";
import { getZodiacFromDate, KOREAN_SIGN_LABEL } from "./utils/zodiac";
import dayjs from "dayjs";
import clsx from "clsx";

function pickMoodLabel(fortuneMood?: string, weatherMain?: string): string {
  const m = (fortuneMood || "").toLowerCase();
  const w = (weatherMain || "").toLowerCase();
  if (m.includes("romantic")) return "Romantic";
  if (m.includes("energetic") || m.includes("active")) return "Energetic";
  if (m.includes("happy") || m.includes("joy")) return "Happy";
  if (m.includes("calm") || m.includes("relax") || w.includes("cloud")) return "Calm";
  if (w.includes("clear")) return "Happy";
  if (w.includes("rain") || w.includes("drizzle")) return "Focus";
  return "Focus";
}

function moodToYoutube(label: string): string {
  const map: Record<string, string> = {
    Happy: "https://www.youtube.com/embed/5qap5aO4i9A",
    Calm: "https://www.youtube.com/embed/DWcJFNfaw9c",
    Energetic: "https://www.youtube.com/embed/f02mOEt11OQ",
    Romantic: "https://www.youtube.com/embed/1w7OgIMMRc4",
    Focus: "https://www.youtube.com/embed/jfKfPfyJRdk",
  };
  return map[label] ?? map.Focus;
}

export default function App() {
  // 프로필 (이름/생일) 저장
  const [profile, setProfile] = useLocalStorage<TUserProfile | null>("user-profile", null);

  // 별자리 자동 추측
  const sign: ZodiacSign | null = useMemo(() => {
    if (!profile?.birthISO) return null;
    const d = new Date(profile.birthISO + "T00:00:00");
    return getZodiacFromDate(d);
  }, [profile?.birthISO]);

  // 인사말 (예: 홍길동님의 10월 13일 운세입니다.)
  const greeting = useMemo(() => {
    const m = dayjs().month() + 1;
    const d = dayjs().date();
    const name = profile?.name || "사용자";
    return `${name}님의 ${m}월 ${d}일 운세입니다.`;
  }, [profile?.name]);

  // 위치/날씨
  const envLat = parseFloat(import.meta.env.VITE_DEFAULT_LAT || "37.5665");
  const envLon = parseFloat(import.meta.env.VITE_DEFAULT_LON || "126.9780");
  const [coords, setCoords] = useState<Coordinates>({ lat: envLat, lon: envLon });
  const [locStatus, setLocStatus] = useState<"idle" | "resolving" | "resolved" | "denied" | "error">("idle");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // 운세/히스토리
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  // 별자리에 따라 자동으로 로컬스토리지 key 분리
  const storageKey = sign ? `fortune_${sign}` : "fortune_default";
  const [history, setHistory] = useLocalStorage<SavedFortune[]>(storageKey, []);

  const todayISO = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

  const calledRef = useRef<string | null>(null);

  // 무드
  const weatherMain = weather?.weather?.[0]?.main;
  const moodLabel = pickMoodLabel(fortune?.mood, weatherMain);
  const moodSrc = moodToYoutube(moodLabel);

  // 지오로케이션
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setLocStatus("resolving");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        setLocStatus("resolved");
      },
      (err) => {
        console.warn("위치 권한 거부/오류:", err);
        setLocStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  }, []);

  // 날씨
  useEffect(() => {
    (async () => {
      try {
        const w = await fetchWeather(coords, "metric", "kr"); // 한국어
        setWeather(w);
      } catch (e) {
        console.error(e);
      }
      try {
        localStorage.setItem("last-coords", JSON.stringify(coords));
      } catch {
        /* ignore */
      }
    })();
  }, [coords]);

  // 운세 (프로필/별자리 준비되면 호출)
  useEffect(() => {
    if (!sign) return;
    const key = `${sign}|${todayISO}`;
    if (calledRef.current === key) return; // 🔒 Dev 더블 인보크 방어
    calledRef.current = key;

    (async () => {
      const f = await getFortuneRobust(sign);
      setFortune(f);
      setHistory(prev => {
        const filtered = prev.filter(p => p.dateISO !== todayISO);
        return [
          ...filtered,
          { dateISO: todayISO, sign: f.sign, description: f.description, mood: f.mood },
        ].slice(-14);
      });
    })();
  }, [sign, todayISO, setHistory]);

  // 무드에 따른 배경
  useLayoutEffect(() => {
    const classes = ["happy", "calm", "romantic", "energetic", "neutral"];
    document.body.classList.remove(...classes);
    const c =
      moodLabel === "Happy"
        ? "happy"
        : moodLabel === "Calm"
          ? "calm"
          : moodLabel === "Romantic"
            ? "romantic"
            : moodLabel === "Energetic"
              ? "energetic"
              : "neutral";
    document.body.classList.add(c);
  }, [moodLabel]);

  // 첫 방문: 프로필 입력 화면
  if (!profile) {
    return (
      <div className="container">
        <header className={a.header}>
          <div>
            <div className={a.title}>🥇 오늘의 운세 & 날씨 대시보드</div>
            <div className={a.sub}>이름과 생년월일로 별자리를 자동으로 추측합니다.</div>
          </div>
          <div className={a.controls}>
            <ThemeToggle />
          </div>
        </header>
        <main className={a.layout}>
          <section className={clsx(a.col8, a.col12)}>
            <UserIntro onComplete={(p) => setProfile(p)} />
          </section>
        </main>
      </div>
    );
  }

  console.log("SIGN:", sign);
  console.log("PROFILE:", profile);


  return (
    <div className="container">
      <header className={a.header}>
        <div>
          <div className={a.title}>{greeting}</div>
          {sign && <div className={a.sub}>별자리: {KOREAN_SIGN_LABEL[sign]} ({sign})</div>}
        </div>
        <div className={a.controls}>
          <button onClick={() => setProfile(null)} className={a.profileBtn}>
            🔄 프로필 변경
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className={a.layout}>
        {/* 날씨 카드 */}
        <section className={clsx(a.col4)}>
          {locStatus === "resolving" && <div className={a.sub}>📍 현재 위치 가져오는 중…</div>}
          {locStatus === "denied" && <div className={a.sub}>📍 위치 권한이 거부되어 기본 위치를 사용합니다.</div>}
          {locStatus === "error" && <div className={a.sub}>📍 위치 정보를 가져오지 못해 기본 위치를 사용합니다.</div>}
          <WeatherCard data={weather} />
        </section>

        {/* ✅ 오늘의 운세 카드 (FortuneCard 실제 렌더링) */}
        <section className={clsx(a.col8)}>
          {fortune ? (
            <FortuneCard data={fortune} />
          ) : (
            <div className={a.sub}>🔮 운세를 불러오는 중이거나 서버가 혼잡합니다. 잠시 뒤 자동 재시도합니다.</div>
          )}
        </section>


        {/* 무드 플레이어 */}
        <section className={clsx(a.col12)}>
          <MoodPlayer label={moodLabel} src={moodSrc} />
        </section>

        {/* ✅ 주간 운세 (WeeklyFortune 실제 렌더링) */}
        <section className={clsx(a.col12)}>
          {history?.length ? (
            <WeeklyFortune items={history} />
          ) : (
            <div className={a.sub}>🗓️ 아직 저장된 주간 운세가 없습니다. 오늘부터 자동으로 기록돼요!</div>
          )}
        </section>
      </main>
    </div>
  );
}
