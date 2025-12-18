import { useState, useMemo } from "react";
import {
  mockTasks,
  mockTaskTemplates,
  getStaffById,
  getReservationById,
} from "../../data/mockData";
import {
  ROOM_TYPE_LABELS,
  TASK_CATEGORY_LABELS,
  type Task,
  type TaskStatus,
  type TaskCategory,
} from "../../types";
import {
  TaskIcon,
  RoomIcon,
  CelebrationIcon,
  AlertIcon,
  ClockIcon,
  TimelineIcon,
  SearchIcon,
  TemplateIcon,
  CheckIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";

// Status Badge Component
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const config = {
    pending: { label: "未着手", class: "badge-pending" },
    in_progress: { label: "作業中", class: "badge-in-progress" },
    completed: { label: "完了", class: "badge-completed" },
  };
  return <span className={`badge ${config[status].class}`}>{config[status].label}</span>;
};

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
  if (priority === "normal") return null;
  const config = {
    high: { label: "優先", class: "badge-anniversary" },
    urgent: { label: "緊急", class: "badge-urgent" },
  };
  return <span className={`badge ${config[priority].class}`}>{config[priority].label}</span>;
};

// Filter Tabs Component
interface FilterTabsProps {
  selected: TaskStatus | "all";
  onChange: (status: TaskStatus | "all") => void;
  counts: Record<TaskStatus | "all", number>;
}

