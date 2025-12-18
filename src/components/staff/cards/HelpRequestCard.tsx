import { useState, useEffect } from "react";
import type { UnifiedTask } from "../../../types";
import { HELP_REQUEST_STATUS_LABELS } from "../../../types";
import { UserIcon, CheckIcon, ClockIcon } from "../../ui/Icons";
import { TaskCardBase } from "./TaskCardBase";

interface HelpRequestCardProps {
  task: UnifiedTask;
  currentStaffId: string;
  onStatusChange: (taskId: string, newStatus: UnifiedTask["status"]) => void;
  onAcceptHelp?: (taskId: string) => void;
  onCompleteHelp?: (taskId: string) => void;
  onCancelHelp?: (taskId: string) => void;
}

export const HelpRequestCard = ({
  task,
  currentStaffId,
  onStatusChange,
  onAcceptHelp,
  onCompleteHelp,
  onCancelHelp,
}: HelpRequestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const helpRequest = task.helpRequest;

  // 完了時にアコーディオンを閉じる
  useEffect(() => {
    if (task.status === "completed") {
      setIsExpanded(false);
    }
  }, [task.status]);

  if (!helpRequest) return null;

  const isRequester = helpRequest.requesterId === currentStaffId;
  const isAcceptor = helpRequest.acceptedBy === currentStaffId;
  const isPending = helpRequest.helpStatus === "pending";
  const isAccepted = helpRequest.helpStatus === "accepted";
  const isCompleted = helpRequest.helpStatus === "completed";
  const isCancelled = helpRequest.helpStatus === "cancelled";

  // 自分が対象者かどうか
  const isTargeted =
    helpRequest.targetStaffIds === "all" ||
    (Array.isArray(helpRequest.targetStaffIds) &&
      helpRequest.targetStaffIds.includes(currentStaffId));

  const canAccept = isPending && isTargeted && !isRequester;
  const canComplete = isAccepted && isAcceptor;
  const canCancel = isPending && isRequester;

  return (
    <TaskCardBase
      task={task}
      onStatusChange={onStatusChange}
      onExpand={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <div className="space-y-4">
        {/* Requester info */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
            {helpRequest.requesterName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[var(--sumi)]">{helpRequest.requesterName}さん</p>
            <p className="text-xs text-[var(--nezumi)]">
              {isRequester ? "あなたの依頼" : "からのヘルプ依頼"}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
          <p className="text-xs text-[var(--nezumi)] mb-1">依頼内容</p>
          <p className="text-sm text-[var(--sumi)]">{helpRequest.message}</p>
        </div>

        {/* Target info */}
        <div className="flex items-center gap-2 text-xs text-[var(--nezumi)]">
          <UserIcon size={14} />
          <span>
            {helpRequest.targetStaffIds === "all"
              ? "全スタッフ宛て"
              : `${Array.isArray(helpRequest.targetStaffIds) ? helpRequest.targetStaffIds.length : 0}名のスタッフ宛て`}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPending
                ? "bg-[var(--kincha)]/20 text-[var(--kincha)]"
                : isAccepted
                  ? "bg-[var(--ai)]/20 text-[var(--ai)]"
                  : isCompleted
                    ? "bg-[var(--aotake)]/20 text-[var(--aotake)]"
                    : "bg-[var(--nezumi)]/20 text-[var(--nezumi)]"
            }`}
          >
            {HELP_REQUEST_STATUS_LABELS[helpRequest.helpStatus]}
          </span>
          {helpRequest.acceptedAt && (
            <span className="flex items-center gap-1 text-xs text-[var(--nezumi)]">
              <ClockIcon size={12} />
              {new Date(helpRequest.acceptedAt).toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              に受諾
            </span>
          )}
        </div>

        {/* Acceptor info */}
        {helpRequest.acceptedBy && !isAcceptor && (
          <div className="p-3 bg-[var(--ai)]/10 rounded-lg">
            <p className="text-sm text-[var(--ai)]">対応者: {helpRequest.acceptedBy}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {canAccept && (
            <button
              onClick={() => onAcceptHelp?.(task.id)}
              className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium"
            >
              ヘルプする
            </button>
          )}
          {canComplete && (
            <button
              onClick={() => {
                onCompleteHelp?.(task.id);
                onStatusChange(task.id, "completed");
              }}
              className="flex-1 py-3 bg-[var(--aotake)] text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <CheckIcon size={16} />
              完了
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancelHelp?.(task.id)}
              className="flex-1 py-3 bg-[var(--nezumi)]/20 text-[var(--nezumi)] rounded-lg font-medium"
            >
              キャンセル
            </button>
          )}
        </div>

        {/* Completed/Cancelled state */}
        {(isCompleted || isCancelled) && (
          <div
            className={`p-3 rounded-lg ${
              isCompleted ? "bg-[var(--aotake)]/10" : "bg-[var(--nezumi)]/10"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isCompleted ? "text-[var(--aotake)]" : "text-[var(--nezumi)]"
              }`}
            >
              {isCompleted ? "ヘルプ完了" : "キャンセル済み"}
            </p>
          </div>
        )}
      </div>
    </TaskCardBase>
  );
};
