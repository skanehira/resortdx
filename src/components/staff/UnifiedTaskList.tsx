import { useState, useMemo, useCallback } from "react";
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
import { TaskIcon, HelpIcon, FilterIcon } from "../ui/Icons";
import { HousekeepingCard } from "./cards/HousekeepingCard";
import { MealCard } from "./cards/MealCard";
import { ShuttleCard } from "./cards/ShuttleCard";
import { CelebrationCard } from "./cards/CelebrationCard";
import { HelpRequestCard } from "./cards/HelpRequestCard";
import { EquipmentReportModal } from "./modals/EquipmentReportModal";
import { HelpRequestModal } from "./modals/HelpRequestModal";

// カテゴリフィルター（清掃と点検を分離）
type CategoryFilter =
  | "all"
  | "cleaning"
  | "inspection"
  | "meal"
  | "shuttle"
  | "celebration"
  | "help_request";

// カテゴリラベルと色
const CATEGORY_CONFIG: Record<CategoryFilter, { label: string; color: string }> = {
  all: { label: "すべて", color: "var(--sumi)" },
  cleaning: { label: "清掃", color: "var(--ai)" },
  inspection: { label: "点検", color: "var(--kincha)" },
  meal: { label: "配膳", color: "var(--kincha-light)" },
  shuttle: { label: "送迎", color: "var(--aotake)" },
  celebration: { label: "お祝い", color: "var(--shu)" },
  help_request: { label: "ヘルプ", color: "#9333ea" }, // purple
};

// タスクからカテゴリを判定
const getTaskCategory = (task: UnifiedTask): CategoryFilter => {
  if (task.type === "housekeeping" && task.housekeeping) {
    if (task.housekeeping.category === "inspection") return "inspection";
    return "cleaning"; // cleaning, turndown, bath はすべて清掃カテゴリ
  }
  return task.type as CategoryFilter;
};

// カテゴリフィルタータブ
interface CategoryTabsProps {
  selected: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  counts: Record<CategoryFilter, number>;
}

