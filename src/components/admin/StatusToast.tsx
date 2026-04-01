export type StatusToastTone = "success" | "error";

interface StatusToastProps {
  text: string;
  tone: StatusToastTone;
}

/**
 * 우측 상단 상태 토스트 메시지.
 */
const StatusToast = ({ text, tone }: StatusToastProps) => {
  return (
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm sm:right-5 sm:top-5">
      <div
        className={`w-full rounded-lg border px-4 py-3 text-sm shadow-lg ${
          tone === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
        role="status"
        aria-live="polite"
      >
        {text}
      </div>
    </div>
  );
};

export default StatusToast;
