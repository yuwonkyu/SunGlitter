import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminSession,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { jsonError } from "@/lib/api-helpers";

export const GET = async () => {
  const session = await getAdminSession();
  return NextResponse.json({ authenticated: Boolean(session) });
};

export const POST = async (request: Request) => {
  const body = (await request.json()) as { password?: string };

  if (!body.password || !verifyAdminPassword(body.password)) {
    return jsonError("비밀번호가 올바르지 않습니다.", 401);
  }

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieOptions.name, token, sessionCookieOptions);

  return NextResponse.json({ ok: true });
};
