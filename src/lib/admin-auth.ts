import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "yoonseul_admin_session";
const SESSION_TTL_SEC = 60 * 60 * 12; // 12 hours

/**
 * 세션 서명용 비밀키 조회
 */
const getSecret = (): string =>
  process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-me";

/**
 * 문자열을 Base64URL로 인코딩
 */
const toBase64Url = (value: string): string =>
  Buffer.from(value).toString("base64url");

/**
 * 페이로드에 대해 HMAC-SHA256 서명 생성
 */
const sign = (payload: string): string =>
  createHmac("sha256", getSecret()).update(payload).digest("base64url");

/**
 * JWT 토큰 파싱 및 검증
 */
const parseToken = (token: string): { exp: number; role: "admin" } | null => {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  // 타이밍 안전 비교로 timing attack 방지
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8"),
    ) as {
      exp: number;
      role: "admin";
    };

    // 만료 시간 확인
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

/**
 * 관리자 비밀번호 검증
 */
export const verifyAdminPassword = (password: string): boolean => {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return password === "admin1234";
  }
  return password === configured;
};

/**
 * 새로운 세션 토큰 생성
 */
export const createSessionToken = (): string => {
  const payload = {
    role: "admin" as const,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SEC,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
};

/**
 * 현재 관리자 세션 조회
 */
export const getAdminSession = async (): Promise<{
  exp: number;
  role: "admin";
} | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return parseToken(token);
};

/**
 * 세션 쿠키 옵션
 */
export const sessionCookieOptions = {
  name: COOKIE_NAME,
  maxAge: SESSION_TTL_SEC,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;
