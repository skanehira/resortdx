import { useState, useRef, useEffect } from "react";
import {
  mockTasks,
  mockStaff,
  mockShuttleTasks,
  getReservationById,
  getVehicleById,
} from "../../data/mockData";
import {
  TASK_CATEGORY_LABELS,
  SHUTTLE_STATUS_LABELS,
  type Task,
  type TaskStatus,
  type ShuttleTask,
  type ShuttleStatus,
} from "../../types";
import {
  TimelineIcon,
  RoomIcon,
  CelebrationIcon,
  CheckIcon,
  AlertIcon,
  ArrowLeftIcon,
  TaskIcon,
  ClockIcon,
  ShuttleIcon,
  LocationIcon,
  ArrowRightIcon,
} from "../ui/Icons";

// Simulating current logged-in staff (using driver STF004 to show shuttle tasks)
const CURRENT_STAFF = mockStaff[3]; // STF004 - 小林 誠 (driver)

// Unified schedule item type
type ScheduleItem = { type: "task"; data: Task } | { type: "shuttle"; data: ShuttleTask };

// Get time string from schedule item
const getItemTime = (item: ScheduleItem): string => {
  return item.type === "task" ? item.data.scheduledTime : item.data.scheduledTime;
};

// Get status for schedule item
const getItemStatus = (item: ScheduleItem): "pending" | "in_progress" | "completed" => {
  if (item.type === "task") {
    return item.data.status;
  }
  // Map shuttle status to task-like status
  const shuttleStatus = item.data.shuttleStatus;
  if (shuttleStatus === "completed") return "completed";
  if (shuttleStatus === "not_departed") return "pending";
  return "in_progress";
};

// Timeline Item Component
interface TimelineItemProps {
  task: Task;
  isActive: boolean;
  onClick: () => void;
}

