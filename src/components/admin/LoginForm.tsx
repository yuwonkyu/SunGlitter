import type { FormEvent } from "react";

interface LoginFormProps {
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * 관리자 비밀번호 로그인 폼.
 */
const LoginForm = ({
  password,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => (
  <form
    onSubmit={onSubmit}
    className="space-y-3 rounded-xl border border-zinc-300 bg-zinc-50 p-4"
  >
    <label className="block text-sm font-medium">관리자 비밀번호</label>
    <input
      type="password"
      value={password}
      onChange={(e) => onPasswordChange(e.target.value)}
      className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
      placeholder="비밀번호 입력"
      required
      aria-label="관리자 비밀번호"
    />
    <button
      type="submit"
      className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white"
    >
      로그인
    </button>
  </form>
);

export default LoginForm;
