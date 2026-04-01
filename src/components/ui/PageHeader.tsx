import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * 페이지 상단 헤더 카드.
 */
const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <header className="flex items-start justify-between gap-4 p-5">
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      {description && <p className="mt-2 text-sm text-zinc-600">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-4 text-sm">{actions}</div>}
  </header>
);

export default PageHeader;
