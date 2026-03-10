import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "yoonseul_admin_session";
const SESSION_TTL_SEC = 60 * 60 * 12;

const getSecret = () =>
  process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-me";

const toBase64Url = (value: string) => Buffer.from(value).toString("base64url");

const sign = (payload: string) =>
  createHmac("sha256", getSecret()).update(payload).digest("base64url");

const parseToken = (token: string) => {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8"),
    ) as {
      exp: number;
      role: "admin";
    };

    if (
      payload.role !== "admin" ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const verifyAdminPassword = (password: string) => {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return password === "admin1234";
  }
  return password === configured;
};

export const createSessionToken = () => {
  const payload = {
    role: "admin" as const,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SEC,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
};

export const getAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return parseToken(token);
};

export const sessionCookieOptions = {
  name: COOKIE_NAME,
  maxAge: SESSION_TTL_SEC,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
