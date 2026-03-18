interface DeleteConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 슬롯 삭제 2차 확인 다이얼로그.
 */
const DeleteConfirmDialog = ({
  open,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-300 bg-white p-4 shadow-xl">
        <p className="text-sm font-semibold text-zinc-900">
          이 슬롯을 삭제하시겠습니까?
        </p>
        <p className="mt-1 text-xs text-zinc-600">
          삭제 후에는 되돌릴 수 없습니다.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-400 px-3 py-2 text-sm text-zinc-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
