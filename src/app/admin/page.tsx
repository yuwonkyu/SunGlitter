"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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
  time: "",
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
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

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

  const ordered = useMemo(() => {
    return [...items].sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    );
  }, [items]);

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
    setDraft(emptyDraft);
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
    setDraft(emptyDraft);
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
      setDraft(emptyDraft);
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
            관리자만 등록/수정/삭제할 수 있습니다.
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
                {draft.id ? "스케줄 수정" : "스케줄 등록"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
                  required
                />
                <input
                  type="time"
                  value={draft.time}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>

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
                  onClick={() => setDraft(emptyDraft)}
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

        <section className="space-y-2">
          {ordered.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-zinc-300 bg-zinc-50 p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  {item.date} {item.time}
                </p>
                {authenticated ? (
                  <div className="flex gap-2 text-xs">
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
                ) : null}
              </div>
              <p className="mt-1 text-sm text-zinc-700">{item.guestName}</p>
              <p className="mt-1 text-xs text-zinc-500">상태: {item.status}</p>
              {item.note ? (
                <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
              ) : null}
            </article>
          ))}
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
