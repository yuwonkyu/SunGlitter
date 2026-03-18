import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getScheduleItems, saveScheduleItems } from "@/lib/schedule-store";
import {
  jsonError,
  notFound,
  unauthorized,
  validateItemId,
  validateNewScheduleItem,
  validateScheduleItemUpdate,
} from "@/lib/api-helpers";
import type { ScheduleItem } from "@/types/schedule";

export const GET = async () => {
  const items = await getScheduleItems();
  return NextResponse.json(items);
};

export const POST = async (request: Request) => {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const body = (await request.json()) as Partial<ScheduleItem>;
  const validation = validateNewScheduleItem(body);

  if (!validation.valid) {
    return jsonError(validation.errors.join(" "), 400);
  }

  const now = new Date().toISOString();
  const newItem: ScheduleItem = {
    id: randomUUID(),
    date: body.date!,
    time: body.time!,
    guestName: body.guestName!,
    status: body.status!,
    note: body.note ?? "",
    createdAt: now,
    updatedAt: now,
  };

  const items = await getScheduleItems();
  const saved = await saveScheduleItems([...items, newItem]);
  return NextResponse.json(saved);
};

export const PUT = async (request: Request) => {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const body = (await request.json()) as Partial<ScheduleItem>;

  if (!validateItemId(body.id)) {
    return jsonError("수정할 ID가 필요합니다.", 400);
  }

  const items = await getScheduleItems();
  const target = items.find((item) => item.id === body.id);

  if (!target) {
    return notFound();
  }

  const validation = validateScheduleItemUpdate(body);
  if (!validation.valid) {
    return jsonError(validation.errors.join(" "), 400);
  }

  const updated = items.map((item) =>
    item.id !== body.id
      ? item
      : {
          ...item,
          date: body.date ?? item.date,
          time: body.time ?? item.time,
          guestName: body.guestName ?? item.guestName,
          status: body.status ?? item.status,
          note: body.note ?? item.note,
          updatedAt: new Date().toISOString(),
        },
  );

  const saved = await saveScheduleItems(updated);
  return NextResponse.json(saved);
};

export const DELETE = async (request: Request) => {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const body = (await request.json()) as { id?: string };

  if (!validateItemId(body.id)) {
    return jsonError("삭제할 ID가 필요합니다.", 400);
  }

  const items = await getScheduleItems();
  const filtered = items.filter((item) => item.id !== body.id);
  const saved = await saveScheduleItems(filtered);
  return NextResponse.json(saved);
};
