import Link from "next/link";

export interface LinkItem {
  title: string;
  subtitle: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

interface LinkCardProps {
  item: LinkItem;
  animationDelay?: number;
}

const BASE_CLASS =
  "card-in block rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_5px_14px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5";

/**
 * 홈 페이지의 링크 카드. disabled / external / internal 세 가지 형태를 지원합니다.
 */
const LinkCard = ({ item, animationDelay = 0 }: LinkCardProps) => {
  const style = { animationDelay: `${animationDelay}ms` } as const;

  const content = (
    <>
      <p className="text-sm font-semibold">{item.title}</p>
      <p className="mt-1 text-xs text-(--muted)">{item.subtitle}</p>
    </>
  );

  if (item.disabled) {
    return (
      <div
        className={`${BASE_CLASS} cursor-not-allowed opacity-70`}
        style={style}
      >
        {content}
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={BASE_CLASS}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={BASE_CLASS} style={style}>
      {content}
    </Link>
  );
};

export default LinkCard;
