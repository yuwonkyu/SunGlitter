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
      className="text-sm text-zinc-700 underline underline-offset-4 transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none"
      type="button"
      aria-label="로그아웃"
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;
