"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { groupItemsByDate, toDateKey } from "@/lib/calendar";
import type { ScheduleItem } from "@/types/schedule";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import BackLink from "@/components/ui/BackLink";
import LoginForm from "@/components/admin/LoginForm";
import SlotForm, { type Draft } from "@/components/admin/SlotForm";
import SlotCard from "@/components/admin/SlotCard";

/**
 * 선택된 날짜의 기본 드래프트 생성
 */
const makeDraft = (date: string): Draft => ({
  date,
  time: "00:00",
  guestName: "",
  status: "available",
  note: "",
});

const AdminPage = () => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<Draft>(() =>
    makeDraft(toDateKey(new Date())),
  );
  const [toast, setToast] = useState<{
    text: string;
    tone: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const showToast = useCallback(
    (text: string, tone: "success" | "error" = "success") => {
      setToast({ text, tone });
    },
    [],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/schedule", { cache: "no-store" });
      if (res.ok) setItems((await res.json()) as ScheduleItem[]);
    } catch (error) {
      console.error("Failed to load schedule items", error);
    }
  }, []);

  // 초기 로드 및 인증 상태 확인
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
  }, [loadData]);

  // 날짜별 그룹화 및 선택된 날짜의 아이템
  const grouped = useMemo(() => groupItemsByDate(items), [items]);
  const selectedItems = useMemo(
    () => grouped[selectedDate] ?? [],
    [grouped, selectedDate],
  );

  // 로그인
  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        showToast("로그인에 실패했습니다.", "error");
        return;
      }
      setAuthenticated(true);
      setPassword("");
      showToast("로그인 되었습니다.");
    },
    [password, showToast],
  );

  // 로그아웃
  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setDraft(makeDraft(selectedDate));
    showToast("로그아웃 되었습니다.");
  }, [selectedDate, showToast]);

  // 드래프트 변경
  const handleDraftChange = useCallback(
    (next: Draft) => {
      if (next.date !== draft.date) setSelectedDate(next.date);
      setDraft(next);
    },
    [draft.date],
  );

  // 슬롯 등록/수정 제출
  const submitDraft = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      const res = await fetch("/api/schedule", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      setSaving(false);
      if (!res.ok) {
        showToast("저장 실패: 로그인 상태나 입력값을 확인해주세요.", "error");
        return;
      }
      setItems((await res.json()) as ScheduleItem[]);
      setDraft(makeDraft(selectedDate));
      showToast(draft.id ? "수정 완료" : "등록 완료");
    },
    [draft, selectedDate, showToast],
  );

  // 슬롯 삭제
  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      const res = await fetch("/api/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        showToast("삭제 실패: 관리자 로그인 상태를 확인해주세요.", "error");
        return;
      }
      setItems((await res.json()) as ScheduleItem[]);
      if (draft.id === id) {
        setDraft(makeDraft(selectedDate));
      }
      showToast("삭제 완료");
    },
    [draft.id, selectedDate, showToast],
  );

  const openDeleteConfirm = useCallback((id: string) => {
    setDeleteTargetId(id);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTargetId) {
      return;
    }
    await handleDeleteConfirm(deleteTargetId);
    setDeleteTargetId(null);
  }, [deleteTargetId, handleDeleteConfirm]);

  // 슬롯 편집 시작
  const handleEdit = useCallback((item: ScheduleItem) => {
    setDraft({
      id: item.id,
      date: item.date,
      time: item.time,
      guestName: item.guestName,
      status: item.status,
      note: item.note ?? "",
    });
  }, []);

  // 폼 초기화
  const handleReset = useCallback(() => {
    setDraft(makeDraft(selectedDate));
  }, [selectedDate]);

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
            onReset={handleReset}
          />
          <button
            onClick={handleLogout}
            className="w-full rounded-md border border-zinc-500 bg-zinc-100 px-3 py-2 text-sm"
            type="button"
            aria-label="로그아웃"
          >
            로그아웃
          </button>
        </>
      )}

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
              onEdit={handleEdit}
              onDelete={openDeleteConfirm}
            />
          ))
        )}
      </section>

      <BackLink className="pt-3" />

      {deleteTargetId ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-sm rounded-xl border border-zinc-300 bg-white p-4 shadow-xl">
            <p className="text-sm font-semibold text-zinc-900">
              이 슬롯을 삭제하시겠습니까?
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              삭제 후에는 되돌릴 수 없습니다.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="rounded-md border border-zinc-400 px-3 py-2 text-sm text-zinc-700"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
          <div
            className={`w-full max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.tone === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.text}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
};

export default AdminPage;
