"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { groupItemsByDate } from "@/lib/calendar";
import type { ScheduleItem } from "@/types/schedule";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import BackLink from "@/components/ui/BackLink";
import LoginForm from "@/components/admin/LoginForm";
import LogoutButton from "@/components/admin/LogoutButton";
import SlotForm, { type Draft } from "@/components/admin/SlotForm";
import SlotListSection from "@/components/admin/SlotListSection";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import StatusToast, {
  type StatusToastTone,
} from "@/components/admin/StatusToast";

type ToastState = {
  text: string;
  tone: StatusToastTone;
};

const TOAST_DURATION_MS = 2500;
const ADMIN_LOGIN_API = "/api/admin/login";
const ADMIN_LOGOUT_API = "/api/admin/logout";
const SCHEDULE_API = "/api/schedule";

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
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<Draft>(() => makeDraft(""));
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hasLoadedItems, setHasLoadedItems] = useState(false);
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
    }, TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [toast]);

  // 예약 목록 조회
  const fetchScheduleItems = useCallback(async () => {
    try {
      const res = await fetch(SCHEDULE_API, { cache: "no-store" });
      if (res.ok) setItems((await res.json()) as ScheduleItem[]);
    } catch (error) {
      console.error("Failed to load schedule items", error);
    }
  }, []);

  // 초기 진입 시에는 인증 상태만 확인 (예약 목록은 아직 조회하지 않음)
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const authRes = await fetch(ADMIN_LOGIN_API, { cache: "no-store" });
        if (authRes.ok) {
          const result = (await authRes.json()) as { authenticated: boolean };
          setAuthenticated(result.authenticated);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  // 날짜를 처음 선택한 시점에만 예약 목록 1회 조회
  useEffect(() => {
    if (!selectedDate || hasLoadedItems) {
      return;
    }

    const fetchOnce = async () => {
      await fetchScheduleItems();
      setHasLoadedItems(true);
    };

    void fetchOnce();
  }, [selectedDate, hasLoadedItems, fetchScheduleItems]);

  // 날짜별 그룹화 및 선택된 날짜의 아이템
  const grouped = useMemo(() => groupItemsByDate(items), [items]);
  const selectedItems = useMemo(
    () => (selectedDate ? (grouped[selectedDate] ?? []) : []),
    [grouped, selectedDate],
  );

  // 로그인
  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const res = await fetch(ADMIN_LOGIN_API, {
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
    await fetch(ADMIN_LOGOUT_API, { method: "POST" });
    setAuthenticated(false);
    setDraft(makeDraft(selectedDate ?? ""));
    showToast("로그아웃 되었습니다.");
  }, [selectedDate, showToast]);

  // 드래프트 변경
  const handleDraftChange = useCallback(
    (next: Draft) => {
      if (next.date !== draft.date) {
        setSelectedDate(next.date ? next.date : null);
      }
      setDraft(next);
    },
    [draft.date],
  );

  // 슬롯 등록/수정 제출
  const submitDraft = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      const res = await fetch(SCHEDULE_API, {
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
      setHasLoadedItems(true);
      setSelectedDate(draft.date);
      setDraft(makeDraft(draft.date));
      showToast(draft.id ? "수정 완료" : "등록 완료");
    },
    [draft, showToast],
  );

  // 슬롯 삭제
  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      const res = await fetch(SCHEDULE_API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        showToast("삭제 실패: 관리자 로그인 상태를 확인해주세요.", "error");
        return;
      }
      setItems((await res.json()) as ScheduleItem[]);
      setHasLoadedItems(true);
      if (draft.id === id) {
        setDraft(makeDraft(selectedDate ?? ""));
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
    setSelectedDate(item.date);
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
    setDraft(makeDraft(selectedDate ?? ""));
  }, [selectedDate]);

  if (isLoading) {
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
          <LogoutButton onClick={() => void handleLogout()} />
        </>
      )}

      <SlotListSection
        selectedDate={selectedDate}
        selectedItems={selectedItems}
        onEdit={handleEdit}
        onDelete={openDeleteConfirm}
      />

      <BackLink className="pt-3" />

      <DeleteConfirmDialog
        open={Boolean(deleteTargetId)}
        onCancel={closeDeleteConfirm}
        onConfirm={() => void handleDelete()}
      />

      {toast ? <StatusToast text={toast.text} tone={toast.tone} /> : null}
    </PageShell>
  );
};

export default AdminPage;
