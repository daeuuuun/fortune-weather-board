import { motion } from "framer-motion";
import s from "../styles/card.module.css";
import type { FortuneData } from "../types";

export default function FortuneCard({ data }: { data: FortuneData | null }) {
  if (!data) return null;
  return (
    <motion.div
      className={s.card}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className={s.heading}>🔮 오늘의 운세</h3>
      <p style={{ marginTop: 8 }}>{data.description}</p>
      <div className={s.kv}>
        <div><span className={s.badge}>mood</span> {data.mood}</div>
        <div><span className={s.badge}>lucky number</span> {data.lucky_number}</div>
        <div><span className={s.badge}>lucky time</span> {data.lucky_time}</div>
      </div>
    </motion.div>
  );
}