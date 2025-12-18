import { useState, useMemo, useRef } from "react";
import type {
  CelebrationTask,
  TaskStatus,
  CelebrationItem,
  CelebrationItemCheck,
} from "../../types";
import { CELEBRATION_TYPE_LABELS, CELEBRATION_ITEM_LABELS } from "../../types";
import { mockCelebrationTasks, getStaffById } from "../../data/mockData";
import {
  CakeIcon,
  FlowerIcon,
  ChampagneIcon,
  DecorationIcon,
  MessageCardIcon,
  ClockIcon,
  CheckIcon,
  ChevronRightIcon,
} from "../ui/Icons";

// Current staff ID (in real app, this would come from auth context)
const CURRENT_STAFF_ID = "STF005"; // 加藤美咲 - コンシェルジュ

// Swipe threshold
const SWIPE_THRESHOLD = 80;

// Filter type
type CelebrationFilter = "all" | "pending" | "in_progress" | "completed";

// Status labels
const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "未着手",
  in_progress: "対応中",
  completed: "完了",
};

// Get celebration item icon
const getItemIcon = (item: CelebrationItem, size = 16) => {
  const iconMap: Record<CelebrationItem, React.ReactNode> = {
    cake: <CakeIcon size={size} />,
    flowers: <FlowerIcon size={size} />,
    champagne: <ChampagneIcon size={size} />,
    decoration: <DecorationIcon size={size} />,
    message_card: <MessageCardIcon size={size} />,
    other: <CheckIcon size={size} />,
  };
  return iconMap[item];
};

// Status badge component
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const colorMap: Record<TaskStatus, string> = {
    pending: "bg-[var(--nezumi)] text-white",
    in_progress: "bg-[var(--ai)] text-white",
    completed: "bg-[var(--aotake)]/20 text-[var(--aotake)]",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};

// Checklist progress component
const ChecklistProgress = ({
  items,
  showLabels = false,
}: {
  items: CelebrationItemCheck[];
  showLabels?: boolean;
}) => {
  const checkedCount = items.filter((i) => i.isChecked).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div>
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-[var(--nezumi)] mb-1">
          <span>準備進捗</span>
          <span>
            {checkedCount}/{totalCount}
          </span>
        </div>
      )}
      <div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--aotake)] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Interactive checklist
