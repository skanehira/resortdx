import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { UnifiedTask, ShuttleStatus, ShuttleMessageType } from "../../../types";
import { SHUTTLE_STATUS_LABELS } from "../../../types";
import { LocationIcon, UserIcon, ArrowRightIcon, CarIcon, MessageIcon } from "../../ui/Icons";
import { TaskCardBase } from "./TaskCardBase";
import { ShuttleMessagePanel } from "../../shuttle/ShuttleMessagePanel";
import { ShuttleQuickMessages } from "../../shuttle/ShuttleQuickMessages";
import { MemoSection, MemoDisplay } from "../../shared/MemoSection";

// 送迎ステータスの進捗表示（5段階）
const ShuttleProgressIndicator = ({ status }: { status: ShuttleStatus }) => {
  const stages: ShuttleStatus[] = ["not_departed", "heading", "arrived", "boarded", "completed"];
  const currentIndex = stages.indexOf(status);

  return (
    <div className="flex items-center gap-0.5">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
              ${
                index <= currentIndex
                  ? "bg-[var(--aotake)] text-white"
                  : "bg-[var(--nezumi)]/20 text-[var(--nezumi)]"
              }`}
          >
            {index + 1}
          </div>
          {index < stages.length - 1 && (
            <div
              className={`w-4 h-0.5 ${
                index < currentIndex ? "bg-[var(--aotake)]" : "bg-[var(--nezumi)]/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

type MemoType = "personal" | "shared";

interface ShuttleCardProps {
  task: UnifiedTask;
  currentStaffId: string;
  currentStaffName: string;
  onStatusChange: (taskId: string, newStatus: UnifiedTask["status"]) => void;
  onShuttleStatusChange?: (taskId: string, newShuttleStatus: ShuttleStatus) => void;
  onSendShuttleMessage?: (taskId: string, content: string, messageType: ShuttleMessageType) => void;
  onMemoChange?: (taskId: string, memoType: MemoType, value: string | null) => void;
}

export const ShuttleCard = ({
  task,
  currentStaffId,
  currentStaffName,
  onStatusChange,
  onShuttleStatusChange,
  onSendShuttleMessage,
  onMemoChange,
}: ShuttleCardProps) => {
  const { t } = useTranslation("staff");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const shuttle = task.shuttle;

  // 完了時にアコーディオンを閉じる
  useEffect(() => {
    if (task.status === "completed") {
      setIsExpanded(false);
    }
  }, [task.status]);

  if (!shuttle) return null;

  const handleProgressShuttleStatus = () => {
    if (!onShuttleStatusChange) return;
    const nextStatus: Record<ShuttleStatus, ShuttleStatus> = {
      not_departed: "heading",
      heading: "arrived",
      arrived: "boarded",
      boarded: "completed",
      completed: "completed",
    };
    const next = nextStatus[shuttle.shuttleStatus];
    onShuttleStatusChange(task.id, next);

    // 完了時は統合ステータスも更新
    if (next === "completed") {
      onStatusChange(task.id, "completed");
    }
  };

  const getActionButtonLabel = (): string => {
    switch (shuttle.shuttleStatus) {
      case "not_departed":
        return "出発";
      case "heading":
        return "到着";
      case "arrived":
        return "乗車確認";
      case "boarded":
        return "送迎完了";
      default:
        return "";
    }
  };

  return (
    <TaskCardBase
      task={task}
      onStatusChange={onStatusChange}
      onExpand={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <div className="space-y-4">
        {/* Guest info */}
        <div className="flex items-center gap-3 p-3 bg-[var(--shironeri-warm)] rounded-lg">
          <UserIcon size={20} className="text-[var(--nezumi)]" />
          <div>
            <p className="font-medium text-[var(--sumi)]">{shuttle.guestName}様</p>
            <p className="text-xs text-[var(--nezumi)]">{shuttle.numberOfGuests}名様</p>
          </div>
        </div>

        {/* Route info */}
        <div className="flex items-center gap-2 p-3 bg-[var(--aotake)]/10 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <LocationIcon size={16} className="text-[var(--aotake)]" />
              <span className="text-sm font-medium text-[var(--sumi)]">
                {shuttle.pickupLocation}
              </span>
            </div>
          </div>
          <ArrowRightIcon size={20} className="text-[var(--aotake)]" />
          <div className="flex-1 text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-medium text-[var(--sumi)]">
                {shuttle.dropoffLocation}
              </span>
              <LocationIcon size={16} className="text-[var(--aotake)]" />
            </div>
          </div>
        </div>

        {/* Vehicle info */}
        {shuttle.assignedVehicleId && (
          <div className="flex items-center gap-3 p-3 bg-[var(--shironeri-warm)] rounded-lg">
            <CarIcon size={20} className="text-[var(--nezumi)]" />
            <div>
              <p className="text-sm text-[var(--sumi)]">車両ID: {shuttle.assignedVehicleId}</p>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <ShuttleProgressIndicator status={shuttle.shuttleStatus} />
          <span className="text-sm text-[var(--nezumi)]">
            {SHUTTLE_STATUS_LABELS[shuttle.shuttleStatus]}
          </span>
        </div>

        {/* Guest arrival notification */}
        {shuttle.guestArrivalNotified && (
          <div className="p-3 bg-[var(--ai)]/10 border border-[var(--ai)]/30 rounded-lg">
            <p className="text-sm text-[var(--ai)] font-medium">ゲストに通知済み</p>
          </div>
        )}

        {/* Messaging Section */}
        {shuttle.shuttleStatus !== "completed" && (
          <div className="space-y-3">
            {/* Toggle messages button */}
            <button
              onClick={() => setShowMessages(!showMessages)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                showMessages
                  ? "bg-[var(--ai)]/10 text-[var(--ai)]"
                  : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageIcon size={18} />
                <span className="font-medium">ゲストとメッセージ</span>
              </div>
              {shuttle.hasUnreadStaffMessages && (
                <span className="w-2.5 h-2.5 bg-[var(--shu)] rounded-full" />
              )}
              <span className="text-sm">{shuttle.messages?.length || 0}件</span>
            </button>

            {/* Messages panel */}
            {showMessages && (
              <div className="space-y-3 animate-fade-in">
                {/* Quick messages */}
                <ShuttleQuickMessages
                  userType="staff"
                  onSendQuickMessage={(content, messageType) =>
                    onSendShuttleMessage?.(task.id, content, messageType)
                  }
                />

                {/* Message panel */}
                <ShuttleMessagePanel
                  messages={shuttle.messages || []}
                  currentSenderType="staff"
                  currentSenderId={currentStaffId}
                  currentSenderName={currentStaffName}
                  onSendMessage={(content, messageType) =>
                    onSendShuttleMessage?.(task.id, content, messageType)
                  }
                  maxHeight="180px"
                />
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        {shuttle.shuttleStatus !== "completed" && (
          <button
            onClick={handleProgressShuttleStatus}
            className="w-full py-3 bg-[var(--aotake)] text-white rounded-lg font-medium"
          >
            {getActionButtonLabel()}
          </button>
        )}

        {/* Memo Section */}
        <div className="mt-4 space-y-3">
          {/* Admin Memo (read-only) */}
          <MemoDisplay title={t("memo.fromAdmin")} value={task.adminMemo} variant="admin" />

          {/* Shared Memo (read-only) */}
          <MemoDisplay title={t("memo.sharedMemo")} value={task.sharedMemo} variant="shared" />

          {/* Personal Memo (editable) */}
          <MemoSection
            title={t("memo.personalMemo")}
            value={task.personalMemo}
            onSave={(value) => onMemoChange?.(task.id, "personal", value)}
            placeholder={t("memo.placeholder")}
            editable={true}
            variant="personal"
          />
        </div>
      </div>
    </TaskCardBase>
  );
};
