import s from "../styles/card.module.css";

export default function MoodPlayer({ label, src }: { label: string; src: string }) {
  return (
    <div className={s.card}>
      <h3 className={s.heading}>🎵 무드 플레이어 — {label}</h3>
      <div className={s.embed}>
        <iframe src={src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Mood"></iframe>
      </div>
    </div>
  );
}