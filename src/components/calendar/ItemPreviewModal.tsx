import { memo } from "react";
import { maskName } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

interface ItemPreviewModalProps {
  item: ScheduleItem | null;
  onClose: () => void;
}

/**
 * 예약 내역 미리보기 모달 컴포넌트
 */
const ItemPreviewModal = memo(({ item, onClose }: ItemPreviewModalProps) => {
  if (!item) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="예약 내역 미리보기"
    >
      <div
        className="w-full max-w-xs rounded-xl border border-zinc-300 bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">예약 내역</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <span className="mr-2 text-zinc-500">예약자</span>
            <span className="font-medium text-zinc-900">
              {maskName(item.guestName)}
            </span>
          </p>
          <p>
            <span className="mr-2 text-zinc-500">예약시간</span>
            <span className="font-medium text-zinc-900">{item.time}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

ItemPreviewModal.displayName = "ItemPreviewModal";

export default ItemPreviewModal;
