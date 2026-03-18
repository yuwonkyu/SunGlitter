export type StatusToastTone = "success" | "error";

interface StatusToastProps {
  text: string;
  tone: StatusToastTone;
}

/**
 * 하단 상태 토스트 메시지.
 */
const StatusToast = ({ text, tone }: StatusToastProps) => {
  return (
    <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div
        className={`w-full max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
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
