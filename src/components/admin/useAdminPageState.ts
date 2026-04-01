import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { groupItemsByDate } from "@/lib/calendar";
import type { ScheduleItem } from "@/types/schedule";
import type { Draft } from "./SlotForm";
import {
  deleteScheduleById,
  fetchScheduleItems,
  saveScheduleDraft,
} from "./adminApi";
import useAdminAuth from "./useAdminAuth";
import useToastState from "./useToastState";

const makeDraft = (date: string): Draft => ({
  date,
  time: "00:00",
  guestName: "",
  status: "available",
  note: "",
});

const useAdminPageState = () => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [draft, setDraft] = useState<Draft>(() => makeDraft(""));
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hasLoadedItems, setHasLoadedItems] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { toast, showToast } = useToastState();
  const {
    isLoading,
    authenticated,
    password,
    setPassword,
    tryLogin,
    handleLogout: logout,
  } = useAdminAuth();

  useEffect(() => {
    if (!authenticated || hasLoadedItems) {
      return;
    }

    const fetchOnce = async () => {
      const loaded = await fetchScheduleItems();
      if (loaded) {
        setItems(loaded);
      }
      setHasLoadedItems(true);
    };

    void fetchOnce();
  }, [authenticated, hasLoadedItems]);

  const grouped = useMemo(() => groupItemsByDate(items), [items]);
  const registeredDates = useMemo(() => Object.keys(grouped), [grouped]);
  const selectedItems = useMemo(
    () => (selectedDate ? (grouped[selectedDate] ?? []) : []),
    [grouped, selectedDate],
  );

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const ok = await tryLogin();
      if (!ok) {
        showToast("로그인에 실패했습니다.", "error");
        return;
      }
      showToast("로그인 되었습니다.");
    },
    [showToast, tryLogin],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setDraft(makeDraft(selectedDate ?? ""));
    showToast("로그아웃 되었습니다.");
  }, [logout, selectedDate, showToast]);

  const handleDraftChange = useCallback(
    (next: Draft) => {
      if (next.date !== draft.date) {
        setSelectedDate(next.date ? next.date : null);
      }
      setDraft(next);
    },
    [draft.date],
  );

  const submitDraft = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!draft.date) {
        showToast("달력에서 날짜를 먼저 선택해주세요.", "error");
        return;
      }
      setSaving(true);
      const saved = await saveScheduleDraft(draft);
      setSaving(false);
      if (!saved) {
        showToast("저장 실패: 로그인 상태나 입력값을 확인해주세요.", "error");
        return;
      }
      setItems(saved);
      setHasLoadedItems(true);
      setSelectedDate(draft.date);
      setDraft(makeDraft(draft.date));
      showToast(draft.id ? "수정 완료" : "등록 완료");
    },
    [draft, showToast],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      const deleted = await deleteScheduleById(id);
      if (!deleted) {
        showToast("삭제 실패: 관리자 로그인 상태를 확인해주세요.", "error");
        return;
      }
      setItems(deleted);
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

  const handleReset = useCallback(() => {
    setDraft(makeDraft(selectedDate ?? ""));
  }, [selectedDate]);

  return {
    isLoading,
    authenticated,
    password,
    setPassword,
    draft,
    saving,
    selectedDate,
    registeredDates,
    selectedItems,
    deleteTargetId,
    toast,
    handleLogin,
    handleLogout,
    handleDraftChange,
    submitDraft,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDelete,
    handleEdit,
    handleReset,
  };
};

export default useAdminPageState;
