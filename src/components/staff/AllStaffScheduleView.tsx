import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UnifiedTask, Staff } from "../../types";
import { UNIFIED_TASK_TYPE_ICONS, UNIFIED_TASK_TYPE_LABELS } from "../../types";
import { getRoomName } from "../../data/mock";
import {
  ClockIcon,
  RoomIcon,
  CelebrationIcon,
  CheckCircleIcon,
  UserIcon,
  TimelineIcon,
} from "../ui/Icons";
import { MemoDisplay } from "../shared/MemoSection";

interface AllStaffScheduleViewProps {
  tasks: UnifiedTask[];
  allStaff: Staff[];
  currentStaff: Staff;
}

// ステータスバッジ
const StatusBadge = ({ status }: { status: UnifiedTask["status"] }) => {
  const { t } = useTranslation("staff");
  const config = {
    pending: { bg: "bg-[var(--nezumi)]/20", text: "text-[var(--nezumi)]" },
    in_progress: { bg: "bg-[var(--ai)]/20", text: "text-[var(--ai)]" },
    completed: { bg: "bg-[var(--aotake)]/20", text: "text-[var(--aotake)]" },
  };
  const labels = {
    pending: t("status.pending"),
    in_progress: t("status.inProgress"),
    completed: t("status.completed"),
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${config[status].bg} ${config[status].text}`}
    >
      {labels[status]}
    </span>
  );
};

// スタッフアバター
const StaffAvatar = ({ staff }: { staff: Staff }) => {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
      style={{ backgroundColor: staff.avatarColor }}
    >
      {staff.name.charAt(0)}
    </div>
  );
};

export const AllStaffScheduleView = ({
  tasks,
  allStaff,
  currentStaff,
}: AllStaffScheduleViewProps) => {
  const { t } = useTranslation("staff");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // 日付選択肢（今日を含む前後3日）
  const dateOptions = useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    const today = new Date();

    for (let i = -1; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const value = date.toISOString().split("T")[0];
      const isToday = i === 0;
      const label = isToday
        ? t("schedule.today")
        : date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
      dates.push({ value, label });
    }

    return dates;
  }, [t]);

  // スタッフごとにタスクをグループ化
  const staffTaskGroups = useMemo(() => {
    const groups: { staff: Staff; tasks: UnifiedTask[] }[] = [];

    for (const staff of allStaff) {
      const staffTasks = tasks
        .filter((task) => task.assignedStaffId === staff.id)
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

      if (staffTasks.length > 0 || staff.id === currentStaff.id) {
        groups.push({ staff, tasks: staffTasks });
      }
    }

    // 現在のスタッフを先頭に、その他はタスク数順
    return groups.sort((a, b) => {
      if (a.staff.id === currentStaff.id) return -1;
      if (b.staff.id === currentStaff.id) return 1;
      return b.tasks.length - a.tasks.length;
    });
  }, [tasks, allStaff, currentStaff.id]);

  // 全体の進捗
  const totalProgress = useMemo(() => {
    const allTasks = staffTaskGroups.flatMap((g) => g.tasks);
    const completed = allTasks.filter((t) => t.status === "completed").length;
    return {
      completed,
      total: allTasks.length,
      percentage: allTasks.length > 0 ? (completed / allTasks.length) * 100 : 0,
    };
  }, [staffTaskGroups]);

  return (
    <div className="min-h-screen bg-[var(--shironeri)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--nezumi)]">{t("taskList.todaysSchedule")}</p>
              <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                {t("taskList.allStaffSchedule")}
              </h1>
            </div>
          </div>

          {/* 日付選択 */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDate(option.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDate === option.value
                    ? "bg-[var(--ai)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--nezumi)]"
                }`}
              >
                <TimelineIcon size={14} className="inline mr-1" />
                {option.label}
              </button>
            ))}
          </div>

          {/* 全体進捗 */}
          <div className="shoji-panel p-3 mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--nezumi)]">{t("schedule.overallProgress")}</span>
              <span className="font-display font-semibold text-[var(--sumi)]">
                {totalProgress.completed}/{totalProgress.total}
                {t("schedule.itemsCompleted")}
              </span>
            </div>
            <div className="h-2 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--aotake)] rounded-full transition-all duration-500"
                style={{ width: `${totalProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* スタッフリスト */}
      <div className="p-4 space-y-4">
        {staffTaskGroups.map(({ staff, tasks: staffTasks }) => {
          const isMe = staff.id === currentStaff.id;
          const completedCount = staffTasks.filter((t) => t.status === "completed").length;
          const inProgressCount = staffTasks.filter((t) => t.status === "in_progress").length;

          return (
            <div key={staff.id} className="shoji-panel overflow-hidden">
              {/* スタッフヘッダー */}
              <div
                className={`p-4 flex items-center gap-3 ${
                  isMe ? "bg-[var(--ai)]/5" : "bg-[var(--shironeri-warm)]"
                }`}
              >
                <StaffAvatar staff={staff} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--sumi)]">
                      {staff.name}
                      {isMe && (
                        <span className="ml-1 text-xs text-[var(--ai)] font-normal">
                          {t("schedule.selfLabel")}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--nezumi)]">
                    <span>
                      <ClockIcon size={12} className="inline mr-1" />
                      {staff.shiftStart}〜{staff.shiftEnd}
                    </span>
                    <span>
                      {completedCount}/{staffTasks.length}
                      {t("schedule.itemsCompleted")}
                    </span>
                    {inProgressCount > 0 && (
                      <span className="text-[var(--ai)]">
                        {inProgressCount}
                        {t("schedule.itemsInProgress")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* タスクリスト */}
              <div className="p-3 space-y-2">
                {staffTasks.length === 0 ? (
                  <div className="text-center py-4 text-sm text-[var(--nezumi)]">
                    {t("taskList.noTasksAssigned")}
                  </div>
                ) : (
                  staffTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.status === "completed"
                          ? "bg-[var(--aotake)]/5 border-[var(--aotake)]/20"
                          : task.status === "in_progress"
                            ? "bg-[var(--ai)]/5 border-[var(--ai)]/30"
                            : "bg-white border-[var(--nezumi)]/10"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {/* アイコン */}
                        <span className="text-lg">{UNIFIED_TASK_TYPE_ICONS[task.type]}</span>

                        {/* コンテンツ */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={task.status} />
                            <span className="text-xs text-[var(--nezumi)]">
                              {UNIFIED_TASK_TYPE_LABELS[task.type]}
                            </span>
                            {task.isAnniversaryRelated && (
                              <CelebrationIcon size={12} className="text-[var(--kincha)]" />
                            )}
                            {task.status === "completed" && (
                              <CheckCircleIcon size={14} className="text-[var(--aotake)] ml-auto" />
                            )}
                          </div>
                          <p className="font-medium text-[var(--sumi)] truncate mt-1">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--nezumi)]">
                            {task.roomId && (
                              <span className="flex items-center gap-1">
                                <RoomIcon size={12} />
                                {getRoomName(task.roomId)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <ClockIcon size={12} />
                              {task.scheduledTime}
                            </span>
                          </div>

                          {/* 共有メモ（引継ぎ用） */}
                          {task.sharedMemo && (
                            <div className="mt-2">
                              <MemoDisplay
                                title={t("memo.sharedMemo")}
                                value={task.sharedMemo}
                                variant="shared"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}

        {/* スタッフがいない場合 */}
        {staffTaskGroups.length === 0 && (
          <div className="shoji-panel p-8 text-center">
            <UserIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
            <p className="text-[var(--nezumi)]">{t("schedule.noStaffSchedule")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
