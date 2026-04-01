"use client";

import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import BackLink from "@/components/ui/BackLink";
import LoginForm from "@/components/admin/LoginForm";
import LogoutButton from "@/components/admin/LogoutButton";
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
      <div className="paper-bg min-h-screen p-6 text-sm">불러오는 중...</div>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="관리자 예약현황판"
        description="날짜와 시간을 직접 입력해 슬롯을 등록하고 상태를 변경합니다."
      />

      {!authenticated ? (
        <LoginForm
          password={password}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      ) : (
        <>
          <SlotForm
            draft={draft}
            saving={saving}
            registeredDateCounts={registeredDateCounts}
            onChange={handleDraftChange}
            onSubmit={submitDraft}
            onReset={handleReset}
          />
          <LogoutButton onClick={() => void handleLogout()} />
        </>
      )}

      <SlotListSection
        selectedDate={selectedDate}
        selectedItems={selectedItems}
        onEdit={handleEdit}
        onDelete={openDeleteConfirm}
      />

      <BackLink className="pt-3" />

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
