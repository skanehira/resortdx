import type {
  Task,
  MealTask,
  ShuttleTask,
  CelebrationTask,
  UnifiedTask,
  UnifiedTaskStatus,
  HousekeepingData,
  MealData,
  ShuttleData,
  CelebrationData,
  HelpRequestData,
  ShuttleStatus,
  MealStatus,
  HelpRequestStatus,
} from "../types";

// タスク → 統合タスク変換
export function taskToUnified(task: Task): UnifiedTask {
  const housekeepingCategory = mapTaskCategoryToHousekeeping(task.category);

  const housekeeping: HousekeepingData | undefined = housekeepingCategory
    ? {
        category: housekeepingCategory,
        cleaningChecklist: task.cleaningChecklist,
        relatedCleaningTaskId: task.relatedCleaningTaskId,
      }
    : undefined;

  return {
    id: task.id,
    type: "housekeeping",
    title: task.title,
    description: task.description,
    roomId: task.roomId,
    scheduledTime: task.scheduledTime,
    estimatedDuration: task.estimatedDuration,
    status: task.status,
    assignedStaffId: task.assignedStaffId,
    priority: task.priority,
    isAnniversaryRelated: task.isAnniversaryRelated,
    completedAt: task.completedAt ?? null,
    createdAt: new Date().toISOString(),
    notes: task.notes ?? null,
    housekeeping,
  };
}

// MealTask → 統合タスク変換
export function mealTaskToUnified(task: MealTask): UnifiedTask {
  const meal: MealData = {
    mealType: task.mealType,
    courseType: task.courseType,
    guestName: task.guestName,
    guestCount: task.guestCount,
    dietaryRestrictions: task.dietaryRestrictions,
    dietaryNotes: task.dietaryNotes,
    mealStatus: task.mealStatus,
    needsCheck: task.needsCheck,
  };

  return {
    id: task.id,
    type: "meal",
    title: `${task.guestName}様 配膳`,
    description: task.notes ?? "",
    roomId: task.roomId,
    scheduledTime: task.scheduledTime,
    estimatedDuration: 30,
    status: mealStatusToUnifiedStatus(task.mealStatus),
    assignedStaffId: task.assignedStaffId,
    priority: task.priority,
    isAnniversaryRelated: task.isAnniversaryRelated,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    notes: task.notes,
    meal,
  };
}

// ShuttleTask → 統合タスク変換
export function shuttleTaskToUnified(task: ShuttleTask): UnifiedTask {
  const shuttle: ShuttleData = {
    guestName: task.guestName,
    numberOfGuests: task.numberOfGuests,
    pickupLocation: task.pickupLocation,
    dropoffLocation: task.dropoffLocation,
    direction: task.direction,
    shuttleStatus: task.shuttleStatus,
    assignedVehicleId: task.assignedVehicleId,
    guestArrivalNotified: task.guestArrivalNotified,
  };

  const directionLabel = task.direction === "pickup" ? "お迎え" : "お送り";

  return {
    id: task.id,
    type: "shuttle",
    title: `${task.guestName}様 ${directionLabel}`,
    description: task.notes ?? "",
    roomId: null,
    scheduledTime: task.scheduledTime,
    estimatedDuration: task.estimatedDuration,
    status: shuttleStatusToUnifiedStatus(task.shuttleStatus),
    assignedStaffId: task.assignedDriverId,
    priority: task.priority,
    isAnniversaryRelated: false,
    completedAt: task.completedAt ?? null,
    createdAt: task.createdAt,
    notes: task.notes ?? null,
    shuttle,
  };
}

// CelebrationTask → 統合タスク変換
export function celebrationTaskToUnified(task: CelebrationTask): UnifiedTask {
  const celebration: CelebrationData = {
    guestName: task.guestName,
    celebrationType: task.celebrationType,
    celebrationDescription: task.celebrationDescription,
    items: task.items,
    completionReport: task.completionReport,
  };

  return {
    id: task.id,
    type: "celebration",
    title: `${task.guestName}様 お祝い演出`,
    description: task.celebrationDescription,
    roomId: task.roomId,
    scheduledTime: task.executionTime,
    estimatedDuration: 30,
    status: task.status,
    assignedStaffId: task.assignedStaffId,
    priority: task.priority,
    isAnniversaryRelated: true,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    notes: task.notes,
    celebration,
  };
}

