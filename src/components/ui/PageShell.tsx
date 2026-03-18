import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

/**
 * 모든 페이지에 공통으로 쓰이는 배경·레이아웃 래퍼.
 */
const PageShell = ({ children }: PageShellProps) => (
  <div className="paper-bg min-h-screen px-5 py-8">
    <main className="mx-auto w-full max-w-md space-y-4">{children}</main>
  </div>
);

export default PageShell;
