import { useState, useRef, useCallback } from "react";
import type { UnifiedTask } from "../../../types";
import { UNIFIED_TASK_TYPE_LABELS, UNIFIED_TASK_TYPE_ICONS } from "../../../types";
import { getRoomName } from "../../../data/mock";
import { RoomIcon, CelebrationIcon, ChevronDownIcon, AlertIcon } from "../../ui/Icons";
import { StatusBadge } from "../../ui/StatusBadge";

// Swipe threshold in pixels
const SWIPE_THRESHOLD = 80;

// カテゴリ別の色設定
const CATEGORY_COLORS: Record<
  UnifiedTask["type"],
  { bg: string; border: string; text: string; badge: string }
> = {
  housekeeping: {
    bg: "bg-[var(--ai)]/10",
    border: "border-[var(--ai)]",
    text: "text-[var(--ai)]",
    badge: "bg-[var(--ai)]",
  },
  meal: {
    bg: "bg-[var(--kincha)]/10",
    border: "border-[var(--kincha)]",
    text: "text-[var(--kincha)]",
    badge: "bg-[var(--kincha)]",
  },
  shuttle: {
    bg: "bg-[var(--aotake)]/10",
    border: "border-[var(--aotake)]",
    text: "text-[var(--aotake)]",
    badge: "bg-[var(--aotake)]",
  },
  celebration: {
    bg: "bg-[var(--shu)]/10",
    border: "border-[var(--shu)]",
    text: "text-[var(--shu)]",
    badge: "bg-[var(--shu)]",
  },
  help_request: {
    bg: "bg-[var(--fuji)]/10",
    border: "border-[var(--fuji)]",
    text: "text-[var(--fuji)]",
    badge: "bg-[var(--fuji)]",
  },
};

interface TaskCardBaseProps {
  task: UnifiedTask;
  onStatusChange: (taskId: string, newStatus: UnifiedTask["status"]) => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

export const TaskCardBase = ({
  task,
  onStatusChange,
  onExpand,
  isExpanded = false,
  children,
}: TaskCardBaseProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const colors = CATEGORY_COLORS[task.type];

  // Swipe handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (task.status === "completed") return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      setIsSwiping(true);
    },
    [task.status],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || task.status === "completed") return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      if (deltaY > Math.abs(deltaX) && Math.abs(deltaX) < 10) {
        touchStartRef.current = null;
        setSwipeOffset(0);
        setIsSwiping(false);
        return;
      }

      const maxSwipe = 120;
      const clampedOffset = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
      setSwipeOffset(clampedOffset);
    },
    [task.status],
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || task.status === "completed") {
      touchStartRef.current = null;
      setSwipeOffset(0);
      setIsSwiping(false);
      return;
    }

    if (Math.abs(swipeOffset) >= SWIPE_THRESHOLD) {
      if (swipeOffset < 0) {
        // Swipe left: progress status
        if (task.status === "pending") {
          onStatusChange(task.id, "in_progress");
        } else if (task.status === "in_progress") {
          onStatusChange(task.id, "completed");
        }
      } else {
        // Swipe right: revert status
        if (task.status === "in_progress") {
          onStatusChange(task.id, "pending");
        }
      }
    }

    touchStartRef.current = null;
    setSwipeOffset(0);
    setIsSwiping(false);
  }, [swipeOffset, task.id, task.status, onStatusChange]);

  // 優先度に応じたスタイル
  const isUrgent = task.priority === "urgent";
  const isHigh = task.priority === "high";
  const priorityStyle = isUrgent
    ? "ring-2 ring-[var(--shu)] ring-offset-1"
    : isHigh
      ? "ring-1 ring-[var(--kincha)]"
      : "";
  const urgentBgStyle = isUrgent ? "bg-[var(--shu)]/5" : "bg-white/80";

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe background */}
      {task.status !== "completed" && (
        <>
          <div
            className={`absolute inset-y-0 left-0 w-24 flex items-center justify-center
              ${swipeOffset > 0 ? "bg-[var(--kincha)]" : "bg-transparent"}`}
          >
            {swipeOffset > SWIPE_THRESHOLD / 2 && (
              <span className="text-white text-sm font-medium">戻す</span>
            )}
          </div>
          <div
            className={`absolute inset-y-0 right-0 w-24 flex items-center justify-center
              ${swipeOffset < 0 ? "bg-[var(--aotake)]" : "bg-transparent"}`}
          >
            {swipeOffset < -SWIPE_THRESHOLD / 2 && (
              <span className="text-white text-sm font-medium">
                {task.status === "pending" ? "開始" : "完了"}
              </span>
            )}
          </div>
        </>
      )}

      {/* Card content */}
      <div
        className={`relative ${urgentBgStyle} backdrop-blur-sm rounded-xl shadow-sm border transition-transform
          ${colors.border} ${priorityStyle}
          ${isSwiping ? "" : "transition-transform duration-200"}
          ${isUrgent ? "animate-pulse-urgent" : ""}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Priority color bar */}
        {(isUrgent || isHigh) && (
          <div
            className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
              isUrgent ? "bg-[var(--shu)]" : "bg-[var(--kincha)]"
            }`}
          />
        )}

        {/* Header */}
        <button type="button" className="w-full p-4" onClick={onExpand}>
          <div className="flex items-start gap-3">
            {/* Category icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
              <span className="text-xl">{UNIFIED_TASK_TYPE_ICONS[task.type]}</span>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {/* Category label */}
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium text-white ${colors.badge}`}
                >
                  {UNIFIED_TASK_TYPE_LABELS[task.type]}
                </span>
                <StatusBadge status={task.status} />
                {task.isAnniversaryRelated && (
                  <CelebrationIcon size={14} className="text-[var(--kincha)]" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--nezumi)] font-medium tabular-nums">
                  {task.scheduledTime}
                </span>
                <h3 className="font-display font-bold text-[var(--sumi)] text-left truncate">
                  {task.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs text-[var(--nezumi)]">
                {task.roomId && (
                  <span className="flex items-center gap-1">
                    <RoomIcon size={12} />
                    {getRoomName(task.roomId)}
                  </span>
                )}
                {task.priority === "urgent" && (
                  <span className="flex items-center gap-1 text-[var(--shu)]">
                    <AlertIcon size={12} />
                    緊急
                  </span>
                )}
              </div>
            </div>

            {/* Expand indicator */}
            {children && (
              <ChevronDownIcon
                size={20}
                className={`text-[var(--nezumi)] transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && children && (
          <div className="px-4 pb-4 border-t border-[var(--shironeri-warm)]">
            <div className="pt-4">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};
