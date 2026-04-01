import { memo, useEffect, useMemo, useState, type FormEvent } from "react";
import { createMonthGrid, fromDateKey, toDateKey } from "@/lib/calendar";
import type { ReservationStatus } from "@/types/schedule";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import WeekdayHeader from "@/components/calendar/WeekdayHeader";
import StatusSelect from "./StatusSelect";

export type Draft = {
  id?: string;
  date: string;
  time: string;
  guestName: string;
  status: ReservationStatus;
  note: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

interface SlotFormProps {
  draft: Draft;
  saving: boolean;
  registeredDates: string[];
  onChange: (next: Draft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

/**
 * 예약 슬롯 등록/수정 폼. 날짜, 시(0–23), 분(00/30), 예약자명, 상태, 메모를 입력합니다.
 */
const SlotForm = memo(
  ({
    draft,
    saving,
    registeredDates,
    onChange,
    onSubmit,
    onReset,
  }: SlotFormProps) => {
    const [hour = "00", minute = "00"] = draft.time.split(":");
    const isEditMode = Boolean(draft.id);
    const [viewMonth, setViewMonth] = useState(() => {
      const selected = draft.date ? fromDateKey(draft.date) : null;
      const source = selected ?? new Date();
      return new Date(source.getFullYear(), source.getMonth(), 1);
    });
    const grid = useMemo(() => createMonthGrid(viewMonth), [viewMonth]);
    const todayKey = useMemo(() => toDateKey(new Date()), []);
    const registeredDateSet = useMemo(
      () => new Set(registeredDates),
      [registeredDates],
    );

    useEffect(() => {
      if (!draft.date) {
        return;
      }
      const selected = fromDateKey(draft.date);
      if (!selected) {
        return;
      }
      const nextViewMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
      queueMicrotask(() => setViewMonth(nextViewMonth));
    }, [draft.date]);

    const prevMonth = () => {
      setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    };
    const nextMonth = () => {
      setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    };

    const formClassName = isEditMode
      ? "space-y-3 rounded-xl border border-amber-400 bg-amber-50 p-4"
      : "space-y-3 rounded-xl border border-emerald-400 bg-emerald-50 p-4";
    const submitClassName = isEditMode
      ? "rounded-md bg-amber-700 px-3 py-2 text-sm text-white disabled:opacity-60"
      : "rounded-md bg-emerald-700 px-3 py-2 text-sm text-white disabled:opacity-60";

    return (
      <form onSubmit={onSubmit} className={formClassName}>
        <p className="text-sm font-semibold text-zinc-900">
          {isEditMode ? "예약 슬롯 수정" : "예약 슬롯 등록"}
        </p>

        <p className="text-xs text-zinc-600" aria-live="polite">
          선택 날짜: {draft.date || "달력에서 날짜를 선택해주세요."}
        </p>

        <div className="rounded-lg border border-zinc-300 bg-white p-3">
          <CalendarHeader
            viewMonth={viewMonth}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            buttonClassName="rounded-md border border-zinc-300 px-2 py-1 text-xs"
            titleClassName="text-sm font-semibold text-zinc-800"
            useArrowIcon={false}
            prevText="이전"
            nextText="다음"
          />

          <WeekdayHeader
            className="mb-1 grid grid-cols-7 text-center text-[11px] text-zinc-500"
            labelClassName="py-1"
          />

          <div className="grid grid-cols-7 gap-1">
            {grid.map(({ key, date, isCurrentMonth }) => {
              const isSelected = draft.date === key;
              const isToday = key === todayKey;
              const isRegistered = registeredDateSet.has(key);

              const cellClassName = [
                "h-9 rounded-md border text-xs transition",
                isCurrentMonth
                  ? "text-zinc-800"
                  : "border-transparent text-zinc-400",
                isRegistered
                  ? "border-lime-500/30 bg-lime-300/45"
                  : "bg-zinc-50",
                isSelected ? "ring-2 ring-emerald-500" : "",
                isToday ? "font-semibold" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={key}
                  type="button"
                  className={cellClassName}
                  onClick={() => onChange({ ...draft, date: key })}
                  aria-label={`${key} 날짜 선택`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-zinc-600">
            연두색(반투명): 이미 예약 슬롯이 등록된 날짜
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={hour}
            onChange={(e) =>
              onChange({ ...draft, time: `${e.target.value}:${minute}` })
            }
            className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
            aria-label="시간"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}시
              </option>
            ))}
          </select>
          <select
            value={minute}
            onChange={(e) =>
              onChange({ ...draft, time: `${hour}:${e.target.value}` })
            }
            className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
            aria-label="분"
          >
            <option value="00">00분</option>
            <option value="30">30분</option>
          </select>
        </div>
        <p className="text-xs text-zinc-500">
          예약 시간은 30분 단위로 등록됩니다.
        </p>

        <input
          type="text"
          value={draft.guestName}
          onChange={(e) => onChange({ ...draft, guestName: e.target.value })}
          className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
          placeholder="예약자/타임슬롯 이름"
          required
          aria-label="예약자 이름"
        />

        <StatusSelect
          value={draft.status}
          onChange={(status) => onChange({ ...draft, status })}
        />

        <textarea
          value={draft.note}
          onChange={(e) => onChange({ ...draft, note: e.target.value })}
          className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
          rows={3}
          placeholder="메모 (선택)"
          aria-label="메모"
        />

        <div className="grid grid-cols-2 gap-2">
          <button disabled={saving} type="submit" className={submitClassName}>
            {saving ? "저장 중..." : draft.id ? "수정 저장" : "신규 등록"}
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-500 px-3 py-2 text-sm"
            onClick={onReset}
            aria-label="폼 초기화"
          >
            초기화
          </button>
        </div>
      </form>
    );
  },
);

SlotForm.displayName = "SlotForm";

export default SlotForm;
