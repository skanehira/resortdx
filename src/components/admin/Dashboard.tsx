import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  mockReservations,
  mockTasks,
  mockDailyStats,
  getStaffById,
  getRoomName,
} from "../../data/mock";
import { TASK_CATEGORY_LABELS, type Task, type Reservation } from "../../types";
import { ReservationIcon, TaskIcon, GuestIcon, CelebrationIcon, AlertIcon } from "../ui/Icons";
import { TaskDetailModal } from "../shared/TaskDetailModal";

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
        <span className="font-medium whitespace-nowrap">{getRoomName(reservation.roomId)}</span>
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

// Task Row Component
interface TaskRowProps {
  task: Task;
  onClick?: (task: Task) => void;
  t: (key: string) => string;
}

const TaskRow = ({ task, onClick, t }: TaskRowProps) => {
  const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;
  const roomName = getRoomName(task.roomId);

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
        <span className="font-medium whitespace-nowrap">{roomName}</span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-[var(--shironeri-warm)] rounded whitespace-nowrap">
            {TASK_CATEGORY_LABELS[task.category]}
          </span>
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
        <div className="flex items-center gap-2 whitespace-nowrap">
          <StatusBadge status={task.status} t={t} />
          <PriorityBadge priority={task.priority} t={t} />
        </div>
      </td>
    </tr>
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

  const handleTaskUpdate = (
    taskId: string,
    updates: { scheduledTime: string; assignedStaffId: string | null },
  ) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
    // Update selectedTask to reflect changes
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const handleNotesChange = (taskId: string, notes: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, notes } : task)));
    // Update selectedTask to reflect changes
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, notes });
    }
  };

  const todayReservations = mockReservations.filter(
    (r) => r.status === "confirmed" || r.status === "checked_in",
  );

  const upcomingTasks = tasks
    .filter((t) => t.status !== "completed")
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
    .slice(0, 8);

  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "completed");

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
                <th className="w-20 whitespace-nowrap">{t("table.arrival")}</th>
                <th className="w-52 whitespace-nowrap">{t("table.room")}</th>
                <th className="whitespace-nowrap">{t("table.guestName")}</th>
                <th className="w-20 text-center whitespace-nowrap">{t("table.numberOfGuests")}</th>
                <th className="whitespace-nowrap">{t("table.notes")}</th>
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
                <th className="w-20 whitespace-nowrap">{t("table.time")}</th>
                <th className="w-52 whitespace-nowrap">{t("table.room")}</th>
                <th className="whitespace-nowrap">{t("table.task")}</th>
                <th className="w-20 whitespace-nowrap">{t("table.priority")}</th>
                <th className="w-36 whitespace-nowrap">{t("table.assignee")}</th>
                <th className="w-40 whitespace-nowrap">{t("table.status")}</th>
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
        onSave={handleTaskUpdate}
        onNotesChange={handleNotesChange}
        t={t}
      />
    </div>
  );
};
