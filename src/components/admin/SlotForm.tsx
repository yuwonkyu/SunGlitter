import type { FormEvent } from "react";
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
export default function SlotForm({
  draft,
  saving,
  onChange,
  onSubmit,
  onReset,
}: SlotFormProps) {
  const [hour, minute] = draft.time.split(":");

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-zinc-300 bg-zinc-50 p-4"
    >
      <p className="text-sm font-semibold">
        {draft.id ? "예약 슬롯 수정" : "예약 슬롯 등록"}
      </p>

      <input
        type="date"
        value={draft.date}
        onChange={(e) => onChange({ ...draft, date: e.target.value })}
        className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
        required
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={hour ?? "00"}
          onChange={(e) =>
            onChange({ ...draft, time: `${e.target.value}:${minute ?? "00"}` })
          }
          className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}시
            </option>
          ))}
        </select>
        <select
          value={minute ?? "00"}
          onChange={(e) =>
            onChange({ ...draft, time: `${hour ?? "00"}:${e.target.value}` })
          }
          className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
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
      />

      <select
        value={draft.status}
        onChange={(e) =>
          onChange({ ...draft, status: e.target.value as ReservationStatus })
        }
        className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
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
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={saving}
          type="submit"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          {saving ? "저장 중..." : draft.id ? "수정 저장" : "신규 등록"}
        </button>
        <button
          type="button"
          className="rounded-md border border-zinc-500 px-3 py-2 text-sm"
          onClick={onReset}
        >
          초기화
        </button>
      </div>
    </form>
  );
}
