import type { ZodiacSign } from "../types";

const OPTIONS: Array<{ value: ZodiacSign; label: string }> = [
  { value: "aries", label: "양자리" },
  { value: "taurus", label: "황소자리" },
  { value: "gemini", label: "쌍둥이자리" },
  { value: "cancer", label: "게자리" },
  { value: "leo", label: "사자자리" },
  { value: "virgo", label: "처녀자리" },
  { value: "libra", label: "천칭자리" },
  { value: "scorpio", label: "전갈자리" },
  { value: "sagittarius", label: "사수자리" },
  { value: "capricorn", label: "염소자리" },
  { value: "aquarius", label: "물병자리" },
  { value: "pisces", label: "물고기자리" },
];

export default function ZodiacPicker({
  value,
  onChange,
}: {
  value: ZodiacSign;
  onChange: (s: ZodiacSign) => void;
}) {
  return (
    <select
      aria-label="별자리 선택"
      value={value}
      onChange={(e) => onChange(e.target.value as ZodiacSign)}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
