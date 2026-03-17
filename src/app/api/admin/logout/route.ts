import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/admin-auth";

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieOptions.name, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
};
