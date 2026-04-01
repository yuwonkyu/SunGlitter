import type { ScheduleItem } from "@/types/schedule";
import type { Draft } from "./SlotForm";

const ADMIN_LOGIN_API = "/api/admin/login";
const ADMIN_LOGOUT_API = "/api/admin/logout";
const SCHEDULE_API = "/api/schedule";

export const checkAdminAuth = async (): Promise<boolean> => {
  const res = await fetch(ADMIN_LOGIN_API, { cache: "no-store" });
  if (!res.ok) {
    return false;
  }

  const result = (await res.json()) as { authenticated: boolean };
  return result.authenticated;
};

export const loginAdmin = async (password: string): Promise<boolean> => {
  const res = await fetch(ADMIN_LOGIN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  return res.ok;
};

export const logoutAdmin = async (): Promise<void> => {
  await fetch(ADMIN_LOGOUT_API, { method: "POST" });
};

export const fetchScheduleItems = async (): Promise<ScheduleItem[] | null> => {
  const res = await fetch(SCHEDULE_API, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }

  return (await res.json()) as ScheduleItem[];
};

export const saveScheduleDraft = async (
  draft: Draft,
): Promise<ScheduleItem[] | null> => {
  const res = await fetch(SCHEDULE_API, {
    method: draft.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as ScheduleItem[];
};

export const deleteScheduleById = async (
  id: string,
): Promise<ScheduleItem[] | null> => {
  const res = await fetch(SCHEDULE_API, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as ScheduleItem[];
};
