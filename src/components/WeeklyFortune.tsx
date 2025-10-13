import { motion } from "framer-motion";
import s from "../styles/card.module.css";
import type { SavedFortune } from "../types";
import dayjs from "dayjs";


export default function WeeklyFortune({ items }: { items: SavedFortune[] }) {
  const last7 = items.slice(-7);
  if (!last7.length) return null;
  return (
    <motion.div className={s.card} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className={s.heading}>🗓️ 나의 주간 운세</h3>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {last7.map((f, i) => (
          <li key={i} className={s.meta}>
            {dayjs(f.dateISO).format("MM/DD")} · {f.sign} — {f.mood} — {f.description}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}