const TimelineItem = ({ task, isActive, onClick }: TimelineItemProps) => {
  const reservation = getReservationById(task.reservationId);

  const statusStyles: Record<string, string> = {
    pending: "bg-[var(--shironeri)] border-[var(--nezumi-light)]",
    in_progress: "bg-[rgba(27,73,101,0.05)] border-[var(--ai)]",
    completed: "bg-[rgba(93,174,139,0.05)] border-[var(--aotake)]",
  };

  const nodeStyles: Record<string, string> = {
    pending: "bg-white border-[var(--nezumi-light)]",
    in_progress: "bg-[var(--ai)] border-[var(--ai)]",
    completed: "bg-[var(--aotake)] border-[var(--aotake)]",
  };

  return (
    <div className="flex gap-4 animate-slide-up">
      {/* Timeline Node */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 ${nodeStyles[task.status]} ${
            task.status === "in_progress" ? "ring-4 ring-[rgba(27,73,101,0.15)]" : ""
          }`}
        >
          {task.status === "completed" && <CheckIcon size={8} className="text-white m-0.5" />}
        </div>
        <div className="w-0.5 flex-1 bg-[rgba(45,41,38,0.1)] -mt-0.5" />
      </div>

      {/* Content */}
      <div
        onClick={onClick}
        className={`flex-1 mb-4 p-4 rounded-lg border-l-4 cursor-pointer transition-all active:scale-[0.99] ${statusStyles[task.status]} ${
          isActive ? "ring-2 ring-[var(--ai)]" : ""
        }`}
      >
        {/* Time */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-display font-semibold text-[var(--ai)]">
            {task.scheduledTime}
          </span>
          {task.priority === "urgent" && (
            <span className="badge badge-urgent">
              <AlertIcon size={10} />
              緊急
            </span>
          )}
          {task.isAnniversaryRelated && (
            <CelebrationIcon size={14} className="text-[var(--kincha)]" />
          )}
          {task.status === "completed" && <span className="badge badge-completed">完了</span>}
          {task.status === "in_progress" && <span className="badge badge-in-progress">作業中</span>}
        </div>

        {/* Title */}
        <h3
          className={`font-medium leading-tight ${
            task.status === "completed" ? "text-[var(--nezumi)] line-through" : "text-[var(--sumi)]"
          }`}
        >
          {task.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-2 mt-2 text-sm text-[var(--nezumi)]">
          <div className="flex items-center gap-1">
            <RoomIcon size={12} />
            <span>{task.roomNumber}号室</span>
          </div>
          <span>・</span>
          <span>{task.estimatedDuration}分</span>
          <span>・</span>
          <span>{TASK_CATEGORY_LABELS[task.category]}</span>
        </div>

        {/* Guest name if anniversary */}
        {reservation?.anniversary && (
          <div className="mt-2 text-sm text-[var(--kincha)]">
            {reservation.guestName}様 - {reservation.anniversary.description}
          </div>
        )}
      </div>
    </div>
  );
};

// Shuttle Timeline Item Component
interface ShuttleTimelineItemProps {
  shuttle: ShuttleTask;
  isActive: boolean;
  onClick: () => void;
}

const ShuttleTimelineItem = ({ shuttle, isActive, onClick }: ShuttleTimelineItemProps) => {
  const vehicle = shuttle.assignedVehicleId ? getVehicleById(shuttle.assignedVehicleId) : null;

  // Map shuttle status to display status
  const getDisplayStatus = (): "pending" | "in_progress" | "completed" => {
    if (shuttle.shuttleStatus === "completed") return "completed";
    if (shuttle.shuttleStatus === "not_departed") return "pending";
    return "in_progress";
  };

  const displayStatus = getDisplayStatus();

  const statusStyles: Record<string, string> = {
    pending: "bg-[var(--shironeri)] border-[var(--nezumi-light)]",
    in_progress: "bg-[rgba(27,73,101,0.05)] border-[var(--ai)]",
    completed: "bg-[rgba(93,174,139,0.05)] border-[var(--aotake)]",
  };

  const nodeStyles: Record<string, string> = {
    pending: "bg-white border-[var(--nezumi-light)]",
    in_progress: "bg-[var(--ai)] border-[var(--ai)]",
    completed: "bg-[var(--aotake)] border-[var(--aotake)]",
  };

  const shuttleStatusBadgeStyles: Record<ShuttleStatus, string> = {
    not_departed: "bg-gray-100 text-gray-600",
    heading: "bg-[var(--ai)]/10 text-[var(--ai)]",
    arrived: "bg-[var(--aotake)]/10 text-[var(--aotake)]",
    boarded: "bg-[var(--kincha)]/10 text-[var(--kincha)]",
    completed: "bg-[var(--aotake)]/10 text-[var(--aotake)]",
  };

  return (
    <div className="flex gap-4 animate-slide-up">
      {/* Timeline Node */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 ${nodeStyles[displayStatus]} ${
            displayStatus === "in_progress" ? "ring-4 ring-[rgba(27,73,101,0.15)]" : ""
          }`}
        >
          {displayStatus === "completed" && <CheckIcon size={8} className="text-white m-0.5" />}
        </div>
        <div className="w-0.5 flex-1 bg-[rgba(45,41,38,0.1)] -mt-0.5" />
      </div>

      {/* Content */}
      <div
        onClick={onClick}
        className={`flex-1 mb-4 p-4 rounded-lg border-l-4 cursor-pointer transition-all active:scale-[0.99] ${statusStyles[displayStatus]} ${
          isActive ? "ring-2 ring-[var(--ai)]" : ""
        }`}
      >
        {/* Time */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-display font-semibold text-[var(--ai)]">
            {shuttle.scheduledTime}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--ai)]/10 text-[var(--ai)] rounded text-xs font-medium">
            <ShuttleIcon className="w-3 h-3" />
            送迎
          </span>
          {shuttle.priority === "urgent" && (
            <span className="badge badge-urgent">
              <AlertIcon size={10} />
              緊急
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${shuttleStatusBadgeStyles[shuttle.shuttleStatus]}`}
          >
            {SHUTTLE_STATUS_LABELS[shuttle.shuttleStatus]}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-medium leading-tight ${
            displayStatus === "completed"
              ? "text-[var(--nezumi)] line-through"
              : "text-[var(--sumi)]"
          }`}
        >
          {shuttle.guestName}様 {shuttle.direction === "pickup" ? "お迎え" : "お送り"}
        </h3>

        {/* Route */}
        <div className="flex items-center gap-2 mt-2 text-sm text-[var(--nezumi)]">
          <div className="flex items-center gap-1">
            <LocationIcon className="w-3 h-3" />
            <span>{shuttle.pickupLocation}</span>
          </div>
          <ArrowRightIcon className="w-3 h-3" />
          <span>{shuttle.dropoffLocation}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mt-2 text-sm text-[var(--nezumi)]">
          <span>{shuttle.numberOfGuests}名</span>
          <span>・</span>
          <span>約{shuttle.estimatedDuration}分</span>
          {vehicle && (
            <>
              <span>・</span>
              <span>{vehicle.name}</span>
            </>
          )}
        </div>

        {/* Guest arrival notification */}
        {shuttle.guestArrivalNotified && (
          <div className="mt-2 text-sm text-[var(--aotake)] flex items-center gap-1">
            <CheckIcon className="w-3 h-3" />
            ゲスト到着済み
          </div>
        )}
      </div>
    </div>
  );
};