const InteractiveChecklist = ({
  items,
  onToggleItem,
}: {
  items: CelebrationItemCheck[];
  onToggleItem: (item: CelebrationItem) => void;
}) => {
  return (
    <div className="space-y-2">
      {items.map((itemCheck) => (
        <button
          key={itemCheck.item}
          onClick={() => onToggleItem(itemCheck.item)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            itemCheck.isChecked ? "bg-[var(--aotake)]/10" : "bg-[var(--shironeri-warm)]"
          }`}
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
            className={`flex items-center gap-2 ${
              itemCheck.isChecked ? "text-[var(--aotake)]" : "text-[var(--sumi)]"
            }`}
          >
            {getItemIcon(itemCheck.item)}
            {CELEBRATION_ITEM_LABELS[itemCheck.item]}
          </span>
          {itemCheck.notes && (
            <span className="ml-auto text-xs text-[var(--nezumi)]">{itemCheck.notes}</span>
          )}
        </button>
      ))}
    </div>
  );
};

// Current celebration highlight
const CurrentCelebrationHighlight = ({
  task,
  onStatusChange,
  onToggleItem,
  onUpdateReport,
}: {
  task: CelebrationTask;
  onStatusChange: (newStatus: TaskStatus) => void;
  onToggleItem: (item: CelebrationItem) => void;
  onUpdateReport: (report: string) => void;
}) => {
  const [reportText, setReportText] = useState(task.completionReport || "");
  const allItemsChecked = task.items.every((i) => i.isChecked);

  const getNextStatus = (): TaskStatus | null => {
    const flow: Record<TaskStatus, TaskStatus | null> = {
      pending: "in_progress",
      in_progress: "completed",
      completed: null,
    };
    return flow[task.status];
  };

  const nextStatus = getNextStatus();

  const buttonLabels: Record<TaskStatus, string> = {
    pending: "対応開始",
    in_progress: "完了報告",
    completed: "",
  };

  const handleComplete = () => {
    if (nextStatus === "completed") {
      onUpdateReport(reportText);
    }
    if (nextStatus) {
      onStatusChange(nextStatus);
    }
  };

  return (
    <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)] animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CakeIcon size={20} className="text-[var(--kincha)]" />
          <span className="font-display font-semibold text-[var(--kincha)]">
            {task.status === "pending" ? "次の対応" : "現在対応中"}
          </span>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="mb-3">
        <div className="text-lg font-display font-bold text-[var(--sumi)]">
          {task.roomNumber}号室 {task.guestName}様
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--nezumi)] mt-1">
          <ClockIcon size={14} />
          <span>{task.executionTime}</span>
          <span className="text-[var(--nezumi-light)]">|</span>
          <span>{CELEBRATION_TYPE_LABELS[task.celebrationType]}</span>
        </div>
        <p className="mt-1 text-sm text-[var(--sumi)]">{task.celebrationDescription}</p>
      </div>

      {/* Checklist */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-display font-medium text-[var(--sumi)]">
            準備チェックリスト
          </span>
          <span className="text-xs text-[var(--nezumi)]">
            {task.items.filter((i) => i.isChecked).length}/{task.items.length}
            完了
          </span>
        </div>
        <InteractiveChecklist items={task.items} onToggleItem={onToggleItem} />
      </div>

      {/* Completion report (only for in_progress) */}
      {task.status === "in_progress" && (
        <div className="mb-4">
          <label className="block text-sm font-display font-medium text-[var(--sumi)] mb-2">
            完了報告（任意）
          </label>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="特記事項があれば入力してください..."
            className="w-full p-3 rounded-lg border border-[var(--shironeri-warm)] bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/50"
            rows={3}
          />
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <div className="mb-4 p-3 bg-[var(--shironeri-warm)] rounded-lg text-sm text-[var(--sumi)]">
          <span className="font-medium">メモ: </span>
          {task.notes}
        </div>
      )}

      {/* Status update button */}
      {nextStatus && (
        <button
          onClick={handleComplete}
          disabled={task.status === "in_progress" && !allItemsChecked && nextStatus === "completed"}
          className={`w-full py-4 rounded-xl font-display font-bold text-lg transition-all shadow-lg ${
            task.status === "in_progress" && !allItemsChecked && nextStatus === "completed"
              ? "bg-[var(--nezumi)]/30 text-white cursor-not-allowed"
              : "bg-[var(--kincha)] text-white hover:bg-[var(--kincha-deep)] active:scale-[0.98]"
          }`}
        >
          {buttonLabels[task.status]}
          {task.status === "in_progress" && !allItemsChecked && (
            <span className="block text-xs font-normal mt-1">
              全てのアイテムをチェックしてください
            </span>
          )}
        </button>
      )}
    </div>
  );
};

// Celebration task card with swipe
const CelebrationTaskCard = ({
  task,
  onStatusChange,
  onToggleItem,
  onExpand,
  isExpanded,
}: {
  task: CelebrationTask;
  onStatusChange: (newStatus: TaskStatus) => void;
  onToggleItem: (item: CelebrationItem) => void;
  onExpand: () => void;
  isExpanded: boolean;
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);

  const getNextStatus = (): TaskStatus | null => {
    const flow: Record<TaskStatus, TaskStatus | null> = {
      pending: "in_progress",
      in_progress: "completed",
      completed: null,
    };
    return flow[task.status];
  };

  const nextStatus = getNextStatus();
  const allItemsChecked = task.items.every((i) => i.isChecked);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isScrolling.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Detect if scrolling vertically
    if (!isSwiping && Math.abs(deltaY) > Math.abs(deltaX)) {
      isScrolling.current = true;
      return;
    }

    if (isScrolling.current) return;

    // Only allow left swipe to progress status
    if (deltaX < 0 && nextStatus && task.status !== "completed") {
      // Don't allow swipe to complete if items not checked
      if (task.status === "in_progress" && !allItemsChecked) {
        return;
      }
      setIsSwiping(true);
      setSwipeOffset(Math.max(deltaX, -120));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -SWIPE_THRESHOLD && nextStatus) {
      onStatusChange(nextStatus);
    }
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  const buttonLabels: Record<TaskStatus, string> = {
    pending: "開始",
    in_progress: "完了",
    completed: "",
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe action background */}
      {task.status !== "completed" && nextStatus && (
        <div
          className={`absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-[var(--aotake)] transition-opacity ${
            Math.abs(swipeOffset) > 30 ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: "120px" }}
        >
          <span className="text-white font-medium">{buttonLabels[task.status]}</span>
        </div>
      )}

      {/* Card content */}
      <div
        className={`shoji-panel border-l-3 transition-transform ${
          task.status === "completed"
            ? "border-l-[var(--aotake)] opacity-60"
            : "border-l-[var(--kincha)]"
        }`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button onClick={onExpand} className="w-full text-left p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <ClockIcon size={14} className="text-[var(--kincha)]" />
              <span className="font-display font-semibold text-[var(--kincha)]">
                {task.executionTime}
              </span>
              <StatusBadge status={task.status} />
            </div>
            <ChevronRightIcon
              size={18}
              className={`text-[var(--nezumi)] transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>

          <div className="mb-2">
            <span className="font-display font-medium text-[var(--sumi)]">
              {task.roomNumber}号室 {task.guestName}様
            </span>
            <span className="ml-2 text-sm text-[var(--kincha)]">
              {CELEBRATION_TYPE_LABELS[task.celebrationType]}
            </span>
          </div>

          {/* Item icons */}
          <div className="flex items-center gap-2 mb-2">
            {task.items.map((itemCheck) => (
              <span
                key={itemCheck.item}
                className={itemCheck.isChecked ? "text-[var(--aotake)]" : "text-[var(--nezumi)]"}
              >
                {getItemIcon(itemCheck.item, 18)}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <ChecklistProgress items={task.items} />

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-[var(--shironeri-warm)] space-y-3 animate-slide-up">
              {/* Description */}
              <p className="text-sm text-[var(--sumi)]">{task.celebrationDescription}</p>

              {/* Interactive checklist */}
              <div>
                <div className="text-xs text-[var(--nezumi)] mb-2">チェックリスト</div>
                <InteractiveChecklist items={task.items} onToggleItem={onToggleItem} />
              </div>

              {/* Notes */}
              {task.notes && (
                <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg text-sm text-[var(--sumi)]">
                  {task.notes}
                </div>
              )}

              {/* Completion report */}
              {task.completionReport && (
                <div className="p-3 bg-[var(--aotake)]/10 rounded-lg text-sm text-[var(--aotake)]">
                  <span className="font-medium">完了報告: </span>
                  {task.completionReport}
                </div>
              )}

              {/* Action button */}
              {nextStatus && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.status === "in_progress" && !allItemsChecked) {
                      return;
                    }
                    onStatusChange(nextStatus);
                  }}
                  disabled={task.status === "in_progress" && !allItemsChecked}
                  className={`w-full py-3 rounded-lg font-display font-medium ${
                    task.status === "in_progress" && !allItemsChecked
                      ? "bg-[var(--nezumi)]/30 text-white cursor-not-allowed"
                      : "bg-[var(--kincha)] text-white"
                  }`}
                >
                  {buttonLabels[task.status]}にする
                  {task.status === "in_progress" && !allItemsChecked && (
                    <span className="block text-xs font-normal">
                      全てのアイテムをチェックしてください
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

// Filter tabs
const FilterTabs = ({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: CelebrationFilter;
  onFilterChange: (filter: CelebrationFilter) => void;
  counts: Record<CelebrationFilter, number>;
}) => {
  const filters: { key: CelebrationFilter; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "pending", label: "未着手" },
    { key: "in_progress", label: "対応中" },
    { key: "completed", label: "完了" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.key
              ? "bg-[var(--kincha)] text-white"
              : "bg-[var(--shironeri-warm)] text-[var(--nezumi)]"
          }`}
        >
          {filter.label}
          {counts[filter.key] > 0 && <span className="ml-1">({counts[filter.key]})</span>}
        </button>
      ))}
    </div>
  );
};

