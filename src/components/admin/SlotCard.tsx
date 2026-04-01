import { memo } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ScheduleItem } from "@/types/schedule";

interface SlotCardProps {
  item: ScheduleItem;
  onView: (item: ScheduleItem) => void;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

/**
 * 관리자 페이지에서 예약 슬롯 하나를 표시하는 카드. 수정/삭제 버튼 포함.
 * 클릭하면 상세 정보 모달을 열 수 있습니다.
 */
const SlotCard = memo(({ item, onView, onEdit, onDelete }: SlotCardProps) => (
  <article
    onClick={() => onView(item)}
    className="cursor-pointer rounded-lg border border-zinc-300 bg-white p-3 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">{item.time}</p>
        <p className="mt-1 text-sm text-zinc-700">{item.guestName}</p>
      </div>
      <StatusBadge status={item.status} variant="full" />
    </div>

    {item.note ? (
      <p className="mt-2 text-xs text-zinc-500 line-clamp-1">{item.note}</p>
    ) : null}

    <div className="mt-3 flex gap-3 text-xs">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(item);
        }}
        className="underline"
        type="button"
        aria-label="예약 슬롯 수정"
      >
        수정
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="underline text-zinc-700"
        type="button"
        aria-label="예약 슬롯 삭제"
      >
        삭제
      </button>
    </div>
  </article>
));

SlotCard.displayName = "SlotCard";

export default SlotCard;