const FilterTabs = ({ selected, onChange, counts }: FilterTabsProps) => {
  const tabs: { key: TaskStatus | "all"; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "pending", label: "未着手" },
    { key: "in_progress", label: "作業中" },
    { key: "completed", label: "完了" },
  ];

  return (
    <div className="flex gap-1 p-1 bg-[var(--shironeri-warm)] rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
            selected === tab.key
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          {tab.label}
          <span
            className={`ml-2 ${
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

// Task Detail Modal Component
const TaskDetailModal = ({
  task,
  isOpen,
  onClose,
}: {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!task) return null;

  const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;
  const reservation = getReservationById(task.reservationId);

  // Find matching template by category
  const template = mockTaskTemplates.find((t) => t.category === task.category);

  // Get related tasks for the same reservation
  const relatedTasks = mockTasks.filter((t) => t.reservationId === task.reservationId);
  const relatedTaskStats = {
    total: relatedTasks.length,
    completed: relatedTasks.filter((t) => t.status === "completed").length,
    in_progress: relatedTasks.filter((t) => t.status === "in_progress").length,
    pending: relatedTasks.filter((t) => t.status === "pending").length,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="タスク詳細" size="md">
      <div className="space-y-4">
        {/* Task Title and Status */}
        <div>
          <h3 className="text-lg font-display font-semibold text-[var(--sumi)]">{task.title}</h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.isAnniversaryRelated && (
              <span className="badge badge-anniversary">
                <CelebrationIcon size={12} />
                記念日関連
              </span>
            )}
          </div>
        </div>

        {/* Task Info */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[rgba(45,41,38,0.06)]">
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">予定時刻:</span>
            <span className="font-medium">{task.scheduledTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RoomIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">部屋:</span>
            <span className="font-medium">{task.roomNumber}号室</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TaskIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">カテゴリ:</span>
            <span className="font-medium">{TASK_CATEGORY_LABELS[task.category]}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TimelineIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">所要時間:</span>
            <span className="font-medium">{task.estimatedDuration}分</span>
          </div>
        </div>

        {/* Completion Time (for completed tasks) */}
        {task.status === "completed" && task.completedAt && (
          <div className="p-3 bg-[rgba(93,174,139,0.1)] rounded border border-[rgba(93,174,139,0.2)]">
            <div className="flex items-center gap-2">
              <CheckIcon size={16} className="text-[var(--aotake)]" />
              <span className="text-sm text-[var(--aotake)] font-medium">
                完了時刻: {task.completedAt}
              </span>
            </div>
          </div>
        )}

        {/* Template Info */}
        {template && (
          <div className="flex items-center gap-2 p-3 bg-[var(--shironeri-warm)] rounded">
            <TemplateIcon size={16} className="text-[var(--ai)]" />
            <span className="text-sm text-[var(--nezumi)]">テンプレート:</span>
            <span className="text-sm font-medium text-[var(--sumi)]">{template.name}</span>
          </div>
        )}

        {/* Description */}
        {task.description && (
          <div>
            <p className="text-xs text-[var(--nezumi)] mb-1">説明</p>
            <p className="text-sm text-[var(--sumi-light)]">{task.description}</p>
          </div>
        )}

        {/* Assigned Staff */}
        <div>
          <p className="text-xs text-[var(--nezumi)] mb-2">担当者</p>
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
            <p className="text-sm text-[var(--nezumi-light)]">未割当</p>
          )}
        </div>

        {/* Guest Info */}
        {reservation && (
          <div>
            <p className="text-xs text-[var(--nezumi)] mb-2">ゲスト情報</p>
            <div className="p-3 bg-[var(--shironeri-warm)] rounded">
              <p className="font-medium">{reservation.guestName}</p>
              <p className="text-sm text-[var(--nezumi)]">
                {reservation.numberOfGuests}名 ・ {ROOM_TYPE_LABELS[reservation.roomType]}
              </p>
              {reservation.anniversary && (
                <div className="mt-2 p-2 bg-[rgba(184,134,11,0.1)] rounded">
                  <p className="text-sm text-[var(--kincha)] font-medium">
                    {reservation.anniversary.type === "birthday" ? "誕生日" : "結婚記念日"}
                  </p>
                  <p className="text-xs text-[var(--sumi-light)]">
                    {reservation.anniversary.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Task Stats */}
        <div>
          <p className="text-xs text-[var(--nezumi)] mb-2">この予約のタスク進捗</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
              <p className="text-lg font-display font-semibold text-[var(--aotake)]">
                {relatedTaskStats.completed}
              </p>
              <p className="text-xs text-[var(--nezumi)]">完了</p>
            </div>
            <div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
              <p className="text-lg font-display font-semibold text-[var(--ai)]">
                {relatedTaskStats.in_progress}
              </p>
              <p className="text-xs text-[var(--nezumi)]">作業中</p>
            </div>
            <div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
              <p className="text-lg font-display font-semibold text-[var(--nezumi)]">
                {relatedTaskStats.pending}
              </p>
              <p className="text-xs text-[var(--nezumi)]">未着手</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Task Row Component
interface TaskRowProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskRow = ({ task, onClick }: TaskRowProps) => {
  const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;
  const reservation = getReservationById(task.reservationId);

  const priorityLabels = {
    normal: "通常",
    high: "優先",
    urgent: "緊急",
  };

  return (
    <tr
      onClick={() => onClick(task)}
      className={`cursor-pointer hover:bg-[var(--shironeri-warm)] transition-colors ${
        task.isAnniversaryRelated ? "bg-[rgba(184,134,11,0.03)]" : ""
      } ${task.priority === "urgent" ? "bg-[rgba(199,62,58,0.03)]" : ""}`}
    >
      <td className="font-display">{task.scheduledTime}</td>
      <td>
        <div className="flex items-center gap-2">
          <span className="font-medium">{task.roomNumber}号室</span>
        </div>
      </td>
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
          className={`text-sm ${
            task.priority === "urgent"
              ? "text-[var(--shu)] font-medium"
              : task.priority === "high"
                ? "text-[var(--kincha)]"
                : "text-[var(--nezumi)]"
          }`}
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
          <span className="text-[var(--nezumi-light)]">未割当</span>
        )}
      </td>
      <td>
        {reservation && (
          <span className="text-sm text-[var(--sumi-light)]">{reservation.guestName}</span>
        )}
      </td>
      <td>
        <StatusBadge status={task.status} />
      </td>
    </tr>
  );
};

// Main Task List Component
export const TaskHistory = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...mockTasks];

    // Status filter
    if (statusFilter !== "all") {
      tasks = tasks.filter((t) => t.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      tasks = tasks.filter((t) => t.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.roomNumber.includes(query) ||
          t.description?.toLowerCase().includes(query),
      );
    }

    // Sort by scheduled time
    return tasks.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [statusFilter, categoryFilter, searchQuery]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  // Stats
  const counts: Record<TaskStatus | "all", number> = {
    all: mockTasks.length,
    pending: mockTasks.filter((t) => t.status === "pending").length,
    in_progress: mockTasks.filter((t) => t.status === "in_progress").length,
    completed: mockTasks.filter((t) => t.status === "completed").length,
  };

  const urgentCount = mockTasks.filter(
    (t) => t.priority === "urgent" && t.status !== "completed",
  ).length;

  const categories: { key: TaskCategory | "all"; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "cleaning", label: "清掃" },
    { key: "meal_service", label: "食事" },
    { key: "bath", label: "温泉" },
    { key: "pickup", label: "送迎" },
    { key: "celebration", label: "記念日" },
    { key: "turndown", label: "ターンダウン" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
            タスク一覧
          </h1>
          <p className="text-sm text-[var(--nezumi)] mt-2">
            本日のすべてのタスクを確認・管理します
          </p>
        </div>
      </div>

      {/* Urgent Alert */}
      {urgentCount > 0 && (
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)] bg-[rgba(199,62,58,0.02)]">
          <div className="flex items-center gap-3">
            <AlertIcon size={20} className="text-[var(--shu)]" />
            <div>
              <p className="font-display font-medium text-[var(--shu)]">
                緊急タスク: {urgentCount}件
              </p>
              <p className="text-sm text-[var(--sumi-light)]">対応が必要な緊急タスクがあります</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">{counts.all}</p>
          <p className="text-sm text-[var(--nezumi)]">総タスク数</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--nezumi-light)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">{counts.pending}</p>
          <p className="text-sm text-[var(--nezumi)]">未着手</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
          <p className="text-2xl font-display font-semibold text-[var(--ai)]">
            {counts.in_progress}
          </p>
          <p className="text-sm text-[var(--nezumi)]">作業中</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
          <p className="text-2xl font-display font-semibold text-[var(--aotake)]">
            {counts.completed}
          </p>
          <p className="text-sm text-[var(--nezumi)]">完了</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Status Filter */}
        <FilterTabs selected={statusFilter} onChange={setStatusFilter} counts={counts} />

        {/* Category and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  categoryFilter === cat.key
                    ? "bg-[var(--ai)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)] hover:bg-[rgba(27,73,101,0.1)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <SearchIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--nezumi-light)]"
            />
            <input
              type="text"
              placeholder="タスクを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[rgba(45,41,38,0.12)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--ai)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="shoji-panel">
        <div className="table-container shadow-none">
          <table>
            <thead>
              <tr>
                <th className="w-20">時刻</th>
                <th className="w-24">部屋</th>
                <th>タスク</th>
                <th className="w-20">優先度</th>
                <th className="w-36">担当者</th>
                <th className="w-32">ゲスト</th>
                <th className="w-24">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <TaskRow key={task.id} task={task} onClick={handleTaskClick} />
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <TaskIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
              <p className="text-[var(--nezumi)]">
                {searchQuery ? "検索条件に一致するタスクがありません" : "タスクがありません"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};
