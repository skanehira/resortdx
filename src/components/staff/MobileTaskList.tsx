import { useState, useRef, useCallback } from "react";
import {
  mockTasks,
  mockStaff,
  getReservationById,
  getRoomCleaningStatuses,
  createInspectionTask,
} from "../../data/mockData";
import {
  type Task,
  type TaskStatus,
  type CleaningChecklistItem,
  type CleaningChecklistItemType,
  CLEANING_CHECKLIST_LABELS,
} from "../../types";
import {
  TaskIcon,
  CheckIcon,
  RoomIcon,
  CelebrationIcon,
  ChevronRightIcon,
  AlertIcon,
  MapIcon,
  ListIcon,
} from "../ui/Icons";
import { RoomStatusMap } from "../shared/RoomStatusMap";

// Swipe threshold in pixels
const SWIPE_THRESHOLD = 80;

// Simulating current logged-in staff (using first staff for demo)
const CURRENT_STAFF = mockStaff[0];

// Status tab component
interface StatusTabsProps {
  selected: TaskStatus | "all";
  onChange: (status: TaskStatus | "all") => void;
  counts: Record<TaskStatus | "all", number>;
}

const StatusTabs = ({ selected, onChange, counts }: StatusTabsProps) => {
  const tabs: { key: TaskStatus | "all"; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "pending", label: "未着手" },
    { key: "in_progress", label: "作業中" },
    { key: "completed", label: "完了" },
  ];

  return (
    <div className="flex gap-1 p-1 bg-[var(--shironeri-warm)] rounded-lg overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 min-w-0 px-3 py-2.5 text-sm font-display rounded-md transition-all whitespace-nowrap ${
            selected === tab.key
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          {tab.label}
          <span
            className={`ml-1.5 text-xs ${
              selected === tab.key ? "text-[var(--ai)]" : "text-[var(--nezumi-light)]"
            }`}
          >
            {counts[tab.key]}
          </span>
        </button>
      ))}
    </div>
  );
};

// Cleaning Checklist Component
interface CleaningChecklistProps {
  items: CleaningChecklistItem[];
  onToggleItem: (item: CleaningChecklistItemType) => void;
  disabled?: boolean;
}

