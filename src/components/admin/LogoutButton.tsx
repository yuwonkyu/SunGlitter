interface LogoutButtonProps {
  onClick: () => void;
}

/**
 * 관리자 로그아웃 버튼.
 */
const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md border border-zinc-500 bg-zinc-100 px-3 py-2 text-sm"
      type="button"
      aria-label="로그아웃"
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;
