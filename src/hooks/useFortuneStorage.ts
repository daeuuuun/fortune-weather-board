import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { SavedFortune, ZodiacSign } from "../types";

export function useFortuneStorage(sign: ZodiacSign | null) {
  const storageKey = useMemo(() => (sign ? `fortune_${sign}` : ""), [sign]);

  const [fortunes, setFortunes] = useLocalStorage<SavedFortune[]>(storageKey || "__ignore__", []);

  const addFortune = (newFortune: SavedFortune) => {
    setFortunes((prev) => {
      const updated = [...prev, newFortune];
      return updated.slice(-30); // 최근 30일까지만 유지 (선택)
    });
  };

  return { fortunes, addFortune };
}
