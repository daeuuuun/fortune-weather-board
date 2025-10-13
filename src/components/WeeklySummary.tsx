import type { SavedFortune } from "../types";
import s from "../styles/card.module.css";


function bucket(mood?: string) {
  const t = (mood || '').toLowerCase();
  if (t.includes('romantic')) return 'Romantic';
  if (t.includes('energetic') || t.includes('active')) return 'Energetic';
  if (t.includes('happy') || t.includes('joy')) return 'Happy';
  if (t.includes('calm') || t.includes('relax')) return 'Calm';
  return 'Focus';
}


export default function WeeklySummary({ items }: { items: SavedFortune[] }) {
  const last7 = items.slice(-7);
  const counts = last7.reduce<Record<string, number>>((acc, x) => {
    const k = bucket(x.mood);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];


  return (
    <div className={s.card}>
      <h3 className={s.heading}>📊 이번 주 무드 요약</h3>
      <div className={s.meta}>가장 많이 등장한 무드: <b>{top || '—'}</b></div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([k, v]) => (
          <span key={k} className={s.badge}>{k}: {v}</span>
        ))}
      </div>
    </div>
  );
}