import SlotCard from "@/components/admin/SlotCard";
import type { ScheduleItem } from "@/types/schedule";

interface SlotListSectionProps {
  selectedDate: string | null;
  selectedItems: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

/**
 * 관리자 페이지의 날짜별 슬롯 목록 섹션.
 */
const SlotListSection = ({
  selectedDate,
  selectedItems,
  onEdit,
  onDelete,
}: SlotListSectionProps) => {

  const slotCountLabel = selectedDate ? selectedItems.length : "-";

  return (
    <section className="space-y-3 rounded-xl border border-zinc-300 bg-zinc-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            {selectedDate ? `${selectedDate} 슬롯 목록` : "슬롯 목록"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            예약 슬롯 등록에서 날짜를 선택하면 해당 날짜의 슬롯 목록이
            표시됩니다.
          </p>
        </div>
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-600">
          총 {slotCountLabel}건
        </span>
      </div>

      {!selectedDate ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600">
          날짜를 먼저 선택해 주세요. 선택 전에는 슬롯 목록을 조회하지 않습니다.
        </p>
      ) : selectedItems.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600">
          아직 등록된 슬롯이 없습니다.
        </p>
      ) : (
        selectedItems.map((item) => (
          <SlotCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </section>
  );
};

export default SlotListSection;
