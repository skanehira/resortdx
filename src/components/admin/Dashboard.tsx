import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  mockReservations,
  mockTasks,
  mockDailyStats,
  getStaffById,
  getReservationById,
  getRoomCleaningStatuses,
  getRoomName,
} from "../../data/mock";
import { ROOM_TYPE_LABELS, TASK_CATEGORY_LABELS, type Task, type Reservation } from "../../types";
import {
  ReservationIcon,
  TaskIcon,
  GuestIcon,
  CelebrationIcon,
  TimelineIcon,
  AlertIcon,
  RoomIcon,
  ClockIcon,
  CleaningIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";
import { RoomStatusMap } from "../shared/RoomStatusMap";
import { InlineTimeEdit } from "./shared/TimeEditForm";

// Status Badge Component
const StatusBadge = ({ status, t }: { status: Task["status"]; t: (key: string) => string }) => {
  const classes = {
    pending: "badge badge-pending",
    in_progress: "badge badge-in-progress",
    completed: "badge badge-completed",
  };
  const labels = {
    pending: t("status.pending"),
    in_progress: t("status.inProgress"),
    completed: t("status.completed"),
  };
  return <span className={classes[status]}>{labels[status]}</span>;
};

// Priority Badge Component
const PriorityBadge = ({
  priority,
  t,
}: {
  priority: Task["priority"];
  t: (key: string) => string;
}) => {
  if (priority === "normal") return null;
  const classes = {
    high: "badge badge-anniversary",
    urgent: "badge badge-urgent",
  };
  const labels = {
    high: t("priority.high"),
    urgent: t("priority.urgent"),
  };
  return <span className={classes[priority]}>{labels[priority]}</span>;
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  subValue?: string;
  accent?: "ai" | "aotake" | "kincha" | "shu";
}

const StatCard = ({ icon, label, value, subValue, accent = "ai" }: StatCardProps) => {
  const accentColors = {
    ai: "border-l-[var(--ai)]",
    aotake: "border-l-[var(--aotake)]",
    kincha: "border-l-[var(--kincha)]",
    shu: "border-l-[var(--shu)]",
  };

  return (
    <div className={`shoji-panel p-5 border-l-3 ${accentColors[accent]} animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--nezumi)] font-display tracking-wide">{label}</p>
          <p className="text-3xl font-display font-semibold mt-1 text-[var(--sumi)]">{value}</p>
          {subValue && <p className="text-xs text-[var(--nezumi-light)] mt-1">{subValue}</p>}
        </div>
        <div className="text-[var(--nezumi-light)] opacity-60">{icon}</div>
      </div>
    </div>
  );
};

// Reservation Row Component
const ReservationRow = ({
  reservation,
  t,
}: {
  reservation: Reservation;
  t: (key: string) => string;
}) => {
  const hasAnniversary = !!reservation.anniversary;

  return (
    <tr className={hasAnniversary ? "bg-[rgba(184,134,11,0.03)]" : ""}>
      <td className="font-display font-medium">{reservation.checkInTime}</td>
      <td>
        <span className="font-medium">{getRoomName(reservation.roomId)}</span>
        <span className="text-xs text-[var(--nezumi)] ml-2">
          {ROOM_TYPE_LABELS[reservation.roomType]}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {reservation.guestName}
          {hasAnniversary && (
            <span className="badge badge-anniversary">
              <CelebrationIcon size={12} />
              {reservation.anniversary?.type === "birthday"
                ? t("anniversary.birthday")
                : reservation.anniversary?.type === "wedding"
                  ? t("anniversary.wedding")
                  : t("anniversary.anniversary")}
            </span>
          )}
        </div>
      </td>
      <td className="text-center">
        {reservation.numberOfGuests}
        {t("dashboard.guestCount")}
      </td>
      <td>
        {reservation.specialRequests.length > 0 ? (
          <span className="text-sm text-[var(--sumi-light)]">
            {reservation.specialRequests[0]}
            {reservation.specialRequests.length > 1 &&
              ` +${reservation.specialRequests.length - 1}`}
          </span>
        ) : (
          <span className="text-[var(--nezumi-light)]">-</span>
        )}
      </td>
    </tr>
  );
};

// Task Detail Modal Component
const TaskDetailModal = ({
  task,
  isOpen,
  onClose,
  t,
  onTimeChange,
}: {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  onTimeChange?: (taskId: string, newTime: string) => void;
}) => {
  if (!task) return null;

  const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;
  const reservation = getReservationById(task.reservationId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("taskDetail.title")} size="md">
      <div className="space-y-4">
        {/* Task Title and Status */}
        <div>
          <h3 className="text-lg font-display font-semibold text-[var(--sumi)]">{task.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={task.status} t={t} />
            <PriorityBadge priority={task.priority} t={t} />
            {task.isAnniversaryRelated && (
              <span className="badge badge-anniversary">
                <CelebrationIcon size={12} />
                {t("taskDetail.anniversaryRelated")}
              </span>
            )}
          </div>
        </div>

        {/* Task Info */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[rgba(45,41,38,0.06)]">
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">{t("taskDetail.scheduledTime")}:</span>
            {onTimeChange ? (
              <InlineTimeEdit
                value={task.scheduledTime}
                onTimeChange={(newTime) => onTimeChange(task.id, newTime)}
              />
            ) : (
              <span className="font-medium">{task.scheduledTime}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RoomIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">{t("taskDetail.room")}:</span>
            <span className="font-medium">{getRoomName(task.roomId)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TaskIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">{t("taskDetail.category")}:</span>
            <span className="font-medium">{TASK_CATEGORY_LABELS[task.category]}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TimelineIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">{t("taskDetail.duration")}:</span>
            <span className="font-medium">
              {task.estimatedDuration}
              {t("taskDetail.minutes")}
            </span>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <p className="text-xs text-[var(--nezumi)] mb-1">{t("taskDetail.description")}</p>
            <p className="text-sm text-[var(--sumi-light)]">{task.description}</p>
          </div>
        )}

        {/* Assigned Staff */}
        <div>
          <p className="text-xs text-[var(--nezumi)] mb-2">{t("taskDetail.assignee")}</p>
          {staff ? (
            <div className="flex items-center gap-3 p-3 bg-[var(--shironeri-warm)] rounded">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: staff.avatarColor }}
              >
                {staff.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{staff.name}</p>
                <p className="text-xs text-[var(--nezumi)]">{staff.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--nezumi-light)]">{t("taskDetail.unassigned")}</p>
          )}
        </div>

        {/* Guest Info */}
        {reservation && (
          <div>
            <p className="text-xs text-[var(--nezumi)] mb-2">{t("taskDetail.guestInfo")}</p>
            <div className="p-3 bg-[var(--shironeri-warm)] rounded">
              <p className="font-medium">{reservation.guestName}</p>
              <p className="text-sm text-[var(--nezumi)]">
                {reservation.numberOfGuests}
                {t("dashboard.guestCount")} ・ {ROOM_TYPE_LABELS[reservation.roomType]}
              </p>
              {reservation.anniversary && (
                <div className="mt-2 p-2 bg-[rgba(184,134,11,0.1)] rounded">
                  <p className="text-sm text-[var(--kincha)] font-medium">
                    {reservation.anniversary.type === "birthday"
                      ? t("anniversary.birthday")
                      : t("anniversary.weddingAnniversary")}
                  </p>
                  <p className="text-xs text-[var(--sumi-light)]">
                    {reservation.anniversary.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Task Row Component
interface TaskRowProps {
  task: Task;
  onClick?: (task: Task) => void;
  t: (key: string) => string;
}

const TaskRow = ({ task, onClick, t }: TaskRowProps) => {
  const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;

  const priorityLabels = {
    normal: t("priority.normal"),
    high: t("priority.high"),
    urgent: t("priority.urgent"),
  };

  return (
    <tr
      className={`${task.isAnniversaryRelated ? "bg-[rgba(184,134,11,0.03)]" : ""} ${task.priority === "urgent" ? "bg-[rgba(199,62,58,0.03)]" : ""} ${onClick ? "cursor-pointer hover:bg-[var(--shironeri-warm)] transition-colors" : ""}`}
      onClick={() => onClick?.(task)}
    >
      <td className="font-display">{task.scheduledTime}</td>
      <td>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-[var(--shironeri-warm)] rounded">
            {TASK_CATEGORY_LABELS[task.category]}
          </span>
          <span className="font-medium">{task.title}</span>
          {task.isAnniversaryRelated && (
            <CelebrationIcon size={14} className="text-[var(--kincha)]" />
          )}
        </div>
      </td>
      <td>
        <span
          className={`text-sm ${task.priority === "urgent" ? "text-[var(--shu)] font-medium" : task.priority === "high" ? "text-[var(--kincha)]" : "text-[var(--nezumi)]"}`}
        >
          {priorityLabels[task.priority]}
        </span>
      </td>
      <td>
        {staff ? (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: staff.avatarColor }}
            >
              {staff.name.charAt(0)}
            </div>
            <span className="text-sm">{staff.name}</span>
          </div>
        ) : (
          <span className="text-[var(--nezumi-light)]">{t("taskDetail.unassigned")}</span>
        )}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} t={t} />
          <PriorityBadge priority={task.priority} t={t} />
        </div>
      </td>
    </tr>
  );
};

// Progress Ring Component
const ProgressRing = ({
  progress,
  size = 120,
  completedLabel,
}: {
  progress: number;
  size?: number;
  completedLabel: string;
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--shironeri-warm)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--aotake)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-semibold text-[var(--sumi)]">
          {Math.round(progress)}%
        </span>
        <span className="text-xs text-[var(--nezumi)]">{completedLabel}</span>
      </div>
    </div>
  );
};

// Main Dashboard Component
export const Dashboard = () => {
  const { t } = useTranslation("admin");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleTimeChange = (taskId: string, newTime: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, scheduledTime: newTime } : t)));
    // Also update the selected task if it's the one being edited
    setSelectedTask((prev) => (prev?.id === taskId ? { ...prev, scheduledTime: newTime } : prev));
  };

  const todayReservations = mockReservations.filter(
    (r) => r.status === "confirmed" || r.status === "checked_in",
  );

  const upcomingTasks = tasks
    .filter((t) => t.status !== "completed")
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
    .slice(0, 8);

  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "completed");

  const taskProgress = (mockDailyStats.completedTasks / mockDailyStats.totalTasks) * 100;

  const currentTime = new Date().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentDate = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-[var(--nezumi)] mt-2">{currentDate}</p>
        </div>
        <p className="text-3xl font-display text-[var(--ai)]">{currentTime}</p>
      </div>

      {/* Urgent Alerts */}
      {urgentTasks.length > 0 && (
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)] bg-[rgba(199,62,58,0.02)] animate-slide-up">
          <div className="flex items-center gap-3">
            <AlertIcon size={20} className="text-[var(--shu)]" />
            <div>
              <p className="font-display font-medium text-[var(--shu)]">
                {t("dashboard.urgentTasks")}: {urgentTasks.length}
              </p>
              <p className="text-sm text-[var(--sumi-light)]">
                {urgentTasks.map((t) => t.title).join("、")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stagger-1">
          <StatCard
            icon={<ReservationIcon size={28} />}
            label={t("dashboard.todaysCheckIn")}
            value={mockDailyStats.checkInsToday}
            subValue={t("dashboard.reservation")}
            accent="ai"
          />
        </div>
        <div className="stagger-2">
          <StatCard
            icon={<TaskIcon size={28} />}
            label={t("dashboard.todaysTasks")}
            value={mockDailyStats.totalTasks}
            subValue={`${t("dashboard.completed")}: ${mockDailyStats.completedTasks}`}
            accent="aotake"
          />
        </div>
        <div className="stagger-3">
          <StatCard
            icon={<GuestIcon size={28} />}
            label={t("dashboard.todaysGuests")}
            value={todayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0)}
            subValue={t("dashboard.guests")}
            accent="ai"
          />
        </div>
        <div className="stagger-4">
          <StatCard
            icon={<CelebrationIcon size={28} />}
            label={t("dashboard.anniversaryGuests")}
            value={mockDailyStats.anniversaryGuests}
            subValue={t("dashboard.groups")}
            accent="kincha"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Progress */}
        <div className="shoji-panel p-6 animate-slide-up stagger-1">
          <h2 className="text-lg font-display font-medium text-[var(--sumi)] mb-4 flex items-center gap-2">
            <TimelineIcon size={18} />
            {t("dashboard.taskProgress")}
          </h2>
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={taskProgress}
              size={140}
              completedLabel={t("dashboard.completed")}
            />
            <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center">
              <div>
                <p className="text-lg font-display font-semibold text-[var(--aotake)]">
                  {mockDailyStats.completedTasks}
                </p>
                <p className="text-xs text-[var(--nezumi)]">{t("dashboard.completed")}</p>
              </div>
              <div>
                <p className="text-lg font-display font-semibold text-[var(--ai)]">
                  {mockDailyStats.inProgressTasks}
                </p>
                <p className="text-xs text-[var(--nezumi)]">{t("dashboard.inProgress")}</p>
              </div>
              <div>
                <p className="text-lg font-display font-semibold text-[var(--nezumi)]">
                  {mockDailyStats.pendingTasks}
                </p>
                <p className="text-xs text-[var(--nezumi)]">{t("dashboard.pending")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Status Map */}
        <div className="lg:col-span-2 shoji-panel p-6 animate-slide-up stagger-2">
          <h2 className="text-lg font-display font-medium text-[var(--sumi)] mb-4 flex items-center gap-2">
            <CleaningIcon size={18} />
            {t("dashboard.roomStatus")}
          </h2>
          <RoomStatusMap
            roomStatuses={getRoomCleaningStatuses(tasks, getStaffById).map((info) => ({
              roomId: info.roomId,
              status: info.status,
              cleaningTask: info.cleaningTask,
              assignedStaff: info.assignedStaff,
            }))}
          />
        </div>
      </div>

      {/* Today's Reservations */}
      <div className="shoji-panel animate-slide-up stagger-3">
        <div className="p-4 border-b border-[rgba(45,41,38,0.06)]">
          <h2 className="text-lg font-display font-medium text-[var(--sumi)] flex items-center gap-2">
            <ReservationIcon size={18} />
            {t("dashboard.todaysReservations")}
          </h2>
        </div>
        <div className="table-container shadow-none">
          <table>
            <thead>
              <tr>
                <th className="w-20">{t("table.arrival")}</th>
                <th className="w-32">{t("table.room")}</th>
                <th>{t("table.guestName")}</th>
                <th className="w-20 text-center">{t("table.numberOfGuests")}</th>
                <th>{t("table.notes")}</th>
              </tr>
            </thead>
            <tbody>
              {todayReservations.map((reservation) => (
                <ReservationRow key={reservation.id} reservation={reservation} t={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="shoji-panel animate-slide-up stagger-3">
        <div className="p-4 border-b border-[rgba(45,41,38,0.06)] flex items-center justify-between">
          <h2 className="text-lg font-display font-medium text-[var(--sumi)] flex items-center gap-2">
            <TaskIcon size={18} />
            {t("dashboard.upcomingTasks")}
          </h2>
          <span className="text-sm text-[var(--nezumi)]">
            {upcomingTasks.length}
            {t("dashboard.incompleteTasks")}
          </span>
        </div>
        <div className="table-container shadow-none">
          <table>
            <thead>
              <tr>
                <th className="w-20">{t("table.time")}</th>
                <th>{t("table.task")}</th>
                <th className="w-20">{t("table.priority")}</th>
                <th className="w-36">{t("table.assignee")}</th>
                <th className="w-32">{t("table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTasks.map((task) => (
                <TaskRow key={task.id} task={task} onClick={handleTaskClick} t={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        t={t}
        onTimeChange={handleTimeChange}
      />

      {/* Quick Task Summary by Category */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(["cleaning", "meal_service", "bath", "pickup", "celebration", "turndown"] as const).map(
          (category) => {
            const categoryTasks = tasks.filter((t) => t.category === category);
            const completedCount = categoryTasks.filter((t) => t.status === "completed").length;
            return (
              <div
                key={category}
                className="shoji-panel p-4 text-center card-hover animate-slide-up"
              >
                <p className="text-2xl font-display font-semibold text-[var(--sumi)]">
                  {completedCount}/{categoryTasks.length}
                </p>
                <p className="text-xs text-[var(--nezumi)] mt-1">
                  {TASK_CATEGORY_LABELS[category]}
                </p>
                <div className="mt-2 h-1 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--aotake)] transition-all duration-300"
                    style={{
                      width: `${categoryTasks.length > 0 ? (completedCount / categoryTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};
