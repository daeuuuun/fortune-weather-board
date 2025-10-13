import { motion } from "framer-motion";
import s from "../styles/card.module.css";
import type { WeatherData } from "../types";


export default function WeatherCard({ data }: { data: WeatherData | null }) {
if (!data) return null;
const w = data.weather[0];
return (
<motion.div className={s.card} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
<h3 className={s.heading}>☀️ 오늘의 날씨 — {data.name}</h3>
<div className={s.row}>
<img src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`} alt={w.main} width={64} height={64} />
<div>
<div style={{ fontSize: 28, fontWeight: 700 }}>{Math.round(data.main.temp)}°</div>
<div className={s.meta}>{w.main} · {w.description}</div>
</div>
</div>
</motion.div>
);
}