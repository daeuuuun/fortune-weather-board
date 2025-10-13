export type MoodCategory = "Happy" | "Calm" | "Energetic" | "Romantic" | "Focus";


function normalize(s?: string) {
  return (s || "").toLowerCase();
}


export function pickMood(fortuneMood?: string, weatherMain?: string): MoodCategory {
  const m = normalize(fortuneMood);
  const w = normalize(weatherMain);


  if (m.includes("romantic")) return "Romantic";
  if (m.includes("energetic") || m.includes("active")) return "Energetic";
  if (m.includes("happy") || m.includes("joy")) return "Happy";
  if (m.includes("calm") || m.includes("relax") || w.includes("cloud")) return "Calm";


  if (w.includes("thunder") || w.includes("storm") || w.includes("snow")) return "Calm";
  if (w.includes("clear")) return "Happy";
  if (w.includes("rain") || w.includes("drizzle")) return "Focus";


  return "Focus";
}


export function moodToYoutube(m: MoodCategory): string {
  const map: Record<MoodCategory, string> = {
    Happy: "https://www.youtube.com/embed/5qap5aO4i9A",
    Calm: "https://www.youtube.com/embed/DWcJFNfaw9c",
    Energetic: "https://www.youtube.com/embed/f02mOEt11OQ",
    Romantic: "https://www.youtube.com/embed/1w7OgIMMRc4",
    Focus: "https://www.youtube.com/embed/jfKfPfyJRdk",
  };
  return map[m];
}