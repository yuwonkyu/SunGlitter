"use client";
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { groupItemsByDate, toDateKey } from "@/lib/calendar";
import type { ScheduleItem } from "@/types/schedule";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import BackLink from "@/components/ui/BackLink";
import LoginForm from "@/components/admin/LoginForm";
import SlotForm, { type Draft } from "@/components/admin/SlotForm";
import SlotCard from "@/components/admin/SlotCard";

const makeDraft = (date: string): Draft => ({
  date,
  time: "00:00",
  guestName: "",
  status: "available",
  note: "",
});

export default function AdminPage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<Draft>(() =>
    makeDraft(toDateKey(new Date())),
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));

  const loadData = async () => {
    const res = await fetch("/api/schedule", { cache: "no-store" });
    if (res.ok) setItems((await res.json()) as ScheduleItem[]);
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
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    setDraft(makeDraft(selectedDate));
    setMessage("로그아웃 되었습니다.");
  };

  const handleDraftChange = (next: Draft) => {
    if (next.date !== draft.date) setSelectedDate(next.date);
    setDraft(next);
  };

  const submitDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/schedule", {
      method: draft.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (!res.ok) {
      setMessage("저장 실패: 로그인 상태나 입력값을 확인해주세요.");
      return;
    }
    setItems((await res.json()) as ScheduleItem[]);
    setDraft(makeDraft(selectedDate));
    setMessage(draft.id ? "수정 완료" : "등록 완료");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setMessage("삭제 실패: 관리자 로그인 상태를 확인해주세요.");
      return;
    }
    setItems((await res.json()) as ScheduleItem[]);
    if (draft.id === id) setDraft(makeDraft(selectedDate));
    setMessage("삭제 완료");
  };

  if (loading) {
    return (
      <div className="paper-bg min-h-screen p-6 text-sm">불러오는 중...</div>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="관리자 예약현황판"
        description="날짜와 시간을 직접 입력해 슬롯을 등록하고 상태를 변경합니다."
      />

      {!authenticated ? (
        <LoginForm
          password={password}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      ) : (
        <>
          <SlotForm
            draft={draft}
            saving={saving}
            onChange={handleDraftChange}
            onSubmit={submitDraft}
            onReset={() => setDraft(makeDraft(selectedDate))}
          />
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

      <section className="space-y-3 rounded-xl border border-zinc-300 bg-zinc-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{selectedDate} 슬롯 목록</h3>
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
            <SlotCard
              key={item.id}
              item={item}
              onEdit={(it) =>
                setDraft({
                  id: it.id,
                  date: it.date,
                  time: it.time,
                  guestName: it.guestName,
                  status: it.status,
                  note: it.note ?? "",
                })
              }
              onDelete={(id) => void handleDelete(id)}
            />
          ))
        )}
      </section>

      <BackLink className="pt-3" />
    </PageShell>
  );
}
