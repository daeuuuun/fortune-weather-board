import { useEffect, useMemo, useRef, useState } from "react";
import type { UserProfile as TUserProfile } from "../types";
import { getZodiacFromDate, KOREAN_SIGN_LABEL } from "../utils/zodiac";
import card from "../styles/card.module.css";
import s from "./UserIntro.module.css";
import clsx from "clsx";

type Props = { onComplete: (profile: TUserProfile) => void };

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export default function UserIntro({ onComplete }: Props) {
  // 이름
  const [name, setName] = useState("");
  const nameRef = useRef<HTMLInputElement | null>(null);

  // 날짜: YYYY-MM-DD (단일 입력)
  const [birthISO, setBirthISO] = useState("");

  // 터치 여부
  const [touched, setTouched] = useState(false);

  // 오늘(로컬) ISO → date input의 max Limiter
  const todayISO = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }, []);

  // Date 객체 + 별자리
  const birthDate = useMemo(() => {
    if (!birthISO) return null;
    const d = new Date(`${birthISO}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }, [birthISO]);

  const sign = useMemo(() => (birthDate ? getZodiacFromDate(birthDate) : null), [birthDate]);

  // 검증
  const nameError = touched && name.trim().length === 0 ? "이름을 입력해 주세요." : "";
  const dateError = touched && !birthDate ? "생년월일을 선택해 주세요." : "";

  const disabled = !name.trim() || !birthDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (disabled || !birthISO) return;
    const profile: TUserProfile = { name: name.trim(), birthISO };
    onComplete(profile);
  };

  // Enter로 다음 필드로 이동/제출
  const onNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const birthInput = document.getElementById("birth") as HTMLInputElement | null;
      if (birthInput) {
        if (birthInput.showPicker) birthInput.showPicker();
        else birthInput.focus();
      }
    }
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={card.card} aria-labelledby="intro-title">
      <h2 id="intro-title" className={clsx(card.heading, s.titleExtra)}>프로필 설정</h2>
      <p className={card.meta}>이름과 생년월일을 입력하면 별자리를 자동으로 추측해 드려요.</p>

      <div className={card.formGrid}>
        {/* 이름 */}
        <label className={card.labelBlock}>
          <span className={card.label}>이름</span>
          <input
            ref={nameRef}
            type="text"
            inputMode="text"
            autoComplete="name"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={onNameKeyDown}
            className={clsx(card.input, nameError && card.inputError)}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "name-err" : undefined}
          />
          {nameError && <span id="name-err" className={card.errText}>{nameError}</span>}
        </label>

        {/* 생년월일 (단일 date 입력) */}
        <label className={card.labelBlock}>
          <span className={card.label}>생년월일</span>
          <input
            id="birth"
            type="date"
            value={birthISO}
            onChange={(e) => setBirthISO(e.target.value)}
            onBlur={() => setTouched(true)}
            className={clsx(card.input, dateError && card.inputError)}
            aria-invalid={!!dateError}
            aria-describedby={dateError ? "birth-err" : undefined}
            max={todayISO}
            min="1900-01-01"
          />
          {dateError && <span id="birth-err" className={card.errText}>{dateError}</span>}

          {/* 별자리 미리보기 */}
          <div className={card.preview}>
            {sign ? (
              <>
                추측된 별자리: <strong>{KOREAN_SIGN_LABEL[sign]}</strong>
                <span className={card.previewCode}>({sign})</span>
              </>
            ) : (
              <span className={card.previewDim}>날짜를 선택하면 별자리가 표시됩니다.</span>
            )}
          </div>
        </label>

        {/* 액션 */}
        <div className={card.actions}>
          <button
            type="submit"
            className={clsx(card.btn, disabled && card.btnDisabled)}
            disabled={disabled}
          >
            확인
          </button>
        </div>
      </div>
    </form>
  );
}