const CategoryTabs = ({ selected, onChange, counts }: CategoryTabsProps) => {
  const categories: CategoryFilter[] = [
    "all",
    "cleaning",
    "inspection",
    "meal",
    "shuttle",
    "celebration",
    "help_request",
  ];

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-full transition-all whitespace-nowrap ${
            selected === cat ? "text-white" : "bg-[var(--shironeri-warm)] text-[var(--nezumi)]"
          }`}
          style={selected === cat ? { backgroundColor: CATEGORY_CONFIG[cat].color } : undefined}
        >
          {CATEGORY_CONFIG[cat].label}
          <span
            className={`ml-1 text-xs ${selected === cat ? "text-white/80" : "text-[var(--nezumi-light)]"}`}
          >
            {counts[cat]}
          </span>
        </button>
      ))}
    </div>
  );
};

// ステータスフィルタータブ
interface StatusTabsProps {
  selected: UnifiedTaskStatus | "all";
  onChange: (status: UnifiedTaskStatus | "all") => void;
  counts: Record<UnifiedTaskStatus | "all", number>;
}

const StatusTabs = ({ selected, onChange, counts }: StatusTabsProps) => {
  const tabs: { key: UnifiedTaskStatus | "all"; label: string }[] = [
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
          className={`flex-1 px-2 py-2 text-sm font-display rounded-md transition-all whitespace-nowrap ${
            selected === tab.key
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          {tab.label}
          <span
            className={`ml-1 text-xs ${
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

// 進捗サマリー
const ProgressSummary = ({ tasks }: { tasks: UnifiedTask[] }) => {
  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="shoji-panel p-4">
      <div className="flex items-center justify-between mb-3">
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

// メインコンポーネントのProps
interface UnifiedTaskListProps {
  tasks: UnifiedTask[];
  currentStaff: Staff;
  allStaff: Staff[];
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
  onCreateHelpRequest?: (data: {
    targetStaffIds: string[] | "all";
    message: string;
    relatedTaskId?: string;
  }) => void;
  // カテゴリフィルターの状態保持用
  categoryFilter?: CategoryFilter;
  onCategoryFilterChange?: (category: CategoryFilter) => void;
}

export const UnifiedTaskList = ({
  tasks,
  currentStaff,
  allStaff,
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
  onCreateHelpRequest,
  categoryFilter: externalCategoryFilter,
  onCategoryFilterChange,
}: UnifiedTaskListProps) => {
  // 外部から渡されたカテゴリフィルターがあればそれを使う（状態保持用）
  const [internalCategoryFilter, setInternalCategoryFilter] = useState<CategoryFilter>(
    externalCategoryFilter ?? "all",
  );
  const categoryFilter = externalCategoryFilter ?? internalCategoryFilter;
  const setCategoryFilter = (category: CategoryFilter) => {
    setInternalCategoryFilter(category);
    onCategoryFilterChange?.(category);
  };

  const [statusFilter, setStatusFilter] = useState<UnifiedTaskStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Equipment report modal state
  const [equipmentReportModal, setEquipmentReportModal] = useState<{
    isOpen: boolean;
    roomId: string;
    taskId: string;
  } | null>(null);

  // Help request modal state
  const [helpRequestModal, setHelpRequestModal] = useState<{
    isOpen: boolean;
    relatedTaskId?: string;
  } | null>(null);

  // 現在のスタッフに割り当てられたタスク + 全員宛ヘルプ依頼を取得
  const myTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 自分に割り当てられたタスク
      if (task.assignedStaffId === currentStaff.id) return true;
      // ヘルプ依頼で全員宛て or 自分が対象のもの
      if (task.type === "help_request" && task.helpRequest) {
        const hr = task.helpRequest;
        // 自分が依頼者の場合も表示
        if (hr.requesterId === currentStaff.id) return true;
        // pending状態で対象に含まれている場合
        if (hr.helpStatus === "pending") {
          if (hr.targetStaffIds === "all") return true;
          if (Array.isArray(hr.targetStaffIds) && hr.targetStaffIds.includes(currentStaff.id))
            return true;
        }
        // 受諾済みで自分が受諾者の場合
        if (hr.acceptedBy === currentStaff.id) return true;
      }
      return false;
    });
  }, [tasks, currentStaff.id]);

  // ソート: in_progress → pending → completed、同ステータス内は時間順
  const sortedTasks = useMemo(() => {
    return [...myTasks].sort((a, b) => {
      const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });
  }, [myTasks]);

  // フィルタリング
  const filteredTasks = useMemo(() => {
    let result = sortedTasks;
    if (categoryFilter !== "all") {
      result = result.filter((t) => getTaskCategory(t) === categoryFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    return result;
  }, [sortedTasks, categoryFilter, statusFilter]);

  // カテゴリ別件数
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: myTasks.length,
      cleaning: 0,
      inspection: 0,
      meal: 0,
      shuttle: 0,
      celebration: 0,
      help_request: 0,
    };
    for (const task of myTasks) {
      const category = getTaskCategory(task);
      counts[category]++;
    }
    return counts;
  }, [myTasks]);

  // ステータス別件数（カテゴリフィルター適用後）
  const statusCounts = useMemo(() => {
    const filtered =
      categoryFilter === "all"
        ? myTasks
        : myTasks.filter((t) => getTaskCategory(t) === categoryFilter);
    return {
      all: filtered.length,
      pending: filtered.filter((t) => t.status === "pending").length,
      in_progress: filtered.filter((t) => t.status === "in_progress").length,
      completed: filtered.filter((t) => t.status === "completed").length,
    };
  }, [myTasks, categoryFilter]);

  // 点検タスク完了時の設備報告ハンドラー
  const handleHousekeepingComplete = useCallback((taskId: string, roomId: string) => {
    // 設備報告モーダルを表示
    setEquipmentReportModal({ isOpen: true, roomId, taskId });
  }, []);

  // 設備報告の送信
  const handleEquipmentReportSubmit = useCallback(
    (report: EquipmentReport) => {
      if (equipmentReportModal?.roomId) {
        onEquipmentReport?.(equipmentReportModal.roomId, report);
      }
      // タスクを完了にする
      if (equipmentReportModal?.taskId) {
        onStatusChange(equipmentReportModal.taskId, "completed");
      }
      setEquipmentReportModal(null);
    },
    [equipmentReportModal, onEquipmentReport, onStatusChange],
  );

  // ヘルプ依頼モーダルを開く
  const handleOpenHelpRequest = useCallback((relatedTaskId?: string) => {
    setHelpRequestModal({ isOpen: true, relatedTaskId });
  }, []);

  // ヘルプ依頼の送信
  const handleHelpRequestSubmit = useCallback(
    (data: { targetStaffIds: string[] | "all"; message: string; relatedTaskId?: string }) => {
      onCreateHelpRequest?.(data);
      setHelpRequestModal(null);
    },
    [onCreateHelpRequest],
  );

  const currentTime = new Date().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
          />
        );
      case "meal":
        return (
          <MealCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onMealStatusChange={onMealStatusChange}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--shironeri)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="p-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--nezumi)]">こんにちは</p>
              <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                {currentStaff.name}さん
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Help request button */}
              <button
                onClick={() => handleOpenHelpRequest()}
                className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                title="ヘルプを依頼"
              >
                <HelpIcon size={20} />
              </button>
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-[var(--ai)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--nezumi)]"
                }`}
                title="フィルター"
              >
                <FilterIcon size={20} />
              </button>
              {/* Time */}
              <div className="text-right">
                <p className="text-2xl font-display text-[var(--ai)]">{currentTime}</p>
              </div>
            </div>
          </div>

          {/* Category filter (always visible) */}
          <CategoryTabs
            selected={categoryFilter}
            onChange={setCategoryFilter}
            counts={categoryCounts}
          />

          {/* Status filter (collapsible) */}
          {showFilters && (
            <div className="mt-3 animate-fade-in">
              <StatusTabs
                selected={statusFilter}
                onChange={setStatusFilter}
                counts={statusCounts}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Progress Summary */}
        <ProgressSummary tasks={myTasks} />

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((task, index) => (
            <div key={task.id} className={`stagger-${(index % 5) + 1}`}>
              {renderTaskCard(task)}
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="shoji-panel p-8 text-center">
              <TaskIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
              <p className="text-[var(--nezumi)]">
                {categoryFilter !== "all"
                  ? `${CATEGORY_CONFIG[categoryFilter].label}のタスクはありません`
                  : statusFilter === "completed"
                    ? "完了したタスクはありません"
                    : statusFilter === "pending"
                      ? "未着手のタスクはありません"
                      : statusFilter === "in_progress"
                        ? "作業中のタスクはありません"
                        : "割り当てられたタスクはありません"}
              </p>
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

      {/* Help Request Modal */}
      {helpRequestModal?.isOpen && (
        <HelpRequestModal
          currentStaffId={currentStaff.id}
          allStaff={allStaff}
          relatedTaskId={helpRequestModal.relatedTaskId}
          onSubmit={handleHelpRequestSubmit}
          onClose={() => setHelpRequestModal(null)}
        />
      )}
    </div>
  );
};
