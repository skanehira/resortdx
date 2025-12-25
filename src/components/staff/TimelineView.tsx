import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type {
  UnifiedTask,
  UnifiedTaskStatus,
  Staff,
  ShuttleStatus,
  ShuttleMessageType,
  MealStatus,
  CelebrationItemCheck,
  CleaningChecklistItemType,
  EquipmentReport,
  RoomAmenity,
  RoomEquipment,
} from "../../types";
import { ClockIcon } from "../ui/Icons";
import { HousekeepingCard } from "./cards/HousekeepingCard";
import { MealCard } from "./cards/MealCard";
import { ShuttleCard } from "./cards/ShuttleCard";
import { CelebrationCard } from "./cards/CelebrationCard";
import { HelpRequestCard } from "./cards/HelpRequestCard";
import { EquipmentReportModal } from "./modals/EquipmentReportModal";

interface TimelineViewProps {
  tasks: UnifiedTask[];
  currentStaff: Staff;
  roomAmenities: Record<string, RoomAmenity[]>;
  roomEquipment: Record<string, RoomEquipment[]>;
  onStatusChange: (taskId: string, newStatus: UnifiedTaskStatus) => void;
  onToggleCleaningItem?: (taskId: string, item: CleaningChecklistItemType) => void;
  onMealStatusChange?: (taskId: string, newMealStatus: MealStatus) => void;
  onShuttleStatusChange?: (taskId: string, newShuttleStatus: ShuttleStatus) => void;
  onSendShuttleMessage?: (taskId: string, content: string, messageType: ShuttleMessageType) => void;
  onToggleCelebrationItem?: (taskId: string, item: CelebrationItemCheck["item"]) => void;
  onCelebrationReport?: (taskId: string, report: string) => void;
  onAcceptHelp?: (taskId: string) => void;
  onCompleteHelp?: (taskId: string) => void;
  onCancelHelp?: (taskId: string) => void;
  onEquipmentReport?: (roomId: string, report: EquipmentReport) => void;
  onMemoChange?: (taskId: string, memoType: "personal" | "shared", value: string | null) => void;
}

// 時刻を分に変換 (HH:MM -> 分)
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// タイムラインスロット（1時間単位）
interface TimeSlot {
  hour: number;
  label: string;
  tasks: UnifiedTask[];
}

