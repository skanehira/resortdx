import { useState, useMemo } from "react";
import type {
  MealTask,
  MealProgressStatus,
  MealDisplayStatus,
  MealOrderNotification,
  MealType,
  CourseType,
  DietaryRestriction,
} from "../../types";
import {
  MEAL_STATUS_LABELS,
  MEAL_TYPE_LABELS,
  COURSE_TYPE_LABELS,
  DIETARY_RESTRICTION_LABELS,
  ORDER_TYPE_LABELS,
} from "../../types";
import {
  mockMealTasks,
  mockMealOrderNotifications,
  mockStaff,
  getStaffById,
  getRoomName,
  mockRooms,
} from "../../data/mock";
import { StaffSelector } from "../shared/StaffSelector";
import {
  MealIcon,
  ClockIcon,
  AlertIcon,
  UserIcon,
  AllergyIcon,
  NotificationBadgeIcon,
  CelebrationIcon,
  RoomIcon,
  PassengerIcon,
  PlusIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";
import { EditableTimeDisplay } from "./shared/TimeEditForm";

// Filter type for meal tasks
type FilterType = "all" | "breakfast" | "dinner" | "room_service" | "needs_check";

// Meal status badge component
const MealStatusBadge = ({ status }: { status: MealDisplayStatus }) => {
  const colorMap: Record<MealDisplayStatus, string> = {
    preparing: "bg-[var(--nezumi)] text-white",
    serving: "bg-[var(--ai)] text-white",
    completed: "bg-[var(--aotake)]/20 text-[var(--aotake)]",
    needs_check: "bg-[var(--shu)] text-white",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}>
      {MEAL_STATUS_LABELS[status]}
    </span>
  );
};

