import { useState, useMemo } from "react";
import type {
  CelebrationTask,
  TaskStatus,
  CelebrationItem,
  CelebrationType,
  CelebrationItemCheck,
} from "../../types";
import { CELEBRATION_TYPE_LABELS, CELEBRATION_ITEM_LABELS } from "../../types";
import {
  mockCelebrationTasks,
  mockStaff,
  getStaffById,
  getRoomName,
  mockRooms,
} from "../../data/mock";
import {
  CelebrationIcon,
  ClockIcon,
  AlertIcon,
  CheckIcon,
  UserIcon,
  RoomIcon,
  CakeIcon,
  FlowerIcon,
  ChampagneIcon,
  DecorationIcon,
  MessageCardIcon,
  PlusIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";
import { EditableTimeDisplay } from "./shared/TimeEditForm";
import { StaffSelector } from "../shared/StaffSelector";

// Filter type for celebration tasks
type FilterType = "all" | "birthday" | "wedding_anniversary" | "other" | "pending";

// Status badge component
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const colorMap: Record<TaskStatus, string> = {
    pending: "bg-[var(--nezumi)] text-white",
    in_progress: "bg-[var(--ai)] text-white",
    completed: "bg-[var(--aotake)]/20 text-[var(--aotake)]",
  };

  const labelMap: Record<TaskStatus, string> = {
    pending: "未着手",
    in_progress: "準備中",
    completed: "完了",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  );
};

