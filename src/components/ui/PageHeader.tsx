interface PageHeaderProps {
  title: string;
  description?: string;
}

/**
 * 페이지 상단 헤더 카드.
 */
const PageHeader = ({ title, description }: PageHeaderProps) => (
  <header className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
    <h1 className="text-xl font-bold">{title}</h1>
    {description && <p className="mt-2 text-sm text-zinc-600">{description}</p>}
  </header>
);

export default PageHeader;