// Priority badge
const PriorityBadge = ({ priority }: { priority: MealTask["priority"] }) => {
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

// 4-stage progress indicator
const MealProgressIndicator = ({
  status,
  needsCheck,
}: {
  status: MealProgressStatus;
  needsCheck: boolean;
}) => {
  const stages: MealProgressStatus[] = ["preparing", "serving", "completed"];
  const currentIndex = stages.indexOf(status);

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentIndex
                ? index === currentIndex
                  ? needsCheck
                    ? "bg-[var(--shu)]"
                    : "bg-[var(--ai)]"
                  : "bg-[var(--aotake)]"
                : "bg-[var(--nezumi)]/30"
            }`}
          />
          {index < stages.length - 1 && (
            <div
              className={`w-3 h-0.5 ${
                index < currentIndex ? "bg-[var(--aotake)]" : "bg-[var(--nezumi)]/30"
              }`}
            />
          )}
        </div>
      ))}
      {needsCheck && <AlertIcon size={12} className="ml-1 text-[var(--shu)]" />}
    </div>
  );
};

// Summary stats component
const SummaryStats = ({
  total,
  completed,
  serving,
  preparing,
  needsCheck,
}: {
  total: number;
  completed: number;
  serving: number;
  preparing: number;
  needsCheck: number;
}) => (
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--sumi)]">{total}</div>
      <div className="text-sm text-[var(--nezumi)]">本日の配膳</div>
    </div>
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--aotake)]">{completed}</div>
      <div className="text-sm text-[var(--nezumi)]">完了</div>
    </div>
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--ai)]">{serving}</div>
      <div className="text-sm text-[var(--nezumi)]">配膳中</div>
    </div>
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--nezumi)]">{preparing}</div>
      <div className="text-sm text-[var(--nezumi)]">準備中</div>
    </div>
    <div className="shoji-panel p-4">
      <div
        className={`text-2xl font-display font-bold ${
          needsCheck > 0 ? "text-[var(--shu)]" : "text-[var(--nezumi)]"
        }`}
      >
        {needsCheck}
      </div>
      <div className="text-sm text-[var(--nezumi)]">再確認要</div>
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
    { key: "breakfast", label: "朝食" },
    { key: "dinner", label: "夕食" },
    { key: "room_service", label: "部屋食" },
    { key: "needs_check", label: "再確認要" },
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
                ? tab.key === "needs_check" && counts[tab.key] > 0
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

// Order notification card
const OrderNotificationCard = ({
  notification,
  onMarkRead,
}: {
  notification: MealOrderNotification;
  onMarkRead: (id: string) => void;
}) => (
  <div
    className={`p-3 rounded-lg border transition-all ${
      notification.isRead
        ? "bg-white border-[var(--shironeri-warm)]"
        : "bg-[var(--kincha)]/5 border-[var(--kincha)]/30"
    }`}
  >
    <div className="flex items-start justify-between gap-2 mb-1">
      <span className="px-2 py-0.5 text-xs font-medium bg-[var(--ai)]/10 text-[var(--ai)] rounded-full whitespace-nowrap shrink-0">
        {ORDER_TYPE_LABELS[notification.orderType]}
      </span>
      <span className="text-sm font-medium text-[var(--sumi)] flex-1 min-w-0 text-right">
        {getRoomName(notification.roomId)}
      </span>
      {!notification.isRead && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="text-xs text-[var(--ai)] hover:underline whitespace-nowrap shrink-0"
        >
          既読
        </button>
      )}
    </div>
    <div className="text-sm text-[var(--sumi)]">{notification.content}</div>
    <div className="text-xs text-[var(--nezumi)] mt-1">{notification.guestName}様</div>
  </div>
);

// Meal task card
const MealTaskCard = ({
  task,
  onClick,
  isSelected,
}: {
  task: MealTask;
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
          : task.mealStatus === "completed"
            ? "border-l-[var(--aotake)]"
            : task.needsCheck
              ? "border-l-[var(--shu)]"
              : task.mealStatus === "serving"
                ? "border-l-[var(--ai)]"
                : "border-l-[var(--nezumi)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <ClockIcon size={14} className="text-[var(--ai)]" />
          <span className="font-display font-semibold text-[var(--ai)]">{task.scheduledTime}</span>
          <MealStatusBadge status={task.needsCheck ? "needs_check" : task.mealStatus} />
          <PriorityBadge priority={task.priority} />
        </div>
        {task.isAnniversaryRelated && (
          <CelebrationIcon size={16} className="text-[var(--kincha)]" />
        )}
      </div>

      <div className="mb-2">
        <div className="flex items-center gap-2">
          <RoomIcon size={14} className="text-[var(--nezumi)]" />
          <span className="font-display font-medium text-[var(--sumi)]">
            {getRoomName(task.roomId)}
          </span>
          <span className="text-sm text-[var(--nezumi)]">{task.guestName}様</span>
          <span className="text-sm text-[var(--nezumi)]">{task.guestCount}名</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-[var(--nezumi)] mb-3">
        <span className="px-2 py-0.5 bg-[var(--shironeri-warm)] rounded">
          {MEAL_TYPE_LABELS[task.mealType]}
        </span>
        <span className="px-2 py-0.5 bg-[var(--shironeri-warm)] rounded">
          {COURSE_TYPE_LABELS[task.courseType]}
        </span>
      </div>

      {task.dietaryRestrictions.length > 0 && (
        <div className="flex items-center gap-1 mb-3 text-[var(--shu)]">
          <AllergyIcon size={14} />
          <span className="text-xs font-medium">
            {task.dietaryRestrictions.map((r) => DIETARY_RESTRICTION_LABELS[r]).join(", ")}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <MealProgressIndicator status={task.mealStatus} needsCheck={task.needsCheck} />
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
  onToggleNeedsCheck,
  onTimeChange,
}: {
  task: MealTask;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: MealProgressStatus) => void;
  onToggleNeedsCheck: (taskId: string) => void;
  onTimeChange: (taskId: string, newTime: string) => void;
}) => {
  const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;

  const getNextStatus = (current: MealProgressStatus): MealProgressStatus | null => {
    const flow: Record<MealProgressStatus, MealProgressStatus | null> = {
      preparing: "serving",
      serving: "completed",
      completed: null,
    };
    return flow[current];
  };

  const nextStatus = getNextStatus(task.mealStatus);

  const statusButtonLabels: Record<MealProgressStatus, string> = {
    preparing: "配膳開始",
    serving: "完了",
    completed: "",
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="配膳詳細"
      size="lg"
      footer={
        nextStatus && task.mealStatus !== "completed" ? (
          <button
            onClick={() => onStatusChange(task.id, nextStatus)}
            className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
          >
            {statusButtonLabels[task.mealStatus]}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {/* Status and progress */}
        <div className="text-center">
          <MealStatusBadge status={task.needsCheck ? "needs_check" : task.mealStatus} />
          <div className="mt-3">
            <MealProgressIndicator status={task.mealStatus} needsCheck={task.needsCheck} />
          </div>
        </div>

        {/* Guest info */}
        <div className="shoji-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <PassengerIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">ゲスト情報</span>
            {task.isAnniversaryRelated && (
              <CelebrationIcon size={16} className="text-[var(--kincha)]" />
            )}
          </div>
          <div className="text-lg font-display font-medium text-[var(--sumi)]">
            {getRoomName(task.roomId)} {task.guestName}様
          </div>
          <div className="text-sm text-[var(--nezumi)]">
            {task.guestNameKana} / {task.guestCount}名
          </div>
        </div>

        {/* Meal info */}
        <div className="shoji-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <MealIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">食事内容</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div>
              <span className="text-[var(--nezumi)]">タイプ:</span>
              <span className="ml-2 font-medium text-[var(--sumi)]">
                {MEAL_TYPE_LABELS[task.mealType]}
              </span>
            </div>
            <div>
              <span className="text-[var(--nezumi)]">コース:</span>
              <span className="ml-2 font-medium text-[var(--sumi)]">
                {COURSE_TYPE_LABELS[task.courseType]}
              </span>
            </div>
          </div>
          <EditableTimeDisplay
            value={task.scheduledTime}
            onTimeChange={(newTime) => onTimeChange(task.id, newTime)}
            label="配膳予定時刻"
            size="lg"
            accentColor="ai"
          />
        </div>

        {/* Allergy info */}
        {(task.dietaryRestrictions.length > 0 || task.dietaryNotes) && (
          <div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--shu)]">
              <AllergyIcon size={18} />
              <span className="font-display font-semibold">アレルギー・食事制限</span>
            </div>
            {task.dietaryRestrictions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {task.dietaryRestrictions.map((r) => (
                  <span
                    key={r}
                    className="px-2 py-1 bg-[var(--shu)]/10 text-[var(--shu)] text-sm rounded"
                  >
                    {DIETARY_RESTRICTION_LABELS[r]}
                  </span>
                ))}
              </div>
            )}
            {task.dietaryNotes && (
              <div className="text-sm text-[var(--sumi)]">{task.dietaryNotes}</div>
            )}
          </div>
        )}

        {/* Staff assignment */}
        <div className="shoji-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">担当スタッフ</span>
          </div>
          {staff ? (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: staff.avatarColor }}
              >
                {staff.name.charAt(0)}
              </div>
              <span className="font-medium text-[var(--sumi)]">{staff.name}</span>
            </div>
          ) : (
            <span className="text-[var(--shu)]">未割当</span>
          )}
        </div>

        {/* Notes */}
        {task.notes && (
          <div className="shoji-panel p-4">
            <div className="text-sm text-[var(--nezumi)] mb-1">備考</div>
            <div className="text-[var(--sumi)]">{task.notes}</div>
          </div>
        )}

        {/* Needs check toggle */}
        {task.mealStatus !== "completed" && (
          <button
            onClick={() => onToggleNeedsCheck(task.id)}
            className={`w-full py-2 rounded-lg font-display text-sm transition-colors ${
              task.needsCheck
                ? "bg-[var(--shu)]/10 text-[var(--shu)] hover:bg-[var(--shu)]/20"
                : "bg-[var(--shironeri-warm)] text-[var(--nezumi)] hover:bg-[var(--nezumi)]/10"
            }`}
          >
            {task.needsCheck ? "再確認を解除" : "再確認が必要"}
          </button>
        )}
      </div>
    </Modal>
  );
};

// Create meal modal
const CreateMealModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (task: MealTask) => void;
}) => {
  const [formData, setFormData] = useState({
    roomId: "",
    guestName: "",
    guestNameKana: "",
    guestCount: 2,
    mealType: "dinner" as MealType,
    courseType: "standard" as CourseType,
    scheduledTime: "",
    dietaryRestrictions: [] as DietaryRestriction[],
    dietaryNotes: "",
    isAnniversaryRelated: false,
    assignedStaffId: "",
    priority: "normal" as "normal" | "high" | "urgent",
    notes: "",
  });

  const dietaryOptions: DietaryRestriction[] = [
    "shellfish",
    "egg",
    "dairy",
    "wheat",
    "soba",
    "peanut",
    "fish",
    "other",
  ];

  const handleDietaryToggle = (restriction: DietaryRestriction) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter((r) => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomId || !formData.guestName || !formData.scheduledTime) {
      return;
    }

    const newTask: MealTask = {
      id: `MEAL${Date.now()}`,
      reservationId: `RES${Date.now()}`,
      roomId: formData.roomId,
      guestName: formData.guestName,
      guestNameKana: formData.guestNameKana,
      guestCount: formData.guestCount,
      mealType: formData.mealType,
      courseType: formData.courseType,
      scheduledTime: formData.scheduledTime,
      mealStatus: "preparing",
      dietaryRestrictions: formData.dietaryRestrictions,
      dietaryNotes: formData.dietaryNotes || null,
      isAnniversaryRelated: formData.isAnniversaryRelated,
      needsCheck: false,
      assignedStaffId: formData.assignedStaffId || null,
      priority: formData.priority,
      notes: formData.notes || null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="配膳を追加" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Guest Info */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <PassengerIcon size={18} className="text-[var(--ai)]" />
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
                人数 <span className="text-[var(--shu)]">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.guestCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guestCount: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Meal Info */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <MealIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">食事内容</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                食事タイプ <span className="text-[var(--shu)]">*</span>
              </label>
              <select
                value={formData.mealType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mealType: e.target.value as MealType,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              >
                {Object.entries(MEAL_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                コース <span className="text-[var(--shu)]">*</span>
              </label>
              <select
                value={formData.courseType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseType: e.target.value as CourseType,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              >
                {Object.entries(COURSE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--nezumi)] mb-1">
              配膳時刻 <span className="text-[var(--shu)]">*</span>
            </label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              required
            />
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <AllergyIcon size={18} className="text-[var(--shu)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">
              アレルギー・食事制限
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleDietaryToggle(option)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  formData.dietaryRestrictions.includes(option)
                    ? "bg-[var(--shu)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
                }`}
              >
                {DIETARY_RESTRICTION_LABELS[option]}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm text-[var(--nezumi)] mb-1">その他の注意事項</label>
            <textarea
              value={formData.dietaryNotes}
              onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
              placeholder="その他のアレルギーや食事制限があれば入力..."
              className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30 resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Options */}
        <div className="shoji-panel p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon size={18} className="text-[var(--ai)]" />
            <span className="font-display font-semibold text-[var(--sumi)]">オプション</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">担当スタッフ</label>
              <StaffSelector
                value={formData.assignedStaffId || null}
                onChange={(staffId) =>
                  setFormData({
                    ...formData,
                    assignedStaffId: staffId ?? "",
                  })
                }
                showUnassigned
                ariaLabel="担当スタッフを選択"
              />
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
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnniversaryRelated}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isAnniversaryRelated: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-[var(--nezumi)]"
              />
              <span className="text-sm text-[var(--sumi)]">記念日対応が必要</span>
              <CelebrationIcon size={16} className="text-[var(--kincha)]" />
            </label>
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
          配膳を追加
        </button>
      </form>
    </Modal>
  );
};