// Priority badge
const PriorityBadge = ({ priority }: { priority: CelebrationTask["priority"] }) => {
  if (priority === "normal") return null;

  const colorMap = {
    high: "bg-[var(--kincha)]/20 text-[var(--kincha)]",
    urgent: "bg-[var(--shu)]/20 text-[var(--shu)]",
  };

  const labelMap = {
    high: "優先",
    urgent: "緊急",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[priority]}`}>
      {labelMap[priority]}
    </span>
  );
};

// Celebration item icon mapping
const getItemIcon = (item: CelebrationItem, size = 16): React.ReactNode => {
  const iconMap: Record<CelebrationItem, React.ReactNode> = {
    cake: <CakeIcon size={size} />,
    flowers: <FlowerIcon size={size} />,
    champagne: <ChampagneIcon size={size} />,
    decoration: <DecorationIcon size={size} />,
    message_card: <MessageCardIcon size={size} />,
    other: <CelebrationIcon size={size} />,
  };
  return iconMap[item];
};

// Celebration type icon
const getCelebrationTypeIcon = (type: CelebrationTask["celebrationType"]) => {
  const iconMap = {
    birthday: <CakeIcon size={16} />,
    wedding_anniversary: <CelebrationIcon size={16} />,
    other: <CelebrationIcon size={16} />,
  };
  return iconMap[type];
};

// Summary stats component
const SummaryStats = ({
  total,
  completed,
  inProgress,
  pending,
}: {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--sumi)]">{total}</div>
      <div className="text-sm text-[var(--nezumi)]">本日のお祝い</div>
    </div>
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--aotake)]">{completed}</div>
      <div className="text-sm text-[var(--nezumi)]">完了</div>
    </div>
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--ai)]">{inProgress}</div>
      <div className="text-sm text-[var(--nezumi)]">準備中</div>
    </div>
    <div className="shoji-panel p-4">
      <div
        className={`text-2xl font-display font-bold ${
          pending > 0 ? "text-[var(--shu)]" : "text-[var(--nezumi)]"
        }`}
      >
        {pending}
      </div>
      <div className="text-sm text-[var(--nezumi)]">未着手</div>
    </div>
  </div>
);

// Filter tabs component
const FilterTabs = ({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}) => {
  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "birthday", label: "誕生日" },
    { key: "wedding_anniversary", label: "結婚記念日" },
    { key: "other", label: "その他" },
    { key: "pending", label: "未着手" },
  ];

  return (
    <div className="flex gap-2 p-1 bg-[var(--shironeri-warm)] rounded-lg overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-display whitespace-nowrap transition-colors ${
            activeFilter === tab.key
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          {tab.label}
          <span
            className={`text-xs ${
              activeFilter === tab.key
                ? tab.key === "pending" && counts[tab.key] > 0
                  ? "text-[var(--shu)]"
                  : "text-[var(--ai)]"
                : ""
            }`}
          >
            {counts[tab.key]}
          </span>
        </button>
      ))}
    </div>
  );
};

// Checklist progress component
const ChecklistProgress = ({ items }: { items: CelebrationTask["items"] }) => {
  const total = items.length;
  const checked = items.filter((i) => i.isChecked).length;
  const percentage = total > 0 ? (checked / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--nezumi)]/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--aotake)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-[var(--nezumi)]">
        {checked}/{total}
      </span>
    </div>
  );
};

// Celebration task card
const CelebrationTaskCard = ({
  task,
  onClick,
  isSelected,
}: {
  task: CelebrationTask;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left shoji-panel p-4 border-l-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-l-[var(--ai)] bg-[var(--ai)]/5"
          : task.status === "completed"
            ? "border-l-[var(--aotake)]"
            : task.status === "pending"
              ? "border-l-[var(--shu)]"
              : "border-l-[var(--kincha)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <ClockIcon size={14} className="text-[var(--kincha)]" />
          <span className="font-display font-semibold text-[var(--kincha)]">
            {task.executionTime}
          </span>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="flex items-center gap-1 text-[var(--kincha)]">
          {getCelebrationTypeIcon(task.celebrationType)}
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-center gap-2">
          <RoomIcon size={14} className="text-[var(--nezumi)]" />
          <span className="font-display font-medium text-[var(--sumi)]">
            {getRoomName(task.roomId)}
          </span>
          <span className="text-sm text-[var(--nezumi)]">{task.guestName}様</span>
        </div>
        <div className="text-sm text-[var(--sumi)] mt-1">{task.celebrationDescription}</div>
      </div>

      {/* Item icons */}
      <div className="flex items-center gap-2 mb-3">
        {task.items.map((item) => (
          <div
            key={item.item}
            className={`p-1.5 rounded ${
              item.isChecked
                ? "bg-[var(--aotake)]/20 text-[var(--aotake)]"
                : "bg-[var(--nezumi)]/10 text-[var(--nezumi)]"
            }`}
          >
            {getItemIcon(item.item, 14)}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <ChecklistProgress items={task.items} />
        <div className="flex items-center gap-2 text-xs text-[var(--nezumi)]">
          {staff ? (
            <span className="flex items-center gap-1">
              <UserIcon size={12} />
              {staff.name}
            </span>
          ) : (
            <span className="text-[var(--shu)]">担当未割当</span>
          )}
        </div>
      </div>
    </button>
  );
};

// Staff card for side panel
const StaffCard = ({
  staff,
  taskCount,
}: {
  staff: { id: string; name: string; avatarColor: string };
  taskCount: number;
}) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--shironeri-warm)] transition-colors">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
      style={{ backgroundColor: staff.avatarColor }}
    >
      {staff.name.charAt(0)}
    </div>
    <div className="flex-1">
      <div className="font-display font-medium text-[var(--sumi)] text-sm">{staff.name}</div>
      <div className="text-xs text-[var(--nezumi)]">
        {taskCount > 0 ? `${taskCount}件対応中` : "待機中"}
      </div>
    </div>
  </div>
);

// Task detail modal
const TaskDetailModal = ({
  task,
  onClose,
  onStatusChange,
  onItemToggle,
  onCompletionReportChange,
  onTimeChange,
  onAssigneeChange,
}: {
  task: CelebrationTask;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onItemToggle: (taskId: string, itemIndex: number) => void;
  onCompletionReportChange: (taskId: string, report: string) => void;
  onTimeChange: (taskId: string, newTime: string) => void;
  onAssigneeChange: (taskId: string, staffId: string | null) => void;
}) => {
  const [report, setReport] = useState(task.completionReport || "");

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    const flow: Record<TaskStatus, TaskStatus | null> = {
      pending: "in_progress",
      in_progress: "completed",
      completed: null,
    };
    return flow[current];
  };

  const nextStatus = getNextStatus(task.status);

  const statusButtonLabels: Record<TaskStatus, string> = {
    pending: "準備開始",
    in_progress: "完了",
    completed: "",
  };

  const handleComplete = () => {
    if (report.trim()) {
      onCompletionReportChange(task.id, report);
    }
    onStatusChange(task.id, "completed");
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="お祝い詳細"
      size="lg"
      footer={
        nextStatus && task.status !== "completed" ? (
          <button
            onClick={
              task.status === "in_progress"
                ? handleComplete
                : () => onStatusChange(task.id, nextStatus)
            }
            className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
          >
            {statusButtonLabels[task.status]}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {/* Status */}
        <div className="text-center">
          <StatusBadge status={task.status} />
          <div className="mt-3">
            <ChecklistProgress items={task.items} />
          </div>
        </div>

        {/* Guest info */}
        <div className="shoji-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <CelebrationIcon size={18} className="text-[var(--kincha)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">お祝い情報</span>
          </div>
          <div className="text-lg font-display font-medium text-[var(--sumi)]">
            {getRoomName(task.roomId)} {task.guestName}様
          </div>
          <div className="text-sm text-[var(--nezumi)]">{task.guestNameKana}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-[var(--kincha)]/10 text-[var(--kincha)] text-sm rounded">
              {CELEBRATION_TYPE_LABELS[task.celebrationType]}
            </span>
          </div>
          <div className="mt-2 text-[var(--sumi)]">{task.celebrationDescription}</div>
        </div>

        {/* Schedule */}
        <div className="shoji-panel p-4">
          <EditableTimeDisplay
            value={task.executionTime}
            onTimeChange={(newTime) => onTimeChange(task.id, newTime)}
            label="実施予定時刻"
            size="lg"
            accentColor="kincha"
          />
        </div>

        {/* Checklist */}
        <div className="shoji-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">
              準備チェックリスト
            </span>
          </div>
          <div className="space-y-2">
            {task.items.map((item, index) => (
              <button
                key={item.item}
                onClick={() => onItemToggle(task.id, index)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  item.isChecked
                    ? "border-[var(--aotake)] bg-[var(--aotake)]/5"
                    : "border-[var(--shironeri-warm)] hover:bg-[var(--shironeri-warm)]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.isChecked
                      ? "border-[var(--aotake)] bg-[var(--aotake)] text-white"
                      : "border-[var(--nezumi)]"
                  }`}
                >
                  {item.isChecked && <CheckIcon size={12} />}
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    item.isChecked ? "text-[var(--aotake)]" : "text-[var(--sumi)]"
                  }`}
                >
                  {getItemIcon(item.item)}
                  <span className="font-medium">{CELEBRATION_ITEM_LABELS[item.item]}</span>
                </div>
                {item.notes && (
                  <span className="text-xs text-[var(--nezumi)] ml-auto">{item.notes}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Staff assignment */}
        <div className="shoji-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">担当スタッフ</span>
          </div>
          <StaffSelector
            value={task.assignedStaffId}
            onChange={(staffId) => onAssigneeChange(task.id, staffId)}
            showUnassigned
            ariaLabel="担当者を選択"
          />
        </div>

        {/* Notes */}
        {task.notes && (
          <div className="shoji-panel p-4">
            <div className="text-sm text-[var(--nezumi)] mb-1">備考</div>
            <div className="text-[var(--sumi)]">{task.notes}</div>
          </div>
        )}

        {/* Completion report */}
        {task.status === "in_progress" && (
          <div className="shoji-panel p-4">
            <div className="text-sm font-medium text-[var(--sumi)] mb-2">完了報告</div>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="お客様の反応やその他特記事項を入力..."
              className="w-full p-3 border border-[var(--shironeri-warm)] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              rows={3}
            />
          </div>
        )}

        {/* Existing completion report */}
        {task.completionReport && task.status === "completed" && (
          <div className="shoji-panel p-4 bg-[var(--aotake)]/5">
            <div className="text-sm text-[var(--nezumi)] mb-1">完了報告</div>
            <div className="text-[var(--sumi)]">{task.completionReport}</div>
            {task.completedAt && (
              <div className="text-xs text-[var(--nezumi)] mt-2">完了時刻: {task.completedAt}</div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

// Create celebration modal
const CreateCelebrationModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (task: CelebrationTask) => void;
}) => {
  const [formData, setFormData] = useState({
    guestName: "",
    guestNameKana: "",
    roomId: "",
    celebrationType: "birthday" as CelebrationType,
    celebrationDescription: "",
    executionTime: "18:00",
    assignedStaffId: "",
    priority: "normal" as "normal" | "high" | "urgent",
    notes: "",
  });

  const [selectedItems, setSelectedItems] = useState<CelebrationItem[]>(["cake"]);

  const allItems: CelebrationItem[] = [
    "cake",
    "flowers",
    "champagne",
    "decoration",
    "message_card",
    "other",
  ];

  const toggleItem = (item: CelebrationItem) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName || !formData.roomId || !formData.executionTime) {
      return;
    }

    const items: CelebrationItemCheck[] = selectedItems.map((item) => ({
      item,
      isChecked: false,
    }));

    const newTask: CelebrationTask = {
      id: `CELEB${Date.now()}`,
      reservationId: `RES${Date.now()}`,
      guestName: formData.guestName,
      guestNameKana: formData.guestNameKana,
      roomId: formData.roomId,
      celebrationType: formData.celebrationType,
      celebrationDescription: formData.celebrationDescription,
      items,
      executionTime: formData.executionTime,
      status: "pending",
      assignedStaffId: formData.assignedStaffId || null,
      priority: formData.priority,
      notes: formData.notes || null,
      completionReport: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="お祝い対応を追加" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Guest Info */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">ゲスト情報</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                部屋 <span className="text-[var(--shu)]">*</span>
              </label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                required
              >
                <option value="">選択してください</option>
                {mockRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                お名前 <span className="text-[var(--shu)]">*</span>
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="例: 山田"
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--nezumi)] mb-1">フリガナ</label>
            <input
              type="text"
              value={formData.guestNameKana}
              onChange={(e) => setFormData({ ...formData, guestNameKana: e.target.value })}
              placeholder="例: ヤマダ"
              className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
            />
          </div>
        </div>

        {/* Celebration Type */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <CelebrationIcon size={18} className="text-[var(--kincha)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">お祝い内容</span>
          </div>
          <div>
            <label className="block text-sm text-[var(--nezumi)] mb-1">
              種類 <span className="text-[var(--shu)]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(CELEBRATION_TYPE_LABELS) as [CelebrationType, string][]).map(
                ([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, celebrationType: type })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.celebrationType === type
                        ? "bg-[var(--kincha)] text-white"
                        : "bg-[var(--shironeri-warm)] text-[var(--sumi)] hover:bg-[var(--kincha)]/10"
                    }`}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--nezumi)] mb-1">
              詳細 <span className="text-[var(--shu)]">*</span>
            </label>
            <input
              type="text"
              value={formData.celebrationDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  celebrationDescription: e.target.value,
                })
              }
              placeholder="例: 結婚10周年のお祝い"
              className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              required
            />
          </div>
        </div>

        {/* Items */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">準備アイテム</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(item)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedItems.includes(item)
                    ? "bg-[var(--aotake)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)] hover:bg-[var(--aotake)]/10"
                }`}
              >
                {getItemIcon(item, 16)}
                {CELEBRATION_ITEM_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">実施時刻</span>
          </div>
          <input
            type="time"
            value={formData.executionTime}
            onChange={(e) => setFormData({ ...formData, executionTime: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
            required
          />
        </div>

        {/* Assignment */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">担当スタッフ</label>
              <select
                value={formData.assignedStaffId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedStaffId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              >
                <option value="">未割当</option>
                {mockStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">優先度</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "normal" | "high" | "urgent",
                  })
                }
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              >
                <option value="normal">通常</option>
                <option value="high">優先</option>
                <option value="urgent">緊急</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-[var(--nezumi)] mb-1">備考</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="特記事項があれば入力..."
            className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30 resize-none"
            rows={3}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--kincha)] text-white rounded-lg font-display font-medium hover:bg-[var(--kincha-deep)] transition-colors"
        >
          お祝い対応を追加
        </button>
      </form>
    </Modal>
  );
};

// Main component
export const CelebrationManagement = () => {
  const [celebrationTasks, setCelebrationTasks] = useState<CelebrationTask[]>(mockCelebrationTasks);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Computed stats
  const stats = useMemo(() => {
    const total = celebrationTasks.length;
    const completed = celebrationTasks.filter((t) => t.status === "completed").length;
    const inProgress = celebrationTasks.filter((t) => t.status === "in_progress").length;
    const pending = celebrationTasks.filter((t) => t.status === "pending").length;
    return { total, completed, inProgress, pending };
  }, [celebrationTasks]);

  // Filter counts
  const filterCounts = useMemo(() => {
    return {
      all: celebrationTasks.length,
      birthday: celebrationTasks.filter((t) => t.celebrationType === "birthday").length,
      wedding_anniversary: celebrationTasks.filter(
        (t) => t.celebrationType === "wedding_anniversary",
      ).length,
      other: celebrationTasks.filter((t) => t.celebrationType === "other").length,
      pending: celebrationTasks.filter((t) => t.status === "pending").length,
    };
  }, [celebrationTasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...celebrationTasks];

    switch (filter) {
      case "birthday":
        tasks = tasks.filter((t) => t.celebrationType === "birthday");
        break;
      case "wedding_anniversary":
        tasks = tasks.filter((t) => t.celebrationType === "wedding_anniversary");
        break;
      case "other":
        tasks = tasks.filter((t) => t.celebrationType === "other");
        break;
      case "pending":
        tasks = tasks.filter((t) => t.status === "pending");
        break;
    }

    // Sort by execution time, with completed at the end
    return tasks.sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return a.executionTime.localeCompare(b.executionTime);
    });
  }, [celebrationTasks, filter]);

  const selectedTask = selectedTaskId
    ? celebrationTasks.find((t) => t.id === selectedTaskId)
    : null;

  // Staff with their task counts
  const staffWithTasks = useMemo(() => {
    const staffIds = [...new Set(celebrationTasks.map((t) => t.assignedStaffId).filter(Boolean))];
    return staffIds
      .map((id) => {
        const staff = mockStaff.find((s) => s.id === id);
        const taskCount = celebrationTasks.filter(
          (t) => t.assignedStaffId === id && t.status !== "completed",
        ).length;
        return staff ? { ...staff, taskCount } : null;
      })
      .filter(Boolean) as Array<{
      id: string;
      name: string;
      avatarColor: string;
      taskCount: number;
    }>;
  }, [celebrationTasks]);

  // Handlers
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

  const handleItemToggle = (taskId: string, itemIndex: number) => {
    setCelebrationTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              items: t.items.map((item, idx) =>
                idx === itemIndex ? { ...item, isChecked: !item.isChecked } : item,
              ),
            }
          : t,
      ),
    );
  };

  const handleCompletionReportChange = (taskId: string, report: string) => {
    setCelebrationTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completionReport: report } : t)),
    );
  };

  const handleCreateTask = (newTask: CelebrationTask) => {
    setCelebrationTasks((prev) => [...prev, newTask]);
  };

  const handleTimeChange = (taskId: string, newTime: string) => {
    setCelebrationTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, executionTime: newTime } : t)),
    );
  };

  const handleAssigneeChange = (taskId: string, staffId: string | null) => {
    setCelebrationTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedStaffId: staffId } : t)),
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--sumi)]">記念日・お祝い管理</h1>
          <p className="text-sm text-[var(--nezumi)] mt-1">本日のお祝い対応と準備状況を管理</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--kincha)] text-white rounded-lg font-display font-medium hover:bg-[var(--kincha-deep)] transition-colors"
        >
          <PlusIcon size={18} />
          新規作成
        </button>
      </div>

      {/* Summary stats */}
      <SummaryStats
        total={stats.total}
        completed={stats.completed}
        inProgress={stats.inProgress}
        pending={stats.pending}
      />

      {/* Alert for pending tasks */}
      {stats.pending > 0 && (
        <div className="flex items-center gap-3 p-4 bg-[var(--shu)]/10 border border-[var(--shu)]/30 rounded-lg">
          <AlertIcon size={20} className="text-[var(--shu)]" />
          <span className="text-[var(--shu)] font-medium">
            {stats.pending}件のお祝い対応が未着手です
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <FilterTabs activeFilter={filter} onFilterChange={setFilter} counts={filterCounts} />

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Task list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-display font-semibold text-[var(--sumi)]">お祝いタイムライン</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTasks.map((task) => (
              <CelebrationTaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTaskId(task.id)}
                isSelected={selectedTaskId === task.id}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="shoji-panel p-8 text-center">
                <CelebrationIcon size={40} className="mx-auto text-[var(--nezumi)]/50 mb-2" />
                <p className="text-[var(--nezumi)]">該当するお祝いタスクがありません</p>
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Staff */}
          <div className="shoji-panel p-4">
            <h3 className="font-display font-semibold text-[var(--sumi)] mb-3 flex items-center gap-2">
              <UserIcon size={18} />
              担当スタッフ
            </h3>
            <div className="space-y-1">
              {staffWithTasks.map((staff) => (
                <StaffCard key={staff.id} staff={staff} taskCount={staff.taskCount} />
              ))}
            </div>
          </div>

          {/* Upcoming celebrations */}
          {celebrationTasks.some((t) => t.status !== "completed") && (
            <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
              <div className="flex items-center gap-2 text-[var(--kincha)] mb-2">
                <CelebrationIcon size={16} />
                <span className="font-display font-semibold">本日のお祝い予定</span>
              </div>
              <div className="space-y-2">
                {celebrationTasks
                  .filter((t) => t.status !== "completed")
                  .sort((a, b) => a.executionTime.localeCompare(b.executionTime))
                  .map((t) => (
                    <div key={t.id} className="text-sm text-[var(--sumi)] flex items-start gap-2">
                      <span className="font-medium text-[var(--kincha)] shrink-0 w-12">
                        {t.executionTime}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block">{getRoomName(t.roomId)}</span>
                        <span className="text-[var(--nezumi)] text-xs">
                          {CELEBRATION_TYPE_LABELS[t.celebrationType]}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task detail modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={handleStatusChange}
          onItemToggle={handleItemToggle}
          onCompletionReportChange={handleCompletionReportChange}
          onTimeChange={handleTimeChange}
          onAssigneeChange={handleAssigneeChange}
        />
      )}

      {/* Create celebration modal */}
      {showCreateModal && (
        <CreateCelebrationModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};