// ヘルプ依頼作成
export function createHelpRequest(
  requesterId: string,
  requesterName: string,
  targetStaffIds: string[] | "all",
  message: string,
  originalTaskId?: string,
): UnifiedTask {
  const helpRequest: HelpRequestData = {
    requesterId,
    requesterName,
    targetStaffIds,
    message,
    helpStatus: "pending",
    acceptedBy: null,
    acceptedAt: null,
    originalTaskId,
  };

  const now = new Date().toISOString();
  const id = `HELP-${Date.now()}`;

  return {
    id,
    type: "help_request",
    title: `${requesterName}さんからのヘルプ依頼`,
    description: message,
    roomId: null,
    scheduledTime: now,
    estimatedDuration: 0,
    status: "pending",
    assignedStaffId: null,
    priority: "high",
    isAnniversaryRelated: false,
    completedAt: null,
    createdAt: now,
    notes: null,
    helpRequest,
  };
}

// カテゴリマッピング
function mapTaskCategoryToHousekeeping(
  category: Task["category"],
): HousekeepingData["category"] | null {
  switch (category) {
    case "cleaning":
      return "cleaning";
    case "inspection":
      return "inspection";
    case "turndown":
      return "turndown";
    case "bath":
      return "bath";
    default:
      return null;
  }
}

// ステータス変換
function mealStatusToUnifiedStatus(status: MealStatus): UnifiedTaskStatus {
  switch (status) {
    case "preparing":
      return "pending";
    case "serving":
      return "in_progress";
    case "completed":
      return "completed";
    case "needs_check":
      return "in_progress";
  }
}

function shuttleStatusToUnifiedStatus(status: ShuttleStatus): UnifiedTaskStatus {
  switch (status) {
    case "not_departed":
      return "pending";
    case "heading":
    case "arrived":
    case "boarded":
      return "in_progress";
    case "completed":
      return "completed";
  }
}

// ヘルプステータスから統合ステータスへ
export function helpStatusToUnifiedStatus(status: HelpRequestStatus): UnifiedTaskStatus {
  switch (status) {
    case "pending":
      return "pending";
    case "accepted":
      return "in_progress";
    case "completed":
    case "cancelled":
      return "completed";
  }
}

// 統合タスクのソート（作業中→未着手→完了、時間順）
export function sortUnifiedTasks(tasks: UnifiedTask[]): UnifiedTask[] {
  return [...tasks].sort((a, b) => {
    // ステータス優先度: in_progress > pending > completed
    const statusOrder: Record<UnifiedTaskStatus, number> = {
      in_progress: 0,
      pending: 1,
      completed: 2,
    };

    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // 同じステータスなら時間順
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });
}

// スタッフIDでフィルタリング
export function filterTasksByStaff(tasks: UnifiedTask[], staffId: string): UnifiedTask[] {
  return tasks.filter((task) => {
    // 直接アサインされているタスク
    if (task.assignedStaffId === staffId) return true;

    // ヘルプ依頼: 自分宛て or 全員宛て
    if (task.helpRequest) {
      const { targetStaffIds, requesterId, acceptedBy } = task.helpRequest;
      // 自分が依頼者
      if (requesterId === staffId) return true;
      // 自分が受諾者
      if (acceptedBy === staffId) return true;
      // 全員宛て or 自分が対象
      if (
        targetStaffIds === "all" ||
        (Array.isArray(targetStaffIds) && targetStaffIds.includes(staffId))
      ) {
        return true;
      }
    }

    return false;
  });
}

// 統合タスクから詳細ステータス取得（タイプ固有）
export function getDetailedStatus(task: UnifiedTask): string {
  switch (task.type) {
    case "housekeeping":
      return task.status === "in_progress" ? "作業中" : task.status;
    case "meal":
      return task.meal ? getMealStatusLabel(task.meal.mealStatus) : task.status;
    case "shuttle":
      return task.shuttle ? getShuttleStatusLabel(task.shuttle.shuttleStatus) : task.status;
    case "celebration":
      return task.status === "in_progress" ? "対応中" : task.status;
    case "help_request":
      return task.helpRequest ? getHelpStatusLabel(task.helpRequest.helpStatus) : task.status;
  }
}

function getMealStatusLabel(status: MealStatus): string {
  const labels: Record<MealStatus, string> = {
    preparing: "準備中",
    serving: "配膳中",
    completed: "完了",
    needs_check: "再確認要",
  };
  return labels[status];
}

function getShuttleStatusLabel(status: ShuttleStatus): string {
  const labels: Record<ShuttleStatus, string> = {
    not_departed: "未出発",
    heading: "向かい中",
    arrived: "到着済",
    boarded: "乗車済",
    completed: "完了",
  };
  return labels[status];
}

function getHelpStatusLabel(status: HelpRequestStatus): string {
  const labels: Record<HelpRequestStatus, string> = {
    pending: "依頼中",
    accepted: "対応中",
    completed: "完了",
    cancelled: "キャンセル",
  };
  return labels[status];
}