// Fullscreen Task Detail Component
interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
  onStatusChange: (newStatus: TaskStatus) => void;
}

const TaskDetailView = ({ task, onClose, onStatusChange }: TaskDetailViewProps) => {
  const reservation = getReservationById(task.reservationId);

  const statusConfig = {
    pending: { label: "未着手", class: "badge-pending" },
    in_progress: { label: "作業中", class: "badge-in-progress" },
    completed: { label: "完了", class: "badge-completed" },
  };

  const priorityConfig = {
    normal: { label: "通常", class: "text-[var(--nezumi)]" },
    high: { label: "優先", class: "text-[var(--kincha)]" },
    urgent: { label: "緊急", class: "text-[var(--shu)] font-medium" },
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--shironeri)] animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[var(--ai)] font-display"
          >
            <ArrowLeftIcon size={20} />
            <span>戻る</span>
          </button>
          <span className={`badge ${statusConfig[task.status].class}`}>
            {statusConfig[task.status].label}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-[calc(100vh-64px-100px)] pb-4">
        <div className="p-4 space-y-6">
          {/* Task Title and Time */}
          <div className="shoji-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-display font-semibold text-[var(--ai)]">
                    {task.scheduledTime}
                  </span>
                  {task.priority === "urgent" && (
                    <span className="badge badge-urgent">
                      <AlertIcon size={10} />
                      緊急
                    </span>
                  )}
                  {task.priority === "high" && (
                    <span className="badge badge-anniversary">優先</span>
                  )}
                </div>
                <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                  {task.title}
                </h1>
                {task.isAnniversaryRelated && (
                  <div className="flex items-center gap-1 mt-2 text-[var(--kincha)]">
                    <CelebrationIcon size={16} />
                    <span className="text-sm">記念日関連タスク</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <RoomIcon size={16} />
                <span className="text-xs">部屋番号</span>
              </div>
              <p className="text-lg font-display font-semibold text-[var(--sumi)]">
                {task.roomNumber}号室
              </p>
            </div>
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <ClockIcon size={16} />
                <span className="text-xs">所要時間</span>
              </div>
              <p className="text-lg font-display font-semibold text-[var(--sumi)]">
                {task.estimatedDuration}分
              </p>
            </div>
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <TaskIcon size={16} />
                <span className="text-xs">カテゴリ</span>
              </div>
              <p className="text-lg font-display font-semibold text-[var(--sumi)]">
                {TASK_CATEGORY_LABELS[task.category]}
              </p>
            </div>
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <AlertIcon size={16} />
                <span className="text-xs">優先度</span>
              </div>
              <p
                className={`text-lg font-display font-semibold ${priorityConfig[task.priority].class}`}
              >
                {priorityConfig[task.priority].label}
              </p>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="shoji-panel p-4">
              <p className="text-sm text-[var(--nezumi)] mb-2">タスク詳細</p>
              <p className="text-[var(--sumi-light)] leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* Guest Info */}
          {reservation && (
            <div className="shoji-panel p-4">
              <p className="text-sm text-[var(--nezumi)] mb-3">ゲスト情報</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--ai)] rounded-full flex items-center justify-center text-white font-display font-semibold text-lg">
                    {reservation.guestName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--sumi)]">{reservation.guestName}様</p>
                    <p className="text-sm text-[var(--nezumi)]">{reservation.numberOfGuests}名様</p>
                  </div>
                </div>

                {reservation.anniversary && (
                  <div className="p-4 bg-[rgba(184,134,11,0.08)] rounded-lg border-l-3 border-[var(--kincha)]">
                    <div className="flex items-center gap-2 mb-1">
                      <CelebrationIcon size={18} className="text-[var(--kincha)]" />
                      <p className="text-[var(--kincha)] font-display font-medium">
                        {reservation.anniversary.type === "birthday" ? "誕生日" : "結婚記念日"}
                      </p>
                    </div>
                    <p className="text-sm text-[var(--sumi-light)]">
                      {reservation.anniversary.description}
                    </p>
                    {reservation.anniversary.giftRequested && (
                      <p className="text-xs text-[var(--kincha)] mt-2">ギフト対応あり</p>
                    )}
                  </div>
                )}

                {reservation.specialRequests.length > 0 && (
                  <div>
                    <p className="text-xs text-[var(--nezumi)] mb-2">特記事項</p>
                    <div className="flex flex-wrap gap-2">
                      {reservation.specialRequests.map((req, idx) => (
                        <span
                          key={idx}
                          className="text-sm px-3 py-1.5 bg-[var(--shironeri-warm)] rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--shironeri)] border-t border-[rgba(45,41,38,0.06)] safe-area-pb">
        {task.status === "pending" && (
          <button
            onClick={() => onStatusChange("in_progress")}
            className="w-full py-4 text-base rounded-lg bg-[var(--ai)] text-white font-display font-medium flex items-center justify-center gap-2"
          >
            <TaskIcon size={20} />
            作業を開始する
          </button>
        )}
        {task.status === "in_progress" && (
          <div className="space-y-3">
            <button
              onClick={() => onStatusChange("completed")}
              className="w-full py-4 text-base rounded-lg bg-[var(--aotake)] text-white font-display font-medium flex items-center justify-center gap-2"
            >
              <CheckIcon size={20} />
              完了にする
            </button>
            <button
              onClick={() => onStatusChange("pending")}
              className="w-full py-3 text-base rounded-lg bg-white border border-[rgba(45,41,38,0.2)] text-[var(--sumi)] font-display font-medium"
            >
              作業を中断する
            </button>
          </div>
        )}
        {task.status === "completed" && (
          <div className="py-4 text-center text-[var(--aotake)] font-display flex items-center justify-center gap-2">
            <CheckIcon size={20} />
            このタスクは完了済みです
          </div>
        )}
      </div>
    </div>
  );
};

// Fullscreen Shuttle Detail Component
interface ShuttleDetailViewProps {
  shuttle: ShuttleTask;
  onClose: () => void;
  onStatusChange: (newStatus: ShuttleStatus) => void;
}

const ShuttleDetailView = ({ shuttle, onClose, onStatusChange }: ShuttleDetailViewProps) => {
  const vehicle = shuttle.assignedVehicleId ? getVehicleById(shuttle.assignedVehicleId) : null;

  const getDisplayStatus = (): "pending" | "in_progress" | "completed" => {
    if (shuttle.shuttleStatus === "completed") return "completed";
    if (shuttle.shuttleStatus === "not_departed") return "pending";
    return "in_progress";
  };

  const displayStatus = getDisplayStatus();

  const statusConfig = {
    pending: { label: "未出発", class: "badge-pending" },
    in_progress: { label: "進行中", class: "badge-in-progress" },
    completed: { label: "完了", class: "badge-completed" },
  };

  const priorityConfig = {
    normal: { label: "通常", class: "text-[var(--nezumi)]" },
    high: { label: "優先", class: "text-[var(--kincha)]" },
    urgent: { label: "緊急", class: "text-[var(--shu)] font-medium" },
  };

  // Get next status
  const getNextStatus = (): ShuttleStatus | null => {
    const statusOrder: ShuttleStatus[] = [
      "not_departed",
      "heading",
      "arrived",
      "boarded",
      "completed",
    ];
    const currentIndex = statusOrder.indexOf(shuttle.shuttleStatus);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  const nextStatusLabels: Record<ShuttleStatus, string> = {
    not_departed: "出発する",
    heading: "到着した",
    arrived: "乗車確認",
    boarded: "完了にする",
    completed: "",
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--shironeri)] animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[var(--ai)] font-display"
          >
            <ArrowLeftIcon size={20} />
            <span>戻る</span>
          </button>
          <span className={`badge ${statusConfig[displayStatus].class}`}>
            {SHUTTLE_STATUS_LABELS[shuttle.shuttleStatus]}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-[calc(100vh-64px-100px)] pb-4">
        <div className="p-4 space-y-6">
          {/* Task Title and Time */}
          <div className="shoji-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-display font-semibold text-[var(--ai)]">
                    {shuttle.scheduledTime}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--ai)]/10 text-[var(--ai)] rounded text-xs font-medium">
                    <ShuttleIcon className="w-3 h-3" />
                    送迎
                  </span>
                  {shuttle.priority === "urgent" && (
                    <span className="badge badge-urgent">
                      <AlertIcon size={10} />
                      緊急
                    </span>
                  )}
                  {shuttle.priority === "high" && (
                    <span className="badge badge-anniversary">優先</span>
                  )}
                </div>
                <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                  {shuttle.guestName}様 {shuttle.direction === "pickup" ? "お迎え" : "お送り"}
                </h1>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div className="shoji-panel p-4">
            <p className="text-sm text-[var(--nezumi)] mb-3">ルート</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[var(--sumi)]">
                  <LocationIcon className="w-4 h-4 text-[var(--ai)]" />
                  <span className="font-medium">{shuttle.pickupLocation}</span>
                </div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-[var(--nezumi)]" />
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2 text-[var(--sumi)]">
                  <span className="font-medium">{shuttle.dropoffLocation}</span>
                  <LocationIcon className="w-4 h-4 text-[var(--aotake)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Task Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <ShuttleIcon className="w-4 h-4" />
                <span className="text-xs">車両</span>
              </div>
              <p className="text-lg font-display font-semibold text-[var(--sumi)]">
                {vehicle?.name || "未割当"}
              </p>
            </div>
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <ClockIcon size={16} />
                <span className="text-xs">所要時間</span>
              </div>
              <p className="text-lg font-display font-semibold text-[var(--sumi)]">
                約{shuttle.estimatedDuration}分
              </p>
            </div>
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <TaskIcon size={16} />
                <span className="text-xs">人数</span>
              </div>
              <p className="text-lg font-display font-semibold text-[var(--sumi)]">
                {shuttle.numberOfGuests}名様
              </p>
            </div>
            <div className="shoji-panel p-4">
              <div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
                <AlertIcon size={16} />
                <span className="text-xs">優先度</span>
              </div>
              <p
                className={`text-lg font-display font-semibold ${priorityConfig[shuttle.priority].class}`}
              >
                {priorityConfig[shuttle.priority].label}
              </p>
            </div>
          </div>

          {/* Guest Info */}
          <div className="shoji-panel p-4">
            <p className="text-sm text-[var(--nezumi)] mb-3">ゲスト情報</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--ai)] rounded-full flex items-center justify-center text-white font-display font-semibold text-lg">
                {shuttle.guestName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[var(--sumi)]">{shuttle.guestName}様</p>
                <p className="text-sm text-[var(--nezumi)]">{shuttle.guestNameKana}</p>
              </div>
            </div>
            {shuttle.guestArrivalNotified && (
              <div className="mt-3 p-3 bg-[var(--aotake)]/10 rounded-lg border-l-3 border-[var(--aotake)]">
                <div className="flex items-center gap-2 text-[var(--aotake)]">
                  <CheckIcon className="w-4 h-4" />
                  <span className="font-medium">ゲスト到着済み</span>
                </div>
                {shuttle.guestNotifiedAt && (
                  <p className="text-sm text-[var(--nezumi)] mt-1">
                    通知時刻: {shuttle.guestNotifiedAt}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          {shuttle.notes && (
            <div className="shoji-panel p-4">
              <p className="text-sm text-[var(--nezumi)] mb-2">備考</p>
              <p className="text-[var(--sumi-light)] leading-relaxed">{shuttle.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--shironeri)] border-t border-[rgba(45,41,38,0.06)] safe-area-pb">
        {nextStatus && (
          <button
            onClick={() => onStatusChange(nextStatus)}
            className="w-full py-4 text-base rounded-lg bg-[var(--ai)] text-white font-display font-medium flex items-center justify-center gap-2"
          >
            <ShuttleIcon className="w-5 h-5" />
            {nextStatusLabels[nextStatus]}
          </button>
        )}
        {shuttle.shuttleStatus === "completed" && (
          <div className="py-4 text-center text-[var(--aotake)] font-display flex items-center justify-center gap-2">
            <CheckIcon size={20} />
            この送迎は完了済みです
          </div>
        )}
      </div>
    </div>
  );
};

// Hour marker component for current time
const CurrentTimeMarker = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (currentHour < 6 || currentHour > 22) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="text-sm font-display text-[var(--shu)]">
        {currentHour.toString().padStart(2, "0")}:{currentMinute.toString().padStart(2, "0")}
      </div>
      <div className="flex-1 h-0.5 bg-[var(--shu)]" />
      <div className="w-2 h-2 bg-[var(--shu)] rounded-full" />
    </div>
  );
};

// Main Mobile Schedule Component
export const MobileSchedule = () => {
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [tasks, setTasks] = useState<Task[]>(() =>
    mockTasks.filter((t) => t.assignedStaffId === CURRENT_STAFF.id),
  );
  const [shuttleTasks, setShuttleTasks] = useState<ShuttleTask[]>(() =>
    mockShuttleTasks.filter((t) => t.assignedDriverId === CURRENT_STAFF.id),
  );
  const timelineRef = useRef<HTMLDivElement>(null);

  // Create unified schedule items
  const scheduleItems: ScheduleItem[] = [
    ...tasks.map((t): ScheduleItem => ({ type: "task", data: t })),
    ...shuttleTasks.map((t): ScheduleItem => ({ type: "shuttle", data: t })),
  ];

  // Sort items by time
  const sortedItems = [...scheduleItems].sort((a, b) =>
    getItemTime(a).localeCompare(getItemTime(b)),
  );

  // Find current/next item for auto-scroll
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const currentOrNextItem = sortedItems.find(
    (item) => getItemTime(item) >= currentTime && getItemStatus(item) !== "completed",
  );

  // Auto scroll to current time on mount
  useEffect(() => {
    const currentHour = now.getHours();
    if (currentHour >= 6 && currentHour <= 22 && timelineRef.current) {
      const hourIndex = currentHour - 6;
      const scrollTarget = hourIndex * 100; // Approximate scroll position
      timelineRef.current.scrollTop = Math.max(0, scrollTarget - 100);
    }
  }, []);

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!selectedItem || selectedItem.type !== "task") return;

    const taskId = selectedItem.data.id;

    // Update the task in state
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
    );

    // Update the selected item to reflect the change
    setSelectedItem((prev) =>
      prev && prev.type === "task" ? { ...prev, data: { ...prev.data, status: newStatus } } : null,
    );
  };

  const handleShuttleStatusChange = (newStatus: ShuttleStatus) => {
    if (!selectedItem || selectedItem.type !== "shuttle") return;

    const shuttleId = selectedItem.data.id;

    // Update the shuttle task in state
    setShuttleTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === shuttleId ? { ...task, shuttleStatus: newStatus } : task,
      ),
    );

    // Update the selected item to reflect the change
    setSelectedItem((prev) =>
      prev && prev.type === "shuttle"
        ? { ...prev, data: { ...prev.data, shuttleStatus: newStatus } }
        : null,
    );
  };

  // Count completed items
  const completedCount = scheduleItems.filter((item) => getItemStatus(item) === "completed").length;
  const totalCount = scheduleItems.length;

  return (
    <div className="min-h-screen bg-[var(--shironeri)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                本日のスケジュール
              </h1>
              <p className="text-sm text-[var(--nezumi)]">
                {new Date().toLocaleDateString("ja-JP", {
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display text-[var(--ai)]">
                {completedCount}/{totalCount}
              </p>
              <p className="text-xs text-[var(--nezumi)]">完了</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--aotake)] rounded-full transition-all duration-500"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="p-4 pb-20">
        {/* Current time marker */}
        <CurrentTimeMarker />

        {/* Schedule Items Timeline */}
        <div className="relative">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => {
              const itemId = item.type === "task" ? item.data.id : item.data.id;
              const isActive =
                currentOrNextItem &&
                ((currentOrNextItem.type === "task" &&
                  item.type === "task" &&
                  currentOrNextItem.data.id === item.data.id) ||
                  (currentOrNextItem.type === "shuttle" &&
                    item.type === "shuttle" &&
                    currentOrNextItem.data.id === item.data.id));

              if (item.type === "task") {
                return (
                  <TimelineItem
                    key={`task-${itemId}`}
                    task={item.data}
                    isActive={!!isActive}
                    onClick={() => setSelectedItem(item)}
                  />
                );
              } else {
                return (
                  <ShuttleTimelineItem
                    key={`shuttle-${itemId}`}
                    shuttle={item.data}
                    isActive={!!isActive}
                    onClick={() => setSelectedItem(item)}
                  />
                );
              }
            })
          ) : (
            <div className="text-center py-12">
              <TimelineIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
              <p className="text-[var(--nezumi)]">本日のタスクはありません</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Fullscreen View */}
      {selectedItem && selectedItem.type === "task" && (
        <TaskDetailView
          task={selectedItem.data}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Shuttle Detail Fullscreen View */}
      {selectedItem && selectedItem.type === "shuttle" && (
        <ShuttleDetailView
          shuttle={selectedItem.data}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleShuttleStatusChange}
        />
      )}
    </div>
  );
};
