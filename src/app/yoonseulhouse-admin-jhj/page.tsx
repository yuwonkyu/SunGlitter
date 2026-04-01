"use client";

import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import BackLink from "@/components/ui/BackLink";
import LoginForm from "@/components/admin/LoginForm";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminCalendar from "@/components/admin/AdminCalendar";
import SlotForm from "@/components/admin/SlotForm";
import SlotListSection from "@/components/admin/SlotListSection";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import StatusToast from "@/components/admin/StatusToast";
import useAdminPageState from "@/components/admin/useAdminPageState";

const AdminPage = () => {
  const {
    isLoading,
    authenticated,
    password,
    setPassword,
    draft,
    saving,
    selectedDate,
    registeredDateCounts,
    selectedItems,
    deleteTargetId,
    toast,
    handleLogin,
    handleLogout,
    handleDraftChange,
    submitDraft,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDelete,
    handleEdit,
    handleReset,
  } = useAdminPageState();

  if (isLoading) {
    return (
      <div className="paper-bg min-h-screen p-6 text-sm text-center">형진이는 성공중...!</div>
    );
  }

  return (
    <PageShell mainClassName="max-w-md lg:max-w-full">
      <PageHeader
        title="관리자 예약현황판"
        description={!authenticated ? "날짜와 시간을 직접 입력해 슬롯을 등록하고 상태를 변경합니다." : undefined}
        actions={
          authenticated ? (
            <>
              <Link
                href="/"
                className="text-zinc-700 transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none"
              >
                홈으로 돌아가기
              </Link>
              <LogoutButton onClick={() => void handleLogout()} />
            </>
          ) : undefined
        }
      />

      {!authenticated ? (
        <LoginForm
          password={password}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr] lg:items-stretch">
          {/* 왼쪽: 캘린더 */}
          <div className="flex flex-col">
            <AdminCalendar
              selectedDate={selectedDate}
              registeredDateCounts={registeredDateCounts}
              onDateChange={(dateKey) =>
                handleDraftChange({ ...draft, date: dateKey })
              }
            />
          </div>

          {/* 중앙: 예약 등록 폼 */}
          <div className="flex flex-col lg:border-l lg:border-dashed lg:border-zinc-300 lg:pl-4 lg:min-w-0">
            <SlotForm
              draft={draft}
              saving={saving}
              onChange={handleDraftChange}
              onSubmit={submitDraft}
              onReset={handleReset}
            />
          </div>

          {/* 오른쪽: 예약 목록 */}
          <div className="flex flex-col lg:border-l lg:border-dashed lg:border-zinc-300 lg:pl-4 lg:sticky lg:top-6">
            <SlotListSection
              selectedDate={selectedDate}
              selectedItems={selectedItems}
              onEdit={handleEdit}
              onDelete={openDeleteConfirm}
            />
          </div>
        </div>
      )}

      {!authenticated && <BackLink className="pt-3" />}

      <DeleteConfirmDialog
        open={Boolean(deleteTargetId)}
        onCancel={closeDeleteConfirm}
        onConfirm={() => void handleDelete()}
      />

      {toast ? <StatusToast text={toast.text} tone={toast.tone} /> : null}
    </PageShell>
  );
};

export default AdminPage;
