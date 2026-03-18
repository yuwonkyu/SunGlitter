import { memo, type FormEvent } from "react";
import type { ReservationStatus } from "@/types/schedule";

export type Draft = {
  id?: string;
  date: string;
  time: string;
  guestName: string;
  status: ReservationStatus;
  note: string;
};

const STATUS_OPTIONS: { label: string; value: ReservationStatus }[] = [
  { label: "예약 가능", value: "available" },
  { label: "대기", value: "pending" },
  { label: "예약 완료", value: "booked" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

interface SlotFormProps {
  draft: Draft;
  saving: boolean;
  onChange: (next: Draft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

/**
 * 예약 슬롯 등록/수정 폼. 날짜, 시(0–23), 분(00/30), 예약자명, 상태, 메모를 입력합니다.
 */
const SlotForm = memo(
  ({ draft, saving, onChange, onSubmit, onReset }: SlotFormProps) => {
    const [hour = "00", minute = "00"] = draft.time.split(":");
    const isEditMode = Boolean(draft.id);
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

        <input
          type="date"
          value={draft.date}
          onChange={(e) => onChange({ ...draft, date: e.target.value })}
          className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
          required
          aria-label="예약 날짜"
        />

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

        <select
          value={draft.status}
          onChange={(e) =>
            onChange({ ...draft, status: e.target.value as ReservationStatus })
          }
          className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
          aria-label="예약 상태"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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
