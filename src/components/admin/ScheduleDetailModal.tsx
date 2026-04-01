import { memo, useEffect } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ScheduleItem } from "@/types/schedule";

interface ScheduleDetailModalProps {
  item: ScheduleItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

/**
 * 예약 내역을 상세히 보여주는 모달
 */
const ScheduleDetailModal = memo(
  ({ item, isOpen, onClose, onEdit, onDelete }: ScheduleDetailModalProps) => {
    // ESC 키로 모달 닫기
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
      }
    }, [isOpen, onClose]);

    if (!isOpen || !item) {
      return null;
    }

    const handleBackdropClick = (
      e: React.MouseEvent<HTMLDivElement>
    ) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const handleEdit = () => {
      onEdit(item);
      onClose();
    };

    const handleDelete = () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        onDelete(item.id);
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold">예약 상세 정보</h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-700 text-xl leading-none"
              aria-label="모달 닫기"
            >
              ✕
            </button>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-3">
            {/* 시간 */}
            <div className="border-b border-zinc-200 pb-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase">
                시간
              </p>
              <p className="text-base font-semibold mt-1">{item.time}</p>
            </div>

            {/* 손님 이름 */}
            <div className="border-b border-zinc-200 pb-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase">
                손님 이름
              </p>
              <p className="text-base mt-1">{item.guestName}</p>
            </div>

            {/* 상태 */}
            <div className="border-b border-zinc-200 pb-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase">
                상태
              </p>
              <div className="mt-1">
                <StatusBadge status={item.status} variant="full" />
              </div>
            </div>

            {/* 메모 */}
            {item.note && (
              <div className="border-b border-zinc-200 pb-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase">
                  메모
                </p>
                <p className="text-sm mt-2 text-zinc-700 whitespace-pre-wrap break-words">
                  {item.note}
                </p>
              </div>
            )}

            {/* 생성/수정 시간 */}
            <div className="pt-2">
              <p className="text-xs text-zinc-400">
                생성: {new Date(item.createdAt).toLocaleString("ko-KR")}
              </p>
              {item.updatedAt && item.updatedAt !== item.createdAt && (
                <p className="text-xs text-zinc-400 mt-1">
                  수정: {new Date(item.updatedAt).toLocaleString("ko-KR")}
                </p>
              )}
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 transition-colors"
            >
              삭제
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-sm font-medium py-2 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ScheduleDetailModal.displayName = "ScheduleDetailModal";

export default ScheduleDetailModal;