// Progress summary
const ProgressSummary = ({ completed, total }: { completed: number; total: number }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="shoji-panel p-4">
      <div className="flex items-center justify-between mb-2">
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

// Main component
export const MobileCelebrationList = () => {
  const [celebrationTasks, setCelebrationTasks] = useState<CelebrationTask[]>(() =>
    mockCelebrationTasks.filter((t) => t.assignedStaffId === CURRENT_STAFF_ID),
  );
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<CelebrationFilter>("all");

  // Get current staff
  const currentStaff = useMemo(() => {
    return getStaffById(CURRENT_STAFF_ID);
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = celebrationTasks.length;
    const completed = celebrationTasks.filter((t) => t.status === "completed").length;
    return { total, completed };
  }, [celebrationTasks]);

  // Filter counts
  const filterCounts = useMemo(() => {
    return {
      all: celebrationTasks.length,
      pending: celebrationTasks.filter((t) => t.status === "pending").length,
      in_progress: celebrationTasks.filter((t) => t.status === "in_progress").length,
      completed: celebrationTasks.filter((t) => t.status === "completed").length,
    };
  }, [celebrationTasks]);

  // Get active task (in_progress or next pending)
  const activeTask = useMemo(() => {
    const inProgress = celebrationTasks.find((t) => t.status === "in_progress");
    if (inProgress) return inProgress;

    // Get next pending task by execution time
    const pendingTasks = celebrationTasks
      .filter((t) => t.status === "pending")
      .sort((a, b) => a.executionTime.localeCompare(b.executionTime));
    return pendingTasks[0];
  }, [celebrationTasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...celebrationTasks];

    // Apply filter
    if (activeFilter !== "all") {
      tasks = tasks.filter((t) => t.status === activeFilter);
    }

    // Sort: in_progress first, then pending by time, then completed
    return tasks.sort((a, b) => {
      const statusOrder = (status: TaskStatus) => {
        if (status === "completed") return 3;
        if (status === "pending") return 2;
        return 1; // in_progress
      };
      const orderDiff = statusOrder(a.status) - statusOrder(b.status);
      if (orderDiff !== 0) return orderDiff;
      return a.executionTime.localeCompare(b.executionTime);
    });
  }, [celebrationTasks, activeFilter]);

  // Other tasks (excluding active)
  const otherTasks = filteredTasks.filter((t) => t.id !== activeTask?.id);

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setCelebrationTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              completedAt:
                newStatus === "completed"
                  ? new Date().toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : t.completedAt,
            }
          : t,
      ),
    );
  };

  // Handle item toggle
  const handleToggleItem = (taskId: string, item: CelebrationItem) => {
    setCelebrationTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              items: t.items.map((i) => (i.item === item ? { ...i, isChecked: !i.isChecked } : i)),
            }
          : t,
      ),
    );
  };

  // Handle update report
  const handleUpdateReport = (taskId: string, report: string) => {
    setCelebrationTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completionReport: report || null,
            }
          : t,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[var(--shironeri)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--shironeri)]/80 backdrop-blur-sm border-b border-[var(--shironeri-warm)]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-display font-bold text-[var(--sumi)]">お祝い対応</h1>
              <p className="text-xs text-[var(--nezumi)]">
                {new Date().toLocaleDateString("ja-JP", {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </p>
            </div>
            {currentStaff && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--kincha)]/10 rounded-full">
                <span className="text-sm font-medium text-[var(--kincha)]">
                  {currentStaff.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Progress summary */}
        <ProgressSummary completed={stats.completed} total={stats.total} />

        {/* Filter tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />

        {/* Active task */}
        {activeTask && activeFilter === "all" && (
          <CurrentCelebrationHighlight
            task={activeTask}
            onStatusChange={(newStatus) => handleStatusChange(activeTask.id, newStatus)}
            onToggleItem={(item) => handleToggleItem(activeTask.id, item)}
            onUpdateReport={(report) => handleUpdateReport(activeTask.id, report)}
          />
        )}

        {/* Task list */}
        {otherTasks.length > 0 && (
          <div>
            <h2 className="text-sm font-display font-medium text-[var(--nezumi)] mb-3">
              本日のお祝い ({otherTasks.length}件)
            </h2>
            <div className="space-y-3">
              {otherTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CelebrationTaskCard
                    task={task}
                    onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                    onToggleItem={(item) => handleToggleItem(task.id, item)}
                    onExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    isExpanded={expandedTaskId === task.id}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="shoji-panel p-8 text-center">
            <CakeIcon size={48} className="mx-auto text-[var(--nezumi)]/30 mb-3" />
            <p className="text-[var(--nezumi)]">
              {activeFilter === "all"
                ? "本日のお祝い対応はありません"
                : `${STATUS_LABELS[activeFilter]}の対応はありません`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
