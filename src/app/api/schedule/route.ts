import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getScheduleItems, saveScheduleItems } from "@/lib/schedule-store";
import type { ReservationStatus, ScheduleItem } from "@/types/schedule";

const isValidStatus = (status: string): status is ReservationStatus => {
  return ["available", "pending", "booked"].includes(status);
};

const unauthorized = () =>
  NextResponse.json(
    { message: "관리자 로그인 후 이용 가능합니다." },
    { status: 401 },
  );

export async function GET() {
  const items = await getScheduleItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const body = (await request.json()) as Partial<ScheduleItem>;
  if (
    !body.date ||
    !body.time ||
    !body.guestName ||
    !body.status ||
    !isValidStatus(body.status)
  ) {
    return NextResponse.json(
      { message: "필수 값이 누락되었습니다." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const newItem: ScheduleItem = {
    id: randomUUID(),
    date: body.date,
    time: body.time,
    guestName: body.guestName,
    status: body.status,
    note: body.note ?? "",
    createdAt: now,
    updatedAt: now,
  };

  const items = await getScheduleItems();
  const saved = await saveScheduleItems([...items, newItem]);
  return NextResponse.json(saved);
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const body = (await request.json()) as Partial<ScheduleItem>;
  if (!body.id) {
    return NextResponse.json(
      { message: "수정할 ID가 필요합니다." },
      { status: 400 },
    );
  }

  const items = await getScheduleItems();
  const target = items.find((item) => item.id === body.id);

  if (!target) {
    return NextResponse.json(
      { message: "대상을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  if (body.status && !isValidStatus(body.status)) {
    return NextResponse.json(
      { message: "상태 값이 유효하지 않습니다." },
      { status: 400 },
    );
  }

  const updated = items.map((item) => {
    if (item.id !== body.id) {
      return item;
    }

    return {
      ...item,
      date: body.date ?? item.date,
      time: body.time ?? item.time,
      guestName: body.guestName ?? item.guestName,
      status: body.status ?? item.status,
      note: body.note ?? item.note,
      updatedAt: new Date().toISOString(),
    };
  });

  const saved = await saveScheduleItems(updated);
  return NextResponse.json(saved);
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json(
      { message: "삭제할 ID가 필요합니다." },
      { status: 400 },
    );
  }

  const items = await getScheduleItems();
  const filtered = items.filter((item) => item.id !== body.id);
  const saved = await saveScheduleItems(filtered);
  return NextResponse.json(saved);
}
