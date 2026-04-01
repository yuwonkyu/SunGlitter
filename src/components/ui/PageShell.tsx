import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  containerClassName?: string;
  mainClassName?: string;
}

/**
 * 모든 페이지에 공통으로 쓰이는 배경·레이아웃 래퍼.
 */
const PageShell = ({
  children,
  containerClassName = "",
  mainClassName = "",
}: PageShellProps) => (
  <div className={`paper-bg min-h-screen px-5 py-8 ${containerClassName}`}>
    <main className={`mx-auto w-full max-w-md space-y-4 ${mainClassName}`}>
      {children}
    </main>
  </div>
);

export default PageShell;