export const TimelineView = ({
  tasks,
  currentStaff,
  roomAmenities,
  roomEquipment,
  onStatusChange,
  onToggleCleaningItem,
  onMealStatusChange,
  onShuttleStatusChange,
  onSendShuttleMessage,
  onToggleCelebrationItem,
  onCelebrationReport,
  onAcceptHelp,
  onCompleteHelp,
  onCancelHelp,
  onEquipmentReport,
  onMemoChange,
}: TimelineViewProps) => {
  const { t } = useTranslation("staff");

  // Equipment report modal state
  const [equipmentReportModal, setEquipmentReportModal] = useState<{
    isOpen: boolean;
    roomId: string;
    taskId: string;
  } | null>(null);

  // 現在時刻の取得
  const now = new Date();
  const currentHour = now.getHours();

  // 自分に割り当てられたタスク
  const myTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.assignedStaffId === currentStaff.id ||
        (task.type === "help_request" &&
          task.helpRequest &&
          (task.helpRequest.requesterId === currentStaff.id ||
            task.helpRequest.acceptedBy === currentStaff.id ||
            (task.helpRequest.helpStatus === "pending" &&
              (task.helpRequest.targetStaffIds === "all" ||
                (Array.isArray(task.helpRequest.targetStaffIds) &&
                  task.helpRequest.targetStaffIds.includes(currentStaff.id)))))),
    );
  }, [tasks, currentStaff.id]);

  // タイムスロットの生成（6:00〜23:00）
  const timeSlots = useMemo<TimeSlot[]>(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour <= 23; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      slots.push({
        hour,
        label: `${hourStr}:00`,
        tasks: myTasks.filter((task) => {
          const taskMinutes = timeToMinutes(task.scheduledTime);
          return taskMinutes >= hour * 60 && taskMinutes < (hour + 1) * 60;
        }),
      });
    }
    return slots;
  }, [myTasks]);

  // 進捗サマリー
  const completedCount = myTasks.filter((t) => t.status === "completed").length;
  const totalCount = myTasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // 時間帯ラベル
  const getTimeOfDay = (hour: number): string => {
    if (hour < 12) return t("schedule.morning");
    if (hour < 17) return t("schedule.afternoon");
    if (hour < 19) return t("schedule.evening");
    return t("schedule.night");
  };

  // 点検タスク完了時の設備報告ハンドラー
  const handleHousekeepingComplete = useCallback((taskId: string, roomId: string) => {
    setEquipmentReportModal({ isOpen: true, roomId, taskId });
  }, []);

  // 設備報告の送信
  const handleEquipmentReportSubmit = useCallback(
    (report: EquipmentReport) => {
      if (equipmentReportModal?.roomId) {
        onEquipmentReport?.(equipmentReportModal.roomId, report);
      }
      if (equipmentReportModal?.taskId) {
        onStatusChange(equipmentReportModal.taskId, "completed");
      }
      setEquipmentReportModal(null);
    },
    [equipmentReportModal, onEquipmentReport, onStatusChange],
  );

  // タスクカードのレンダリング
  const renderTaskCard = (task: UnifiedTask) => {
    switch (task.type) {
      case "housekeeping":
        return (
          <HousekeepingCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onToggleCleaningItem={onToggleCleaningItem}
            onRequestEquipmentReport={handleHousekeepingComplete}
            onMemoChange={onMemoChange}
          />
        );
      case "meal":
        return (
          <MealCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onMealStatusChange={onMealStatusChange}
            onMemoChange={onMemoChange}
          />
        );
      case "shuttle":
        return (
          <ShuttleCard
            key={task.id}
            task={task}
            currentStaffId={currentStaff.id}
            currentStaffName={currentStaff.name}
            onStatusChange={onStatusChange}
            onShuttleStatusChange={onShuttleStatusChange}
            onSendShuttleMessage={onSendShuttleMessage}
            onMemoChange={onMemoChange}
          />
        );
      case "celebration":
        return (
          <CelebrationCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onToggleCelebrationItem={onToggleCelebrationItem}
            onCompletionReport={onCelebrationReport}
            onMemoChange={onMemoChange}
          />
        );
      case "help_request":
        return (
          <HelpRequestCard
            key={task.id}
            task={task}
            currentStaffId={currentStaff.id}
            onStatusChange={onStatusChange}
            onAcceptHelp={onAcceptHelp}
            onCompleteHelp={onCompleteHelp}
            onCancelHelp={onCancelHelp}
            onMemoChange={onMemoChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--shironeri)] pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--nezumi)]">{t("taskList.todaysSchedule")}</p>
              <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                {t("taskList.timeline")}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display text-[var(--ai)]">
                {now.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="shoji-panel p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--nezumi)]">{t("taskList.todaysProgress")}</span>
              <span className="font-display font-semibold text-[var(--sumi)]">
                {completedCount}/{totalCount}
                {t("taskList.tasksCompleted")}
              </span>
            </div>
            <div className="h-2 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--aotake)] rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <div className="relative">
          {/* タイムスロット */}
          <div className="space-y-0">
            {timeSlots.map((slot, index) => {
              const isCurrent = slot.hour === currentHour;
              const timeOfDay = getTimeOfDay(slot.hour);
              const prevTimeOfDay = index > 0 ? getTimeOfDay(timeSlots[index - 1].hour) : "";
              const showTimeOfDayLabel = timeOfDay !== prevTimeOfDay;

              return (
                <div key={slot.hour}>
                  {/* 時間帯ラベル */}
                  {showTimeOfDayLabel && (
                    <div className="flex items-center gap-2 py-2">
                      <span className="text-xs font-medium text-[var(--nezumi)] bg-[var(--shironeri-warm)] px-2 py-0.5 rounded">
                        {timeOfDay}
                      </span>
                      <div className="flex-1 h-px bg-[var(--shironeri-warm)]" />
                    </div>
                  )}

                  {/* 時間スロット */}
                  <div
                    className={`flex items-stretch ${
                      isCurrent ? "bg-[var(--ai)]/5 rounded-lg" : ""
                    }`}
                  >
                    {/* 時刻ラベル */}
                    <div className="w-14 flex-shrink-0 py-2 pr-2 text-right">
                      <span
                        className={`text-sm font-display ${
                          isCurrent ? "text-[var(--ai)] font-semibold" : "text-[var(--nezumi)]"
                        }`}
                      >
                        {slot.label}
                      </span>
                    </div>

                    {/* タイムライン */}
                    <div className="w-4 flex-shrink-0 relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--shironeri-warm)] -translate-x-1/2" />
                      {slot.tasks.length > 0 && (
                        <div
                          className={`absolute left-1/2 top-4 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${
                            slot.tasks.every((t) => t.status === "completed")
                              ? "bg-[var(--aotake)]"
                              : slot.tasks.some((t) => t.status === "in_progress")
                                ? "bg-[var(--ai)]"
                                : "bg-[var(--nezumi)]"
                          }`}
                        />
                      )}
                      {isCurrent && (
                        <div className="absolute left-1/2 top-4 w-3 h-3 rounded-full -translate-x-1/2 bg-[var(--shu)] animate-pulse" />
                      )}
                    </div>

                    {/* タスク */}
                    <div className="flex-1 min-w-0 py-2 pl-2 space-y-3">
                      {slot.tasks.length === 0 ? (
                        <div className="h-8" />
                      ) : (
                        slot.tasks.map((task) => renderTaskCard(task))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* タスクがない場合 */}
          {myTasks.length === 0 && (
            <div className="shoji-panel p-8 text-center mt-4">
              <ClockIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
              <p className="text-[var(--nezumi)]">{t("schedule.noTasksScheduled")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Report Modal */}
      {equipmentReportModal?.isOpen && equipmentReportModal.roomId && (
        <EquipmentReportModal
          roomId={equipmentReportModal.roomId}
          amenities={roomAmenities[equipmentReportModal.roomId] || []}
          equipment={roomEquipment[equipmentReportModal.roomId] || []}
          staffId={currentStaff.id}
          onSubmit={handleEquipmentReportSubmit}
          onClose={() => setEquipmentReportModal(null)}
        />
      )}
    </div>
  );
};
