import { useEffect, useState } from "react";
import type { FortuneData, ZodiacSign } from "../types";
import { fetchFortune } from "../services/aztro";
import s from "../styles/card.module.css";


const SIGNS: ZodiacSign[] = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];


export default function ZodiacGrid({ onPick }: { onPick: (s: ZodiacSign) => void }) {
  const [data, setData] = useState<Record<ZodiacSign, FortuneData | null>>(
    {} as Record<ZodiacSign, FortuneData | null>
  );
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          SIGNS.map(async (sign): Promise<FortuneData | null> => {
            try {
              return await fetchFortune(sign, "today");
            } catch {
              return null;
            }
          })
        );
        const map = Object.fromEntries(SIGNS.map((s, i) => [s, results[i]])) as Record<ZodiacSign, FortuneData | null>;
        setData(map);
      } finally { setLoading(false); }
    })();
  }, []);


  return (
    <div className={s.card}>
      <h3 className={s.heading}>✨ 별자리별 오늘의 한 줄 요약</h3>
      {loading ? <div className={s.meta}>Loading…</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {SIGNS.map(sign => {
            const f = data[sign];
            return (
              <button key={sign} onClick={() => onPick(sign)} style={{ textAlign: 'left', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, cursor: 'pointer' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{sign}</div>
                <div className={s.meta} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {f?.description || '—'}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}