const CleaningChecklist = ({ items, onToggleItem, disabled = false }: CleaningChecklistProps) => {
  const checkedCount = items.filter((i) => i.isChecked).length;
  const totalCount = items.length;

  return (
    <div className="space-y-2">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-[var(--nezumi)] mb-2">
        <span>清掃チェックリスト</span>
        <span>
          {checkedCount}/{totalCount}
        </span>
      </div>
      <div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[var(--aotake)] rounded-full transition-all duration-300"
          style={{
            width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((itemCheck) => (
          <button
            key={itemCheck.item}
            onClick={() => !disabled && onToggleItem(itemCheck.item)}
            disabled={disabled}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              itemCheck.isChecked ? "bg-[var(--aotake)]/10" : "bg-[var(--shironeri-warm)]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                itemCheck.isChecked
                  ? "bg-[var(--aotake)] text-white"
                  : "bg-white border-2 border-[var(--nezumi)]/30"
              }`}
            >
              {itemCheck.isChecked && <CheckIcon size={14} />}
            </div>
            <span
              className={`flex-1 text-left ${
                itemCheck.isChecked ? "text-[var(--aotake)]" : "text-[var(--sumi)]"
              }`}
            >
              {CLEANING_CHECKLIST_LABELS[itemCheck.item]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Task Card Component (Mobile optimized)
interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onToggleCleaningItem?: (taskId: string, item: CleaningChecklistItemType) => void;
}

const TaskCard = ({ task, onStatusChange, onToggleCleaningItem }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reservation = getReservationById(task.reservationId);

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

      // If vertical scroll is dominant, cancel swipe
      if (deltaY > Math.abs(deltaX) && Math.abs(deltaX) < 10) {
        touchStartRef.current = null;
        setSwipeOffset(0);
        setIsSwiping(false);
        return;
      }

      // Limit swipe range
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

    // Check if swipe threshold is met
    if (Math.abs(swipeOffset) >= SWIPE_THRESHOLD) {
      if (swipeOffset < 0) {
        // Swipe left: start or complete
        if (task.status === "pending") {
          onStatusChange(task.id, "in_progress");
        } else if (task.status === "in_progress") {
          onStatusChange(task.id, "completed");
        }
      } else if (swipeOffset > 0 && task.status === "in_progress") {
        // Swipe right: pause (only for in_progress)
        onStatusChange(task.id, "pending");
      }
    }

    // Reset
    touchStartRef.current = null;
    setSwipeOffset(0);
    setIsSwiping(false);
  }, [swipeOffset, task.status, task.id, onStatusChange]);

  const statusColors: Record<TaskStatus, string> = {
    pending: "border-l-[var(--nezumi-light)]",
    in_progress: "border-l-[var(--ai)]",
    completed: "border-l-[var(--aotake)]",
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange(task.id, newStatus);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Swipe Action Background - Left (Complete/Start) */}
      {task.status !== "completed" && (
        <div
          className={`absolute inset-y-0 right-0 w-24 flex items-center justify-center transition-opacity ${
            swipeOffset < -30 ? "opacity-100" : "opacity-0"
          } ${task.status === "pending" ? "bg-[var(--ai)]" : "bg-[var(--aotake)]"}`}
        >
          <div className="flex flex-col items-center text-white">
            {task.status === "pending" ? <TaskIcon size={20} /> : <CheckIcon size={20} />}
            <span className="text-xs mt-1 font-display">
              {task.status === "pending" ? "開始" : "完了"}
            </span>
          </div>
        </div>
      )}

      {/* Swipe Action Background - Right (Pause) */}
      {task.status === "in_progress" && (
        <div
          className={`absolute inset-y-0 left-0 w-24 flex items-center justify-center transition-opacity ${
            swipeOffset > 30 ? "opacity-100" : "opacity-0"
          } bg-[var(--nezumi)]`}
        >
          <div className="flex flex-col items-center text-white">
            <AlertIcon size={20} />
            <span className="text-xs mt-1 font-display">中断</span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div
        ref={cardRef}
        className={`shoji-panel border-l-4 ${statusColors[task.status]} overflow-hidden animate-slide-up relative bg-white ${
          isSwiping ? "" : "transition-transform duration-200"
        }`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe hint for non-completed tasks */}
        {task.status !== "completed" && !isExpanded && (
          <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[var(--nezumi-light)] opacity-30 pointer-events-none">
            <ChevronRightIcon size={16} className="animate-pulse" />
          </div>
        )}

        {/* Main Content - Tappable */}
        <div
          className="p-4 cursor-pointer active:bg-[var(--shironeri-warm)]"
          onClick={() => !isSwiping && setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Time and Priority */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-display font-semibold text-[var(--ai)]">
                  {task.scheduledTime}
                </span>
                {task.priority === "urgent" && (
                  <span className="badge badge-urgent">
                    <AlertIcon size={12} />
                    緊急
                  </span>
                )}
                {task.priority === "high" && <span className="badge badge-anniversary">優先</span>}
                {task.isAnniversaryRelated && (
                  <CelebrationIcon size={16} className="text-[var(--kincha)]" />
                )}
              </div>

              {/* Task Title */}
              <h3 className="font-medium text-[var(--sumi)] leading-tight">{task.title}</h3>

              {/* Meta Info */}
              <div className="flex items-center gap-2 mt-2 text-sm text-[var(--nezumi)]">
                <div className="flex items-center gap-1">
                  <RoomIcon size={14} />
                  <span>{task.roomNumber}号室</span>
                </div>
                <span>・</span>
                <span>{task.estimatedDuration}分</span>
              </div>
            </div>

            {/* Expand Arrow */}
            <ChevronRightIcon
              size={20}
              className={`text-[var(--nezumi-light)] transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-0 border-t border-[rgba(45,41,38,0.06)] mt-0 animate-fade-in">
            {/* Description */}
            {task.description && (
              <div className="py-3 border-b border-[rgba(45,41,38,0.04)]">
                <p className="text-sm text-[var(--sumi-light)]">{task.description}</p>
              </div>
            )}

            {/* Guest Info */}
            {reservation && (
              <div className="py-3 border-b border-[rgba(45,41,38,0.04)]">
                <p className="text-xs text-[var(--nezumi)] mb-1">ゲスト情報</p>
                <p className="text-sm font-medium">{reservation.guestName}</p>
                {reservation.anniversary && (
                  <div className="mt-2 p-2 bg-[rgba(184,134,11,0.05)] rounded text-sm">
                    <p className="text-[var(--kincha)] font-medium">
                      {reservation.anniversary.type === "birthday" ? "誕生日" : "結婚記念日"}
                    </p>
                    <p className="text-[var(--sumi-light)] text-xs mt-0.5">
                      {reservation.anniversary.description}
                    </p>
                  </div>
                )}
                {reservation.specialRequests.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-[var(--nezumi)] mb-1">特記事項</p>
                    <div className="flex flex-wrap gap-1">
                      {reservation.specialRequests.map((req, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-[var(--shironeri-warm)] rounded"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cleaning Checklist (only for cleaning tasks) */}
            {task.category === "cleaning" && task.cleaningChecklist && (
              <div className="py-3 border-b border-[rgba(45,41,38,0.04)]">
                <CleaningChecklist
                  items={task.cleaningChecklist}
                  onToggleItem={(item) => onToggleCleaningItem?.(task.id, item)}
                  disabled={task.status === "completed"}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-2">
              {task.status === "pending" && (
                <button
                  onClick={() => handleStatusChange("in_progress")}
                  className="w-full btn btn-primary py-3 text-base"
                >
                  <TaskIcon size={18} />
                  作業を開始する
                </button>
              )}
              {task.status === "in_progress" && (
                <>
                  {(() => {
                    const isCleaningTask = task.category === "cleaning";
                    const allItemsChecked =
                      !isCleaningTask ||
                      !task.cleaningChecklist ||
                      task.cleaningChecklist.every((i) => i.isChecked);
                    return (
                      <button
                        onClick={() => allItemsChecked && handleStatusChange("completed")}
                        disabled={!allItemsChecked}
                        className={`w-full py-3 text-base rounded font-display font-medium flex items-center justify-center gap-2 ${
                          allItemsChecked
                            ? "bg-[var(--aotake)] text-white"
                            : "bg-[var(--nezumi)]/30 text-white cursor-not-allowed"
                        }`}
                      >
                        <CheckIcon size={18} />
                        完了にする
                        {!allItemsChecked && (
                          <span className="block text-xs font-normal ml-1">
                            (全てチェックしてください)
                          </span>
                        )}
                      </button>
                    );
                  })()}
                  <button
                    onClick={() => handleStatusChange("pending")}
                    className="w-full btn btn-secondary py-3 text-base"
                  >
                    作業を中断する
                  </button>
                </>
              )}
              {task.status === "completed" && (
                <div className="flex items-center justify-center gap-2 py-3 text-[var(--aotake)]">
                  <CheckIcon size={18} />
                  <span className="font-display">完了済み</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Progress Summary Component
const ProgressSummary = ({ tasks }: { tasks: Task[] }) => {
  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="shoji-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--nezumi)]">本日の進捗</span>
        <span className="font-display font-semibold text-[var(--sumi)]">
          {completed}/{total}件完了
        </span>
      </div>
      <div className="h-2 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--aotake)] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Current Task Highlight Component
const CurrentTaskHighlight = ({
  task,
  onStatusChange,
}: {
  task: Task | null;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}) => {
  if (!task) return null;

  return (
    <div className="shoji-panel p-4 bg-[rgba(27,73,101,0.03)] border-l-4 border-l-[var(--ai)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-[var(--ai)] rounded-full animate-pulse" />
        <span className="text-sm font-display text-[var(--ai)]">現在作業中</span>
      </div>
      <h3 className="font-medium text-[var(--sumi)] mb-1">{task.title}</h3>
      <p className="text-sm text-[var(--nezumi)]">
        {task.roomNumber}号室 ・ {task.estimatedDuration}分
      </p>
      <button
        onClick={() => onStatusChange(task.id, "completed")}
        className="mt-3 w-full py-2.5 rounded bg-[var(--aotake)] text-white font-display font-medium flex items-center justify-center gap-2"
      >
        <CheckIcon size={16} />
        完了にする
      </button>
    </div>
  );
};

// View mode type
type ViewMode = "list" | "map";

// Main Mobile Task List Component
export const MobileTaskList = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [tasks, setTasks] = useState<Task[]>(() =>
    mockTasks.filter((t) => t.assignedStaffId === CURRENT_STAFF.id),
  );

  // Get tasks for current staff (use local state)
  const myTasks = tasks;

  // Sort tasks: in_progress first, then pending by time, then completed
  const sortedTasks = [...myTasks].sort((a, b) => {
    const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  const filteredTasks =
    statusFilter === "all" ? sortedTasks : sortedTasks.filter((t) => t.status === statusFilter);

  const currentTask = myTasks.find((t) => t.status === "in_progress");

  const counts: Record<TaskStatus | "all", number> = {
    all: myTasks.length,
    pending: myTasks.filter((t) => t.status === "pending").length,
    in_progress: myTasks.filter((t) => t.status === "in_progress").length,
    completed: myTasks.filter((t) => t.status === "completed").length,
  };

  // Handle status change with inspection task auto-generation
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedAt:
                newStatus === "completed"
                  ? new Date().toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : task.completedAt,
            }
          : task,
      );

      // If a cleaning task is completed, generate an inspection task
      const completedTask = updatedTasks.find((t) => t.id === taskId);
      if (completedTask && completedTask.category === "cleaning" && newStatus === "completed") {
        // Find a manager or concierge for inspection
        const inspector = mockStaff.find(
          (s) => (s.role === "manager" || s.role === "concierge") && s.isOnDuty,
        );
        if (inspector) {
          const inspectionTask = createInspectionTask(completedTask, inspector.id);
          // Check if inspection task already exists
          const existingInspection = updatedTasks.find(
            (t) => t.relatedCleaningTaskId === completedTask.id,
          );
          if (!existingInspection) {
            return [...updatedTasks, inspectionTask];
          }
        }
      }

      return updatedTasks;
    });
  };

  // Handle cleaning checklist item toggle
  const handleToggleCleaningItem = (taskId: string, item: CleaningChecklistItemType) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId || !task.cleaningChecklist) return task;
        return {
          ...task,
          cleaningChecklist: task.cleaningChecklist.map((checkItem) =>
            checkItem.item === item ? { ...checkItem, isChecked: !checkItem.isChecked } : checkItem,
          ),
        };
      }),
    );
  };

  // Generate room statuses for map view
  const roomStatuses = getRoomCleaningStatuses(tasks).map((info) => ({
    roomNumber: info.roomNumber,
    status: info.status,
    cleaningTask: info.cleaningTask,
    assignedStaff: info.assignedStaff,
  }));

  const currentTime = new Date().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[var(--shironeri)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--nezumi)]">こんにちは</p>
              <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                {CURRENT_STAFF.name}さん
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-[var(--shironeri-warm)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-[var(--ai)] shadow-sm"
                      : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
                  }`}
                  title="リスト表示"
                >
                  <ListIcon size={18} />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "map"
                      ? "bg-white text-[var(--ai)] shadow-sm"
                      : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
                  }`}
                  title="マップ表示"
                >
                  <MapIcon size={18} />
                </button>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display text-[var(--ai)]">{currentTime}</p>
              </div>
            </div>
          </div>
          <StatusTabs selected={statusFilter} onChange={setStatusFilter} counts={counts} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {viewMode === "map" ? (
          /* Map View */
          <div className="shoji-panel p-4">
            <h2 className="text-lg font-display font-semibold text-[var(--sumi)] mb-4">
              客室ステータスマップ
            </h2>
            <RoomStatusMap roomStatuses={roomStatuses} currentStaffId={CURRENT_STAFF.id} />
          </div>
        ) : (
          /* List View */
          <>
            {/* Progress Summary */}
            <ProgressSummary tasks={myTasks} />

            {/* Current Task Highlight */}
            {statusFilter !== "completed" && (
              <CurrentTaskHighlight
                task={currentTask || null}
                onStatusChange={handleStatusChange}
              />
            )}

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.id !== currentTask?.id || statusFilter !== "all")
                .map((task, index) => (
                  <div key={task.id} className={`stagger-${(index % 5) + 1}`}>
                    <TaskCard
                      task={task}
                      onStatusChange={handleStatusChange}
                      onToggleCleaningItem={handleToggleCleaningItem}
                    />
                  </div>
                ))}

              {filteredTasks.length === 0 && (
                <div className="shoji-panel p-8 text-center">
                  <TaskIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
                  <p className="text-[var(--nezumi)]">
                    {statusFilter === "completed"
                      ? "完了したタスクはありません"
                      : statusFilter === "pending"
                        ? "未着手のタスクはありません"
                        : statusFilter === "in_progress"
                          ? "作業中のタスクはありません"
                          : "割り当てられたタスクはありません"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
