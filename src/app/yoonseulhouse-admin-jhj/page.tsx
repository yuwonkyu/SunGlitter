"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  groupItemsByDate,
  statusLabel,
  statusTone,
  toDateKey,
} from "@/lib/calendar";
import type { ReservationStatus, ScheduleItem } from "@/types/schedule";

type Draft = {
  id?: string;
  date: string;
  time: string;
  guestName: string;
  status: ReservationStatus;
  note: string;
};

const emptyDraft: Draft = {
  date: "",
  time: "00:00",
  guestName: "",
  status: "available",
  note: "",
};

const statusOptions: { label: string; value: ReservationStatus }[] = [
  { label: "예약 가능", value: "available" },
  { label: "대기", value: "pending" },
  { label: "예약 완료", value: "booked" },
];

export default function AdminPage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<Draft>({
    ...emptyDraft,
    date: toDateKey(new Date()),
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));

  const loadData = async () => {
    const res = await fetch("/api/schedule", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as ScheduleItem[];
      setItems(data);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const authRes = await fetch("/api/admin/login", { cache: "no-store" });
        if (authRes.ok) {
          const result = (await authRes.json()) as { authenticated: boolean };
          setAuthenticated(result.authenticated);
        }
        await loadData();
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const grouped = useMemo(() => groupItemsByDate(items), [items]);
  const selectedItems = grouped[selectedDate] ?? [];

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setMessage("로그인에 실패했습니다.");
      return;
    }

    setAuthenticated(true);
    setPassword("");
    setMessage("로그인 되었습니다.");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setDraft({ ...emptyDraft, date: selectedDate });
    setMessage("로그아웃 되었습니다.");
  };

  const submitDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const method = draft.id ? "PUT" : "POST";

    const res = await fetch("/api/schedule", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draft),
    });

    if (!res.ok) {
      setSaving(false);
      setMessage("저장 실패: 로그인 상태나 입력값을 확인해주세요.");
      return;
    }

    const data = (await res.json()) as ScheduleItem[];
    setItems(data);
    setDraft({ ...emptyDraft, date: selectedDate });
    setSaving(false);
    setMessage(draft.id ? "수정 완료" : "등록 완료");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/schedule", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      setMessage("삭제 실패: 관리자 로그인 상태를 확인해주세요.");
      return;
    }

    const data = (await res.json()) as ScheduleItem[];
    setItems(data);
    if (draft.id === id) {
      setDraft({ ...emptyDraft, date: selectedDate });
    }
    setMessage("삭제 완료");
  };

  if (loading) {
    return (
      <div className="paper-bg min-h-screen p-6 text-sm">불러오는 중...</div>
    );
  }

  return (
    <div className="paper-bg min-h-screen px-5 py-8">
      <main className="mx-auto w-full max-w-md space-y-4">
        <header className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-bold">관리자 예약현황판</h1>
          <p className="mt-2 text-sm text-zinc-600">
            날짜와 시간을 직접 입력해 슬롯을 등록하고 상태를 변경합니다.
          </p>
        </header>

        {!authenticated ? (
          <form
            onSubmit={handleLogin}
            className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 space-y-3"
          >
            <label className="block text-sm font-medium">관리자 비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
              placeholder="비밀번호 입력"
              required
            />
            <button
              type="submit"
              className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white"
            >
              로그인
            </button>
          </form>
        ) : (
          <>
            <form
              onSubmit={submitDraft}
              className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 space-y-3"
            >
              <p className="text-sm font-semibold">
                {draft.id ? "예약 슬롯 수정" : "예약 슬롯 등록"}
              </p>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => {
                  const nextDate = e.target.value;
                  setDraft((prev) => ({ ...prev, date: nextDate }));
                  setSelectedDate(nextDate);
                }}
                className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={draft.time.split(":")[0] ?? "00"}
                  onChange={(e) => {
                    const hour = e.target.value;
                    const minute = draft.time.split(":")[1] ?? "00";
                    setDraft((prev) => ({
                      ...prev,
                      time: `${hour}:${minute}`,
                    }));
                  }}
                  className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
                >
                  {Array.from({ length: 24 }, (_, i) =>
                    String(i).padStart(2, "0"),
                  ).map((h) => (
                    <option key={h} value={h}>
                      {h}시
                    </option>
                  ))}
                </select>
                <select
                  value={draft.time.split(":")[1] ?? "00"}
                  onChange={(e) => {
                    const hour = draft.time.split(":")[0] ?? "00";
                    const minute = e.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      time: `${hour}:${minute}`,
                    }));
                  }}
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
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, guestName: e.target.value }))
                }
                className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
                placeholder="예약자/타임슬롯 이름"
                required
              />

              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: e.target.value as ReservationStatus,
                  }))
                }
                className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <textarea
                value={draft.note}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, note: e.target.value }))
                }
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
                  onClick={() =>
                    setDraft({ ...emptyDraft, date: selectedDate })
                  }
                >
                  초기화
                </button>
              </div>
            </form>

            <button
              onClick={handleLogout}
              className="w-full rounded-md border border-zinc-500 bg-zinc-100 px-3 py-2 text-sm"
            >
              로그아웃
            </button>
          </>
        )}

        {message ? (
          <p className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
            {message}
          </p>
        ) : null}

        <section className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">
                {selectedDate} 슬롯 목록
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                날짜를 직접 바꾸면 해당 날짜 슬롯만 표시됩니다.
              </p>
            </div>
            <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-600">
              총 {selectedItems.length}건
            </span>
          </div>

          {selectedItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600">
              아직 등록된 슬롯이 없습니다.
            </p>
          ) : (
            selectedItems.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-zinc-300 bg-white p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.time}</p>
                    <p className="mt-1 text-sm text-zinc-700">
                      {item.guestName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs ${statusTone[item.status]}`}
                  >
                    {statusLabel[item.status]}
                  </span>
                </div>

                {item.note ? (
                  <p className="mt-2 text-xs text-zinc-500">{item.note}</p>
                ) : null}

                <div className="mt-3 flex gap-3 text-xs">
                  <button
                    onClick={() =>
                      setDraft({
                        id: item.id,
                        date: item.date,
                        time: item.time,
                        guestName: item.guestName,
                        status: item.status,
                        note: item.note ?? "",
                      })
                    }
                    className="underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => void handleDelete(item.id)}
                    className="underline text-zinc-700"
                  >
                    삭제
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <div className="pt-3 text-center text-sm">
          <Link href="/" className="underline underline-offset-4 text-zinc-700">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
