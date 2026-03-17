import Link from "next/link";

interface BackLinkProps {
  href?: string;
  label?: string;
  className?: string;
}

/**
 * "홈으로 돌아가기" 같은 뒤로가기 텍스트 링크.
 */
const BackLink = ({
  href = "/",
  label = "홈으로 돌아가기",
  className = "",
}: BackLinkProps) => {
  return (
    <div className={`text-center text-sm ${className}`}>
      <Link href={href} className="underline underline-offset-4 text-zinc-700">
        {label}
      </Link>
    </div>
  );
};

export default BackLink;
