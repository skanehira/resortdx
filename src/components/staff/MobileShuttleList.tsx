import { useState, useMemo, useRef } from "react";
import type { ShuttleTask, ShuttleStatus } from "../../types";
import { SHUTTLE_STATUS_LABELS } from "../../types";
import { mockShuttleTasks, getVehicleById } from "../../data/mockData";
import {
  ShuttleIcon,
  LocationIcon,
  CarIcon,
  ClockIcon,
  CheckIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  BellIcon,
} from "../ui/Icons";

// Current driver ID (in real app, this would come from auth context)
const CURRENT_DRIVER_ID = "STF004";

// Swipe threshold
const SWIPE_THRESHOLD = 80;

// Status badge component
const ShuttleStatusBadge = ({ status }: { status: ShuttleStatus }) => {
  const colorMap: Record<ShuttleStatus, string> = {
    not_departed: "bg-[var(--nezumi)] text-white",
    heading: "bg-[var(--ai)] text-white",
    arrived: "bg-[var(--aotake)] text-white",
    boarded: "bg-[var(--kincha)] text-white",
    completed: "bg-[var(--aotake)]/20 text-[var(--aotake)]",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}>
      {SHUTTLE_STATUS_LABELS[status]}
    </span>
  );
};

// 5-stage progress indicator (larger for mobile)
const ShuttleProgressIndicator = ({
  status,
  large = false,
}: {
  status: ShuttleStatus;
  large?: boolean;
}) => {
  const stages: ShuttleStatus[] = ["not_departed", "heading", "arrived", "boarded", "completed"];
  const stageLabels = ["未出発", "向かい中", "到着", "乗車", "完了"];
  const currentIndex = stages.indexOf(status);

  if (large) {
    return (
      <div className="flex items-center justify-between w-full">
        {stages.map((stage, index) => (
          <div key={stage} className="flex flex-col items-center flex-1">
            <div
              className={`w-4 h-4 rounded-full transition-colors ${
                index <= currentIndex
                  ? index === currentIndex
                    ? "bg-[var(--ai)] ring-2 ring-[var(--ai)]/30"
                    : "bg-[var(--aotake)]"
                  : "bg-[var(--nezumi)]/30"
              }`}
            />
            <div
              className={`text-xs mt-1 ${
                index <= currentIndex ? "text-[var(--sumi)]" : "text-[var(--nezumi)]"
              }`}
            >
              {stageLabels[index]}
            </div>
            {index < stages.length - 1 && (
              <div
                className={`absolute w-full h-0.5 top-2 left-1/2 ${
                  index < currentIndex ? "bg-[var(--aotake)]" : "bg-[var(--nezumi)]/30"
                }`}
                style={{ width: "calc(100% - 1rem)" }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index <= currentIndex
                ? index === currentIndex
                  ? "bg-[var(--ai)]"
                  : "bg-[var(--aotake)]"
                : "bg-[var(--nezumi)]/30"
            }`}
          />
          {index < stages.length - 1 && (
            <div
              className={`w-4 h-0.5 ${
                index < currentIndex ? "bg-[var(--aotake)]" : "bg-[var(--nezumi)]/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Current shuttle highlight
const CurrentShuttleHighlight = ({
  task,
  onStatusChange,
}: {
  task: ShuttleTask;
  onStatusChange: (newStatus: ShuttleStatus) => void;
}) => {
  const vehicle = task.assignedVehicleId ? getVehicleById(task.assignedVehicleId) : null;

  const getNextStatus = (): ShuttleStatus | null => {
    const flow: Record<ShuttleStatus, ShuttleStatus | null> = {
      not_departed: "heading",
      heading: "arrived",
      arrived: "boarded",
      boarded: "completed",
      completed: null,
    };
    return flow[task.shuttleStatus];
  };

  const nextStatus = getNextStatus();

  const buttonLabels: Record<ShuttleStatus, string> = {
    not_departed: "出発する",
    heading: "到着しました",
    arrived: "乗車確認",
    boarded: "完了にする",
    completed: "",
  };

  return (
    <div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)] animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShuttleIcon size={20} className="text-[var(--ai)]" />
          <span className="font-display font-semibold text-[var(--ai)]">現在対応中</span>
        </div>
        {task.guestArrivalNotified && (
          <span className="flex items-center gap-1 px-2 py-1 bg-[var(--kincha)]/20 text-[var(--kincha)] text-xs rounded-full animate-pulse">
            <BellIcon size={12} />
            到着通知
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="text-lg font-display font-bold text-[var(--sumi)]">
          {task.guestName}様
          <span className="ml-2 text-sm font-normal text-[var(--nezumi)]">
            {task.numberOfGuests}名
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--nezumi)] mt-1">
          <LocationIcon size={14} />
          <span>{task.pickupLocation}</span>
          <ArrowRightIcon size={14} />
          <span>{task.dropoffLocation}</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="relative mb-4 px-2">
        <div className="flex items-center justify-between">
          {["not_departed", "heading", "arrived", "boarded", "completed"].map((stage, index) => {
            const stages: ShuttleStatus[] = [
              "not_departed",
              "heading",
              "arrived",
              "boarded",
              "completed",
            ];
            const currentIndex = stages.indexOf(task.shuttleStatus);
            const stageLabels = ["未出発", "向かい中", "到着", "乗車", "完了"];

            return (
              <div key={stage} className="flex flex-col items-center z-10" style={{ flex: 1 }}>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    index <= currentIndex
                      ? index === currentIndex
                        ? "bg-[var(--ai)] ring-4 ring-[var(--ai)]/20"
                        : "bg-[var(--aotake)]"
                      : "bg-[var(--nezumi)]/20"
                  }`}
                >
                  {index < currentIndex && <CheckIcon size={12} className="text-white" />}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    index <= currentIndex
                      ? index === currentIndex
                        ? "text-[var(--ai)] font-medium"
                        : "text-[var(--aotake)]"
                      : "text-[var(--nezumi)]"
                  }`}
                >
                  {stageLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress line */}
        <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-[var(--nezumi)]/20 -z-0 mx-4" />
        <div
          className="absolute top-2.5 left-0 h-0.5 bg-[var(--aotake)] transition-all -z-0 mx-4"
          style={{
            width: `${
              (["not_departed", "heading", "arrived", "boarded", "completed"].indexOf(
                task.shuttleStatus,
              ) /
                4) *
              100
            }%`,
          }}
        />
      </div>

      {/* Vehicle info */}
      {vehicle && (
        <div className="flex items-center gap-2 text-sm text-[var(--nezumi)] mb-4">
          <CarIcon size={14} />
          <span>
            {vehicle.name} / {vehicle.licensePlate}
          </span>
        </div>
      )}

      {/* Status update button */}
      {nextStatus && (
        <button
          onClick={() => onStatusChange(nextStatus)}
          className="w-full py-4 bg-[var(--ai)] text-white rounded-xl font-display font-bold text-lg hover:bg-[var(--ai-deep)] active:scale-[0.98] transition-all shadow-lg"
        >
          {buttonLabels[task.shuttleStatus]}
        </button>
      )}
    </div>
  );
};

// Shuttle task card with swipe
const ShuttleTaskCard = ({
  task,
  onStatusChange,
  onExpand,
  isExpanded,
}: {
  task: ShuttleTask;
  onStatusChange: (newStatus: ShuttleStatus) => void;
  onExpand: () => void;
  isExpanded: boolean;
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);

  const vehicle = task.assignedVehicleId ? getVehicleById(task.assignedVehicleId) : null;

  const getNextStatus = (): ShuttleStatus | null => {
    const flow: Record<ShuttleStatus, ShuttleStatus | null> = {
      not_departed: "heading",
      heading: "arrived",
      arrived: "boarded",
      boarded: "completed",
      completed: null,
    };
    return flow[task.shuttleStatus];
  };

  const nextStatus = getNextStatus();

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
    if (deltaX < 0 && nextStatus && task.shuttleStatus !== "completed") {
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

  const buttonLabels: Record<ShuttleStatus, string> = {
    not_departed: "出発",
    heading: "到着",
    arrived: "乗車確認",
    boarded: "完了",
    completed: "",
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe action background */}
      {task.shuttleStatus !== "completed" && nextStatus && (
        <div
          className={`absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-[var(--aotake)] transition-opacity ${
            Math.abs(swipeOffset) > 30 ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: "120px" }}
        >
          <span className="text-white font-medium">{buttonLabels[task.shuttleStatus]}</span>
        </div>
      )}

      {/* Card content */}
      <div
        className={`shoji-panel border-l-3 transition-transform ${
          task.shuttleStatus === "completed"
            ? "border-l-[var(--aotake)] opacity-60"
            : "border-l-[var(--nezumi)]"
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
              <ClockIcon size={14} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--ai)]">
                {task.scheduledTime}
              </span>
              <ShuttleStatusBadge status={task.shuttleStatus} />
            </div>
            <ChevronRightIcon
              size={18}
              className={`text-[var(--nezumi)] transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>

          <div className="mb-2">
            <span className="font-display font-medium text-[var(--sumi)]">{task.guestName}様</span>
            <span className="ml-2 text-sm text-[var(--nezumi)]">{task.numberOfGuests}名</span>
            {task.guestArrivalNotified && (
              <span className="ml-2 text-xs text-[var(--kincha)]">到着通知あり</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--nezumi)]">
            <LocationIcon size={12} />
            <span>{task.pickupLocation}</span>
            <ArrowRightIcon size={12} />
            <span>{task.dropoffLocation}</span>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-[var(--shironeri-warm)] space-y-3 animate-slide-up">
              {/* Progress */}
              <div>
                <div className="text-xs text-[var(--nezumi)] mb-2">ステータス</div>
                <ShuttleProgressIndicator status={task.shuttleStatus} />
              </div>

              {/* Vehicle */}
              {vehicle && (
                <div className="flex items-center gap-2 text-sm">
                  <CarIcon size={14} className="text-[var(--nezumi)]" />
                  <span className="text-[var(--sumi)]">
                    {vehicle.name} / {vehicle.licensePlate}
                  </span>
                </div>
              )}

              {/* Notes */}
              {task.notes && (
                <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg text-sm text-[var(--sumi)]">
                  {task.notes}
                </div>
              )}

              {/* Action button */}
              {nextStatus && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(nextStatus);
                  }}
                  className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium"
                >
                  {buttonLabels[task.shuttleStatus]}にする
                </button>
              )}
            </div>
          )}
        </button>
      </div>
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
export const MobileShuttleList = () => {
  const [shuttleTasks, setShuttleTasks] = useState<ShuttleTask[]>(() =>
    mockShuttleTasks.filter((t) => t.assignedDriverId === CURRENT_DRIVER_ID),
  );
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Get current vehicle
  const currentVehicle = useMemo(() => {
    const currentTask = shuttleTasks.find(
      (t) => t.shuttleStatus !== "completed" && t.shuttleStatus !== "not_departed",
    );
    return currentTask?.assignedVehicleId ? getVehicleById(currentTask.assignedVehicleId) : null;
  }, [shuttleTasks]);

  // Get active task (in progress, not completed)
  const activeTask = useMemo(() => {
    return shuttleTasks.find(
      (t) => t.shuttleStatus !== "completed" && t.shuttleStatus !== "not_departed",
    );
  }, [shuttleTasks]);

  // Stats
  const stats = useMemo(() => {
    const total = shuttleTasks.length;
    const completed = shuttleTasks.filter((t) => t.shuttleStatus === "completed").length;
    return { total, completed };
  }, [shuttleTasks]);

  // Sorted tasks (active first, then pending, then completed)
  const sortedTasks = useMemo(() => {
    return [...shuttleTasks].sort((a, b) => {
      const statusOrder = (status: ShuttleStatus) => {
        if (status === "completed") return 3;
        if (status === "not_departed") return 2;
        return 1; // Active statuses
      };
      const orderDiff = statusOrder(a.shuttleStatus) - statusOrder(b.shuttleStatus);
      if (orderDiff !== 0) return orderDiff;
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });
  }, [shuttleTasks]);

  // Other tasks (excluding active)
  const otherTasks = sortedTasks.filter((t) => t.id !== activeTask?.id);

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: ShuttleStatus) => {
    setShuttleTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              shuttleStatus: newStatus,
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

  return (
    <div className="min-h-screen bg-[var(--shironeri)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--shironeri)]/80 backdrop-blur-sm border-b border-[var(--shironeri-warm)]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-display font-bold text-[var(--sumi)]">送迎タスク</h1>
              <p className="text-xs text-[var(--nezumi)]">
                {new Date().toLocaleDateString("ja-JP", {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </p>
            </div>
            {currentVehicle && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--ai)]/10 rounded-full">
                <CarIcon size={14} className="text-[var(--ai)]" />
                <span className="text-sm font-medium text-[var(--ai)]">{currentVehicle.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Progress summary */}
        <ProgressSummary completed={stats.completed} total={stats.total} />

        {/* Active task */}
        {activeTask && (
          <CurrentShuttleHighlight
            task={activeTask}
            onStatusChange={(newStatus) => handleStatusChange(activeTask.id, newStatus)}
          />
        )}

        {/* Other tasks */}
        {otherTasks.length > 0 && (
          <div>
            <h2 className="text-sm font-display font-medium text-[var(--nezumi)] mb-3">
              本日の送迎 ({otherTasks.length}件)
            </h2>
            <div className="space-y-3">
              {otherTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`animate-slide-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ShuttleTaskCard
                    task={task}
                    onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                    onExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    isExpanded={expandedTaskId === task.id}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {shuttleTasks.length === 0 && (
          <div className="shoji-panel p-8 text-center">
            <ShuttleIcon size={48} className="mx-auto text-[var(--nezumi)]/30 mb-3" />
            <p className="text-[var(--nezumi)]">本日の送迎タスクはありません</p>
          </div>
        )}
      </main>
    </div>
  );
};
