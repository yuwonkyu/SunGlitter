import { NextResponse } from "next/server";
import type { ReservationStatus, ScheduleItem } from "@/types/schedule";

/**
 * API 에러 응답 타입
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * API 응답 부분적 아이템 검증 결과
 */
export interface ValidationResult<T> {
  valid: boolean;
  errors: string[];
  data?: T;
}

/**
 * 표준 에러 응답 생성
 */
export const jsonError = (message: string, status: number = 400): Response => {
  return NextResponse.json({ message }, { status });
};

/**
 * 401 Unauthorized 응답 (관리자 인증 필요)
 */
export const unauthorized = (): Response =>
  jsonError("관리자 로그인 후 이용 가능합니다.", 401);

/**
 * 404 Not Found 응답
 */
export const notFound = (
  message: string = "대상을 찾을 수 없습니다.",
): Response => jsonError(message, 404);

/**
 * 예약 상태 검증
 */
export const isValidStatus = (status: unknown): status is ReservationStatus => {
  return (
    typeof status === "string" &&
    ["available", "pending", "booked"].includes(status)
  );
};

/**
 * 예약 시간 형식 검증 (HH:00, HH:30 형식)
 */
export const isValidHalfHourTime = (time: unknown): time is string => {
  return typeof time === "string" && /^([01]\d|2[0-3]):(00|30)$/.test(time);
};

/**
 * 날짜 형식 검증 (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: unknown): date is string => {
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/**
 * 필수 필드 검증
 */
export const validateRequiredFields = (
  data: Record<string, unknown>,
  fields: string[],
): ValidationResult<Record<string, unknown>> => {
  const errors: string[] = [];

  fields.forEach((field) => {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      errors.push(`${field} 필드는 필수입니다.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined,
  };
};

/**
 * 예약 아이템 부분 검증
 */
export const validateScheduleItemUpdate = (
  body: Partial<ScheduleItem>,
): ValidationResult<Partial<ScheduleItem>> => {
  const errors: string[] = [];

  if (body.date && !isValidDateFormat(body.date)) {
    errors.push("날짜 형식이 올바르지 않습니다 (YYYY-MM-DD).");
  }

  if (body.time && !isValidHalfHourTime(body.time)) {
    errors.push(
      "예약 시간은 30분 단위로만 입력할 수 있습니다 (HH:00 또는 HH:30).",
    );
  }

  if (body.status && !isValidStatus(body.status)) {
    errors.push("상태 값이 유효하지 않습니다 (available, pending, booked).");
  }

  if (body.guestName !== undefined && typeof body.guestName !== "string") {
    errors.push("게스트 이름은 문자열이어야 합니다.");
  }

  if (body.note !== undefined && typeof body.note !== "string") {
    errors.push("메모는 문자열이어야 합니다.");
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? body : undefined,
  };
};

/**
 * 새 예약 아이템 생성 검증
 */
export const validateNewScheduleItem = (
  body: Partial<ScheduleItem>,
): ValidationResult<Partial<ScheduleItem>> => {
  // 필수 필드 검증
  const requiredValidation = validateRequiredFields(body, [
    "date",
    "time",
    "guestName",
    "status",
  ]);

  if (!requiredValidation.valid) {
    return requiredValidation;
  }

  // 형식 검증
  return validateScheduleItemUpdate(body);
};

/**
 * 예약 아이템 ID 검증
 */
export const validateItemId = (id: unknown): id is string => {
  return typeof id === "string" && id.length > 0;
};