// Main component
export const MealManagement = () => {
  const [mealTasks, setMealTasks] = useState<MealTask[]>(mockMealTasks);
  const [notifications, setNotifications] = useState<MealOrderNotification[]>(
    mockMealOrderNotifications,
  );
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Computed stats
  const stats = useMemo(() => {
    const total = mealTasks.length;
    const completed = mealTasks.filter((t) => t.mealStatus === "completed").length;
    const serving = mealTasks.filter((t) => t.mealStatus === "serving").length;
    const preparing = mealTasks.filter((t) => t.mealStatus === "preparing").length;
    const needsCheck = mealTasks.filter((t) => t.needsCheck).length;
    return { total, completed, serving, preparing, needsCheck };
  }, [mealTasks]);

  // Unread notifications count
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  // Filter counts
  const filterCounts = useMemo(() => {
    return {
      all: mealTasks.length,
      breakfast: mealTasks.filter((t) => t.mealType === "breakfast").length,
      dinner: mealTasks.filter((t) => t.mealType === "dinner").length,
      room_service: mealTasks.filter((t) => t.mealType === "room_service").length,
      needs_check: mealTasks.filter((t) => t.needsCheck).length,
    };
  }, [mealTasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...mealTasks];

    switch (filter) {
      case "breakfast":
        tasks = tasks.filter((t) => t.mealType === "breakfast");
        break;
      case "dinner":
        tasks = tasks.filter((t) => t.mealType === "dinner");
        break;
      case "room_service":
        tasks = tasks.filter((t) => t.mealType === "room_service");
        break;
      case "needs_check":
        tasks = tasks.filter((t) => t.needsCheck);
        break;
    }

    // Sort by scheduled time, with completed at the end
    return tasks.sort((a, b) => {
      if (a.mealStatus === "completed" && b.mealStatus !== "completed") return 1;
      if (a.mealStatus !== "completed" && b.mealStatus === "completed") return -1;
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });
  }, [mealTasks, filter]);

  const selectedTask = selectedTaskId ? mealTasks.find((t) => t.id === selectedTaskId) : null;

  // Staff with their task counts
  const staffWithTasks = useMemo(() => {
    const staffIds = [...new Set(mealTasks.map((t) => t.assignedStaffId).filter(Boolean))];
    return staffIds
      .map((id) => {
        const staff = mockStaff.find((s) => s.id === id);
        const taskCount = mealTasks.filter(
          (t) => t.assignedStaffId === id && t.mealStatus !== "completed",
        ).length;
        return staff ? { ...staff, taskCount } : null;
      })
      .filter(Boolean) as Array<{
      id: string;
      name: string;
      avatarColor: string;
      taskCount: number;
    }>;
  }, [mealTasks]);

  // Handlers
  const handleStatusChange = (taskId: string, newStatus: MealProgressStatus) => {
    setMealTasks((prev) =>
      prev.map((t): MealTask => {
        if (t.id !== taskId) return t;

        // 完了状態への遷移: needsCheckは必ずfalse
        if (newStatus === "completed") {
          return {
            ...t,
            mealStatus: "completed" as const,
            needsCheck: false as const,
            completedAt: new Date().toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        }

        // 進行中状態への遷移: needsCheckを維持
        return {
          ...t,
          mealStatus: newStatus,
          needsCheck: t.needsCheck,
        };
      }),
    );
  };

  const handleToggleNeedsCheck = (taskId: string) => {
    setMealTasks((prev) =>
      prev.map((t): MealTask => {
        if (t.id !== taskId) return t;

        // 完了状態のタスクはneedsCheckを変更できない
        if (t.mealStatus === "completed") {
          return t;
        }

        // 進行中タスクのneedsCheckをトグル
        return {
          ...t,
          needsCheck: !t.needsCheck,
        };
      }),
    );
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
  };

  const handleCreateTask = (newTask: MealTask) => {
    setMealTasks((prev) => [...prev, newTask]);
  };

  const handleTimeChange = (taskId: string, newTime: string) => {
    setMealTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, scheduledTime: newTime } : t)),
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--sumi)]">配膳管理</h1>
          <p className="text-sm text-[var(--nezumi)] mt-1">本日の配膳スケジュールと進捗を管理</p>
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
        serving={stats.serving}
        preparing={stats.preparing}
        needsCheck={stats.needsCheck}
      />

      {/* Alert for needs check */}
      {stats.needsCheck > 0 && (
        <div className="flex items-center gap-3 p-4 bg-[var(--shu)]/10 border border-[var(--shu)]/30 rounded-lg">
          <AlertIcon size={20} className="text-[var(--shu)]" />
          <span className="text-[var(--shu)] font-medium">
            {stats.needsCheck}件の配膳タスクで再確認が必要です
          </span>
        </div>
      )}

      {/* Notification alert */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-[var(--kincha)]/10 border border-[var(--kincha)]/30 rounded-lg">
          <NotificationBadgeIcon size={20} className="text-[var(--kincha)]" />
          <span className="text-[var(--kincha)] font-medium">
            新しい注文通知が{unreadCount}件あります
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <FilterTabs activeFilter={filter} onFilterChange={setFilter} counts={filterCounts} />

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schedule list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-display font-semibold text-[var(--sumi)]">配膳スケジュール</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTasks.map((task) => (
              <MealTaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTaskId(task.id)}
                isSelected={selectedTaskId === task.id}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="shoji-panel p-8 text-center">
                <MealIcon size={40} className="mx-auto text-[var(--nezumi)]/50 mb-2" />
                <p className="text-[var(--nezumi)]">該当する配膳タスクがありません</p>
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Order notifications */}
          <div className="shoji-panel p-4">
            <h3 className="font-display font-semibold text-[var(--sumi)] mb-3 flex items-center gap-2">
              <NotificationBadgeIcon size={18} />
              注文通知
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-[var(--kincha)] text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <OrderNotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkNotificationRead}
                />
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-[var(--nezumi)] text-center py-4">
                  新しい通知はありません
                </p>
              )}
            </div>
          </div>

          {/* Staff */}
          <div className="shoji-panel p-4">
            <h3 className="font-display font-semibold text-[var(--sumi)] mb-3 flex items-center gap-2">
              <UserIcon size={18} />
              配膳スタッフ
            </h3>
            <div className="space-y-1">
              {staffWithTasks.map((staff) => (
                <StaffCard key={staff.id} staff={staff} taskCount={staff.taskCount} />
              ))}
            </div>
          </div>

          {/* Anniversary alerts */}
          {mealTasks.some((t) => t.isAnniversaryRelated && t.mealStatus !== "completed") && (
            <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
              <div className="flex items-center gap-2 text-[var(--kincha)] mb-2">
                <CelebrationIcon size={16} />
                <span className="font-display font-semibold">記念日対応</span>
              </div>
              <div className="space-y-2">
                {mealTasks
                  .filter((t) => t.isAnniversaryRelated && t.mealStatus !== "completed")
                  .map((t) => (
                    <div key={t.id} className="text-sm text-[var(--sumi)] flex items-start gap-2">
                      <span className="font-medium text-[var(--kincha)] shrink-0 w-12">
                        {t.scheduledTime}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block">{getRoomName(t.roomId)}</span>
                        <span className="text-[var(--nezumi)] text-xs">{t.guestName}様</span>
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
          onToggleNeedsCheck={handleToggleNeedsCheck}
          onTimeChange={handleTimeChange}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <CreateMealModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateTask} />
      )}
    </div>
  );
};
