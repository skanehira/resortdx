import type {
  Task,
  Staff,
  MealTask,
  MealOrderNotification,
  CelebrationTask,
  MealStatus,
  RoomCleaningStatus,
  UnifiedTask,
} from "../../types";

// Helper to get today's date in YYYY-MM-DD format
const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// === Mock Meal Tasks ===
export const mockMealTasks: MealTask[] = [
  {
    id: "MEAL001",
    reservationId: "RSV001",
    guestName: "山田 太郎",
    guestNameKana: "ヤマダ タロウ",
    roomId: "ROOM-001",
    mealType: "dinner",
    courseType: "kaiseki",
    scheduledTime: "18:30",
    guestCount: 2,
    dietaryRestrictions: ["shellfish"],
    dietaryNotes: "甲殻類アレルギー：エビ・カニ完全除去",
    mealStatus: "preparing",
    needsCheck: false,
    assignedStaffId: "STF002",
    priority: "high",
    isAnniversaryRelated: true,
    notes: "結婚記念日のお客様。デザートにメッセージプレート",
    completedAt: null,
    createdAt: getToday() + "T06:00:00",
  },
  {
    id: "MEAL002",
    reservationId: "RSV002",
    guestName: "佐藤 花子",
    guestNameKana: "サトウ ハナコ",
    roomId: "ROOM-003",
    mealType: "dinner",
    courseType: "premium",
    scheduledTime: "18:00",
    guestCount: 3,
    dietaryRestrictions: [],
    dietaryNotes: null,
    mealStatus: "serving",
    needsCheck: false,
    assignedStaffId: "STF002",
    priority: "normal",
    isAnniversaryRelated: false,
    notes: "お子様1名含む。お子様メニュー対応",
    completedAt: null,
    createdAt: getToday() + "T06:00:00",
  },
  {
    id: "MEAL003",
    reservationId: "RSV003",
    guestName: "鈴木 一郎",
    guestNameKana: "スズキ イチロウ",
    roomId: "ROOM-002",
    mealType: "dinner",
    courseType: "standard",
    scheduledTime: "19:00",
    guestCount: 1,
    dietaryRestrictions: [],
    dietaryNotes: null,
    mealStatus: "preparing",
    needsCheck: false,
    assignedStaffId: "STF006",
    priority: "normal",
    isAnniversaryRelated: false,
    notes: null,
    completedAt: null,
    createdAt: getToday() + "T06:00:00",
  },
  {
    id: "MEAL004",
    reservationId: "RSV004",
    guestName: "田中 美咲",
    guestNameKana: "タナカ ミサキ",
    roomId: "ROOM-004",
    mealType: "room_service",
    courseType: "kaiseki",
    scheduledTime: "19:00",
    guestCount: 2,
    dietaryRestrictions: ["dairy", "wheat"],
    dietaryNotes: "乳製品・小麦アレルギー対応",
    mealStatus: "preparing",
    needsCheck: false,
    assignedStaffId: "STF002",
    priority: "urgent",
    isAnniversaryRelated: true,
    notes: "誕生日のお客様。部屋食対応。特別演出あり",
    completedAt: null,
    createdAt: getToday() + "T06:00:00",
  },
  {
    id: "MEAL005",
    reservationId: "RSV005",
    guestName: "高橋 健二",
    guestNameKana: "タカハシ ケンジ",
    roomId: "ROOM-005",
    mealType: "dinner",
    courseType: "standard",
    scheduledTime: "19:30",
    guestCount: 4,
    dietaryRestrictions: [],
    dietaryNotes: null,
    mealStatus: "preparing",
    needsCheck: false,
    assignedStaffId: "STF006",
    priority: "normal",
    isAnniversaryRelated: false,
    notes: "団体様4名分",
    completedAt: null,
    createdAt: getToday() + "T06:00:00",
  },
  {
    id: "MEAL006",
    reservationId: "RSV001",
    guestName: "山田 太郎",
    guestNameKana: "ヤマダ タロウ",
    roomId: "ROOM-001",
    mealType: "breakfast",
    courseType: "standard",
    scheduledTime: "08:00",
    guestCount: 2,
    dietaryRestrictions: ["shellfish"],
    dietaryNotes: "甲殻類アレルギー",
    mealStatus: "completed",
    needsCheck: false,
    assignedStaffId: "STF002",
    priority: "normal",
    isAnniversaryRelated: false,
    notes: null,
    completedAt: "08:45",
    createdAt: getToday() + "T06:00:00",
  },
  {
    id: "MEAL007",
    reservationId: "RSV002",
    guestName: "佐藤 花子",
    guestNameKana: "サトウ ハナコ",
    roomId: "ROOM-003",
    mealType: "breakfast",
    courseType: "standard",
    scheduledTime: "07:30",
    guestCount: 3,
    dietaryRestrictions: [],
    dietaryNotes: null,
    mealStatus: "completed",
    needsCheck: true,
    assignedStaffId: "STF006",
    priority: "normal",
    isAnniversaryRelated: false,
    notes: "お味噌汁のおかわり希望あり",
    completedAt: "08:15",
    createdAt: getToday() + "T06:00:00",
  },
  {
    id: "MEAL008",
    reservationId: "RSV004",
    guestName: "田中 美咲",
    guestNameKana: "タナカ ミサキ",
    roomId: "ROOM-004",
    mealType: "special",
    courseType: "kaiseki",
    scheduledTime: "20:30",
    guestCount: 2,
    dietaryRestrictions: ["dairy", "wheat"],
    dietaryNotes: "乳製品・小麦アレルギー対応",
    mealStatus: "preparing",
    needsCheck: false,
    assignedStaffId: "STF002",
    priority: "urgent",
    isAnniversaryRelated: true,
    notes: "誕生日ケーキ提供（アレルギー対応版）",
    completedAt: null,
    createdAt: getToday() + "T06:00:00",
  },
];

// === Mock Meal Order Notifications ===
export const mockMealOrderNotifications: MealOrderNotification[] = [
  {
    id: "ORD001",
    reservationId: "RSV001",
    roomId: "ROOM-001",
    guestName: "山田 太郎",
    orderType: "drink",
    content: "日本酒（熱燗）2合追加",
    isRead: false,
    createdAt: getToday() + "T18:45:00",
  },
  {
    id: "ORD002",
    reservationId: "RSV002",
    roomId: "ROOM-003",
    guestName: "佐藤 花子",
    orderType: "drink",
    content: "お子様用ジュース追加",
    isRead: false,
    createdAt: getToday() + "T18:20:00",
  },
  {
    id: "ORD003",
    reservationId: "RSV004",
    roomId: "ROOM-004",
    guestName: "田中 美咲",
    orderType: "timing_change",
    content: "夕食開始を19:30に変更希望",
    isRead: true,
    createdAt: getToday() + "T17:30:00",
  },
  {
    id: "ORD004",
    reservationId: "RSV005",
    roomId: "ROOM-005",
    guestName: "高橋 健二",
    orderType: "menu_change",
    content: "1名分をベジタリアンメニューに変更",
    isRead: false,
    createdAt: getToday() + "T18:50:00",
  },
  {
    id: "ORD005",
    reservationId: "RSV001",
    roomId: "ROOM-001",
    guestName: "山田 太郎",
    orderType: "other",
    content: "デザートを少し遅めに提供希望",
    isRead: true,
    createdAt: getToday() + "T19:15:00",
  },
];

// === Mock Celebration Tasks ===
export const mockCelebrationTasks: CelebrationTask[] = [
  {
    id: "CLB001",
    reservationId: "RSV001",
    guestName: "山田 太郎",
    guestNameKana: "ヤマダ タロウ",
    roomId: "ROOM-001",
    celebrationType: "wedding_anniversary",
    celebrationDescription: "結婚10周年記念",
    items: [
      { item: "cake", isChecked: true, notes: "チョコレートケーキ" },
      { item: "flowers", isChecked: true, notes: "バラの花束" },
      { item: "champagne", isChecked: false, notes: "モエ・エ・シャンドン" },
      {
        item: "message_card",
        isChecked: true,
        notes: "手書きメッセージカード",
      },
    ],
    executionTime: "19:30",
    status: "in_progress",
    assignedStaffId: "STF005",
    priority: "high",
    notes: "夕食のデザート時にサプライズ演出",
    completionReport: null,
    completedAt: null,
    createdAt: getToday() + "T08:00:00",
  },
  {
    id: "CLB002",
    reservationId: "RSV004",
    guestName: "田中 美咲",
    guestNameKana: "タナカ ミサキ",
    roomId: "ROOM-004",
    celebrationType: "birthday",
    celebrationDescription: "奥様のお誕生日",
    items: [
      {
        item: "cake",
        isChecked: false,
        notes: "アレルギー対応ケーキ（乳・小麦不使用）",
      },
      { item: "flowers", isChecked: false, notes: "ユリの花束" },
      {
        item: "champagne",
        isChecked: false,
        notes: "ノンアルコールスパークリング",
      },
      { item: "decoration", isChecked: false, notes: "バルーン装飾" },
      { item: "message_card", isChecked: false, notes: "旅館オリジナルカード" },
    ],
    executionTime: "20:00",
    status: "pending",
    assignedStaffId: "STF005",
    priority: "urgent",
    notes: "部屋食後にサプライズ。ご主人様と事前打ち合わせ済み",
    completionReport: null,
    completedAt: null,
    createdAt: getToday() + "T08:00:00",
  },
  {
    id: "CLB003",
    reservationId: "RSV002",
    guestName: "佐藤 花子",
    guestNameKana: "サトウ ハナコ",
    roomId: "ROOM-003",
    celebrationType: "other",
    celebrationDescription: "還暦のお祝い（おばあ様）",
    items: [
      {
        item: "cake",
        isChecked: true,
        notes: "還暦ケーキ（赤いデコレーション）",
      },
      { item: "flowers", isChecked: true, notes: "赤いカーネーション" },
      { item: "message_card", isChecked: true, notes: undefined },
    ],
    executionTime: "18:30",
    status: "completed",
    assignedStaffId: "STF005",
    priority: "normal",
    notes: "夕食開始時に提供完了",
    completionReport: "お客様大変喜んでいただけました。記念撮影のお手伝いも実施。",
    completedAt: "18:45",
    createdAt: getToday() + "T08:00:00",
  },
  {
    id: "CLB004",
    reservationId: "RSV005",
    guestName: "高橋 健二",
    guestNameKana: "タカハシ ケンジ",
    roomId: "ROOM-005",
    celebrationType: "other",
    celebrationDescription: "退職祝い（団体様）",
    items: [
      {
        item: "champagne",
        isChecked: false,
        notes: "スパークリングワイン4人分",
      },
      {
        item: "message_card",
        isChecked: false,
        notes: "色紙（お客様持込）への記入依頼",
      },
    ],
    executionTime: "20:00",
    status: "pending",
    assignedStaffId: "STF002",
    priority: "normal",
    notes: "乾杯時にスパークリング提供",
    completionReport: null,
    completedAt: null,
    createdAt: getToday() + "T08:00:00",
  },
];

// === Meal Management Helper Functions ===
export const getMealTaskById = (id: string): MealTask | undefined =>
  mockMealTasks.find((t) => t.id === id);

export const getMealTasksByStaff = (staffId: string): MealTask[] =>
  mockMealTasks.filter((t) => t.assignedStaffId === staffId);

export const getMealTasksByStatus = (status: MealStatus): MealTask[] =>
  mockMealTasks.filter((t) => t.mealStatus === status);

export const getMealTasksByRoom = (roomId: string): MealTask[] =>
  mockMealTasks.filter((t) => t.roomId === roomId);

export const getPendingMealTasks = (): MealTask[] =>
  mockMealTasks.filter((t) => t.mealStatus !== "completed");

export const getMealTasksNeedingCheck = (): MealTask[] => mockMealTasks.filter((t) => t.needsCheck);

export const getUnreadOrderNotifications = (): MealOrderNotification[] =>
  mockMealOrderNotifications.filter((n) => !n.isRead);

export const getOrderNotificationsByRoom = (roomId: string): MealOrderNotification[] =>
  mockMealOrderNotifications.filter((n) => n.roomId === roomId);

// === Celebration Management Helper Functions ===
export const getCelebrationTaskById = (id: string): CelebrationTask | undefined =>
  mockCelebrationTasks.find((t) => t.id === id);

export const getCelebrationTasksByStaff = (staffId: string): CelebrationTask[] =>
  mockCelebrationTasks.filter((t) => t.assignedStaffId === staffId);

export const getCelebrationTasksByStatus = (status: CelebrationTask["status"]): CelebrationTask[] =>
  mockCelebrationTasks.filter((t) => t.status === status);

export const getPendingCelebrationTasks = (): CelebrationTask[] =>
  mockCelebrationTasks.filter((t) => t.status !== "completed");

export const getCelebrationTasksByRoom = (roomId: string): CelebrationTask[] =>
  mockCelebrationTasks.filter((t) => t.roomId === roomId);

// === Room Cleaning Status Helper Functions ===

export interface RoomCleaningInfo {
  roomId: string;
  status: RoomCleaningStatus;
  cleaningTask: Task | null;
  inspectionTask: Task | null;
  assignedStaff: Staff | null;
}

export const getRoomCleaningStatuses = (
  tasks: Task[],
  getStaffById: (id: string) => Staff | undefined,
): RoomCleaningInfo[] => {
  const roomIds = [...new Set(tasks.map((t) => t.roomId))];

  return roomIds.map((roomId) => {
    const cleaningTask = tasks.find((t) => t.roomId === roomId && t.category === "cleaning");
    const inspectionTask = tasks.find((t) => t.roomId === roomId && t.category === "inspection");

    let status: RoomCleaningStatus = "not_cleaned";

    if (inspectionTask?.status === "completed") {
      status = "inspected";
    } else if (cleaningTask?.status === "completed") {
      status = "cleaned";
    } else if (cleaningTask?.status === "in_progress") {
      status = "cleaning";
    }

    const assignedStaff = cleaningTask?.assignedStaffId
      ? getStaffById(cleaningTask.assignedStaffId) || null
      : null;

    return {
      roomId,
      status,
      cleaningTask: cleaningTask || null,
      inspectionTask: inspectionTask || null,
      assignedStaff,
    };
  });
};

export const getCleaningTasks = (tasks: Task[]): Task[] =>
  tasks.filter((t) => t.category === "cleaning");

export const getInspectionTasks = (tasks: Task[]): Task[] =>
  tasks.filter((t) => t.category === "inspection");

export const createInspectionTask = (
  cleaningTask: Task,
  inspectorId: string,
  getStaffById: (id: string) => Staff | undefined,
  getRoomName: (roomId: string | null | undefined) => string,
): Task => {
  const now = new Date();
  const scheduledTime = `${now.getHours().toString().padStart(2, "0")}:${(now.getMinutes() + 30).toString().padStart(2, "0")}`;
  const roomName = getRoomName(cleaningTask.roomId);

  return {
    id: `INS-${cleaningTask.id}`,
    reservationId: cleaningTask.reservationId,
    category: "inspection",
    title: `点検 ${roomName}`,
    description: `清掃完了後の最終点検。清掃担当: ${getStaffById(cleaningTask.assignedStaffId || "")?.name || "未割当"}`,
    roomId: cleaningTask.roomId,
    scheduledTime,
    estimatedDuration: 10,
    status: "pending",
    assignedStaffId: inspectorId,
    priority: cleaningTask.priority,
    isAnniversaryRelated: cleaningTask.isAnniversaryRelated,
    relatedCleaningTaskId: cleaningTask.id,
  };
};

// === Unified Tasks (統合タスク) ===
// 既存のTask, MealTask, ShuttleTask, CelebrationTaskを統合した形式
export const mockUnifiedTasks: UnifiedTask[] = [
  // Housekeeping tasks (清掃タスク)
  {
    id: "UT-HK-001",
    type: "housekeeping",
    title: "客室清掃 スタイリッシュスイート",
    roomId: "ROOM-001",
    scheduledTime: "10:00",
    status: "completed",
    assignedStaffId: "STF001",
    priority: "high",
    adminMemo: "結婚記念日のお客様のため、特に丁寧に対応をお願いします",
    personalMemo: "バスルームの鏡に曇り止め処理済み",
    sharedMemo: null,
    housekeeping: {
      category: "cleaning",
      reservationId: "RSV001",
      description: "和洋室デラックス清掃。結婚記念日のお客様。",
      estimatedDuration: 45,
      completedAt: "10:42",
      cleaningChecklist: [
        { item: "bed_making", isChecked: true },
        { item: "floor_cleaning", isChecked: true },
        { item: "bathroom_cleaning", isChecked: true },
        { item: "amenity_check", isChecked: true },
        { item: "garbage_collection", isChecked: true },
      ],
    },
  },
  {
    id: "UT-HK-002",
    type: "housekeeping",
    title: "客室清掃 プレシャススイート",
    roomId: "ROOM-003",
    scheduledTime: "09:00",
    status: "completed",
    assignedStaffId: "STF003",
    priority: "normal",
    housekeeping: {
      category: "cleaning",
      reservationId: "RSV002",
      description: "特別室スイート清掃。ベビーベッド設置済み確認。",
      estimatedDuration: 60,
      completedAt: "10:05",
      cleaningChecklist: [
        { item: "bed_making", isChecked: true },
        { item: "floor_cleaning", isChecked: true },
        { item: "bathroom_cleaning", isChecked: true },
        { item: "amenity_check", isChecked: true },
        { item: "garbage_collection", isChecked: true },
      ],
    },
  },
  {
    id: "UT-HK-003",
    type: "housekeeping",
    title: "点検 スタイリッシュスイート",
    roomId: "ROOM-001",
    scheduledTime: "11:00",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "high",
    housekeeping: {
      category: "inspection",
      reservationId: "RSV001",
      description: "清掃完了後の最終点検",
      estimatedDuration: 15,
    },
  },
  {
    id: "UT-HK-004",
    type: "housekeeping",
    title: "客室清掃 ふふラグジュアリーコーナースイート",
    roomId: "ROOM-005",
    scheduledTime: "12:00",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "normal",
    housekeeping: {
      category: "cleaning",
      reservationId: "RSV005",
      description: "和洋室デラックス清掃。団体様4名。",
      estimatedDuration: 50,
      cleaningChecklist: [
        { item: "bed_making", isChecked: false },
        { item: "floor_cleaning", isChecked: false },
        { item: "bathroom_cleaning", isChecked: false },
        { item: "amenity_check", isChecked: false },
        { item: "garbage_collection", isChecked: false },
      ],
    },
  },
  // Meal tasks (配膳タスク)
  {
    id: "UT-ML-001",
    type: "meal",
    title: "夕食配膳 スタイリッシュスイート",
    roomId: "ROOM-001",
    scheduledTime: "18:30",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "high",
    adminMemo: "結婚記念日のお客様。デザート時にサプライズケーキ提供あり",
    sharedMemo: "甲殻類アレルギーのため、エビ・カニ完全除去。厨房確認済み",
    meal: {
      reservationId: "RSV001",
      guestName: "山田 太郎",
      guestNameKana: "ヤマダ タロウ",
      mealType: "dinner",
      courseType: "kaiseki",
      guestCount: 2,
      dietaryRestrictions: ["shellfish"],
      dietaryNotes: "甲殻類アレルギー：エビ・カニ完全除去",
      mealStatus: "preparing",
      isAnniversaryRelated: true,
      notes: "結婚記念日のお客様。デザートにメッセージプレート",
    },
  },
  {
    id: "UT-ML-002",
    type: "meal",
    title: "夕食配膳 プレシャススイート",
    roomId: "ROOM-003",
    scheduledTime: "18:00",
    status: "in_progress",
    assignedStaffId: "STF002",
    priority: "normal",
    meal: {
      reservationId: "RSV002",
      guestName: "佐藤 花子",
      guestNameKana: "サトウ ハナコ",
      mealType: "dinner",
      courseType: "premium",
      guestCount: 3,
      dietaryRestrictions: [],
      mealStatus: "serving",
      isAnniversaryRelated: false,
      notes: "お子様1名含む。お子様メニュー対応",
    },
  },
  {
    id: "UT-ML-003",
    type: "meal",
    title: "部屋食準備 プレミアムスイート",
    roomId: "ROOM-004",
    scheduledTime: "19:00",
    status: "pending",
    assignedStaffId: "STF002",
    priority: "urgent",
    meal: {
      reservationId: "RSV004",
      guestName: "田中 美咲",
      guestNameKana: "タナカ ミサキ",
      mealType: "room_service",
      courseType: "kaiseki",
      guestCount: 2,
      dietaryRestrictions: ["dairy", "wheat"],
      dietaryNotes: "乳製品・小麦アレルギー対応",
      mealStatus: "preparing",
      isAnniversaryRelated: true,
      notes: "誕生日のお客様。部屋食対応。特別演出あり",
    },
  },
  // Shuttle tasks (送迎タスク)
  {
    id: "UT-SH-001",
    type: "shuttle",
    title: "送迎 鳥羽駅→旅館",
    roomId: null,
    scheduledTime: "15:30",
    status: "in_progress",
    assignedStaffId: "STF004",
    priority: "normal",
    shuttle: {
      reservationId: "RSV003",
      guestName: "鈴木 一郎",
      guestNameKana: "スズキ イチロウ",
      numberOfGuests: 1,
      pickupLocation: "鳥羽駅",
      dropoffLocation: "旅館",
      direction: "pickup",
      estimatedDuration: 20,
      shuttleStatus: "heading",
      assignedVehicleId: "VEH002",
      guestArrivalNotified: false,
      notes: "改札出口でお待ちください",
      messages: [
        {
          id: "MSG-001",
          shuttleTaskId: "UT-SH-001",
          senderType: "staff" as const,
          senderId: "STF004",
          senderName: "佐藤 花子",
          content: "これから向かいます。あと5分ほどで到着予定です。",
          messageType: "arrival" as const,
          sentAt: "2025-01-15T15:25:00",
          readAt: "2025-01-15T15:25:30",
          isQuickMessage: true,
        },
        {
          id: "MSG-002",
          shuttleTaskId: "UT-SH-001",
          senderType: "guest" as const,
          senderId: "GUEST-003",
          senderName: "鈴木 一郎",
          content: "ありがとうございます。改札前で待っています。",
          messageType: "normal" as const,
          sentAt: "2025-01-15T15:26:00",
          readAt: null,
          isQuickMessage: false,
        },
      ],
      lastMessageAt: "2025-01-15T15:26:00",
      hasUnreadStaffMessages: true,
      hasUnreadGuestMessages: false,
    },
  },
  {
    id: "UT-SH-002",
    type: "shuttle",
    title: "送迎 伊勢市駅→旅館",
    roomId: null,
    scheduledTime: "16:30",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "normal",
    shuttle: {
      reservationId: "RSV005",
      guestName: "高橋 健二",
      guestNameKana: "タカハシ ケンジ",
      numberOfGuests: 4,
      pickupLocation: "伊勢市駅",
      dropoffLocation: "旅館",
      direction: "pickup",
      estimatedDuration: 25,
      shuttleStatus: "not_departed",
      assignedVehicleId: "VEH001",
      guestArrivalNotified: false,
      notes: "団体様4名。大きな荷物あり",
    },
  },
  {
    id: "UT-SH-003",
    type: "shuttle",
    title: "送迎 鳥羽駅→旅館",
    roomId: null,
    scheduledTime: "15:00",
    status: "pending",
    assignedStaffId: null,
    priority: "urgent",
    shuttle: {
      reservationId: "RSV004",
      guestName: "田中 美咲",
      guestNameKana: "タナカ ミサキ",
      numberOfGuests: 2,
      pickupLocation: "鳥羽駅",
      dropoffLocation: "旅館",
      direction: "pickup",
      estimatedDuration: 20,
      shuttleStatus: "not_departed",
      assignedVehicleId: null,
      guestArrivalNotified: false,
      notes: "誕生日のお客様。特別対応",
    },
  },
  // Celebration tasks (お祝いタスク)
  {
    id: "UT-CB-001",
    type: "celebration",
    title: "結婚記念セッティング スタイリッシュスイート",
    roomId: "ROOM-001",
    scheduledTime: "14:00",
    status: "in_progress",
    assignedStaffId: "STF005",
    priority: "high",
    celebration: {
      reservationId: "RSV001",
      guestName: "山田 太郎",
      guestNameKana: "ヤマダ タロウ",
      celebrationType: "wedding_anniversary",
      celebrationDescription: "結婚10周年記念",
      items: [
        { item: "cake", isChecked: true, notes: "チョコレートケーキ" },
        { item: "flowers", isChecked: true, notes: "バラの花束" },
        { item: "champagne", isChecked: false, notes: "モエ・エ・シャンドン" },
        {
          item: "message_card",
          isChecked: true,
          notes: "手書きメッセージカード",
        },
      ],
      executionTime: "19:30",
      notes: "夕食のデザート時にサプライズ演出",
    },
  },
  {
    id: "UT-CB-002",
    type: "celebration",
    title: "バースデーセッティング プレミアムスイート",
    roomId: "ROOM-004",
    scheduledTime: "14:30",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "urgent",
    celebration: {
      reservationId: "RSV004",
      guestName: "田中 美咲",
      guestNameKana: "タナカ ミサキ",
      celebrationType: "birthday",
      celebrationDescription: "奥様のお誕生日",
      items: [
        {
          item: "cake",
          isChecked: false,
          notes: "アレルギー対応ケーキ（乳・小麦不使用）",
        },
        { item: "flowers", isChecked: false, notes: "ユリの花束" },
        {
          item: "champagne",
          isChecked: false,
          notes: "ノンアルコールスパークリング",
        },
        { item: "decoration", isChecked: false, notes: "バルーン装飾" },
        {
          item: "message_card",
          isChecked: false,
          notes: "旅館オリジナルカード",
        },
      ],
      executionTime: "20:00",
      notes: "部屋食後にサプライズ。ご主人様と事前打ち合わせ済み",
    },
  },
  // === 追加タスク ===
  // 清掃タスク（追加）
  {
    id: "UT-HK-005",
    type: "housekeeping",
    title: "客室清掃 コンフォートスイート",
    roomId: "ROOM-002",
    scheduledTime: "11:00",
    status: "pending",
    assignedStaffId: "STF003",
    priority: "normal",
    housekeeping: {
      category: "cleaning",
      reservationId: "RSV003",
      description: "和室スタンダード清掃。単身のお客様。",
      estimatedDuration: 30,
      cleaningChecklist: [
        { item: "bed_making", isChecked: false },
        { item: "floor_cleaning", isChecked: false },
        { item: "bathroom_cleaning", isChecked: false },
        { item: "amenity_check", isChecked: false },
        { item: "garbage_collection", isChecked: false },
      ],
    },
  },
  {
    id: "UT-HK-006",
    type: "housekeeping",
    title: "客室清掃 プレミアムスイート",
    roomId: "ROOM-004",
    scheduledTime: "09:30",
    status: "in_progress",
    assignedStaffId: "STF001",
    priority: "urgent",
    adminMemo: "誕生日サプライズがあるため14:00までに必ず完了させること",
    personalMemo: "露天風呂の温度確認済み。花びら浮かべは14:00に実施予定",
    sharedMemo: "ベッドメイクは特別仕様で。バラの花びらを敷く準備あり",
    housekeeping: {
      category: "cleaning",
      reservationId: "RSV004",
      description: "貴賓室清掃。誕生日のお客様、特別対応必要。",
      estimatedDuration: 90,
      cleaningChecklist: [
        { item: "bed_making", isChecked: true },
        { item: "floor_cleaning", isChecked: true },
        { item: "bathroom_cleaning", isChecked: false },
        { item: "amenity_check", isChecked: false },
        { item: "garbage_collection", isChecked: false },
        { item: "outdoor_bath_cleaning", isChecked: false },
        { item: "window_cleaning", isChecked: false },
        { item: "special_cleaning", isChecked: false },
      ],
    },
  },
  {
    id: "UT-HK-007",
    type: "housekeeping",
    title: "緊急清掃 ふふラグジュアリープレミアムスイート",
    roomId: "ROOM-006",
    scheduledTime: "13:30",
    status: "pending",
    assignedStaffId: null,
    priority: "urgent",
    housekeeping: {
      category: "cleaning",
      reservationId: undefined,
      description: "急なチェックイン対応。早急な清掃が必要。",
      estimatedDuration: 40,
      cleaningChecklist: [
        { item: "bed_making", isChecked: false },
        { item: "floor_cleaning", isChecked: false },
        { item: "bathroom_cleaning", isChecked: false },
        { item: "amenity_check", isChecked: false },
        { item: "garbage_collection", isChecked: false },
      ],
    },
  },
  // 点検タスク（追加）
  {
    id: "UT-HK-008",
    type: "housekeeping",
    title: "点検 プレシャススイート",
    roomId: "ROOM-003",
    scheduledTime: "10:30",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "normal",
    housekeeping: {
      category: "inspection",
      reservationId: "RSV002",
      description: "清掃完了後の最終点検。ベビーベッド設置確認含む。",
      estimatedDuration: 15,
    },
  },
  {
    id: "UT-HK-009",
    type: "housekeeping",
    title: "点検 コンフォートスイート",
    roomId: "ROOM-002",
    scheduledTime: "12:00",
    status: "in_progress",
    assignedStaffId: "STF001",
    priority: "high",
    housekeeping: {
      category: "inspection",
      reservationId: "RSV003",
      description: "清掃品質確認。設備点検含む（エアコン異音報告あり）。",
      estimatedDuration: 20,
    },
  },
  {
    id: "UT-HK-010",
    type: "housekeeping",
    title: "点検 プレミアムスイート",
    roomId: "ROOM-004",
    scheduledTime: "14:30",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "urgent",
    housekeeping: {
      category: "inspection",
      reservationId: "RSV004",
      description: "貴賓室の特別点検。誕生日サプライズ準備前の最終確認。",
      estimatedDuration: 25,
    },
  },
  {
    id: "UT-HK-011",
    type: "housekeeping",
    title: "点検 ふふラグジュアリーコーナースイート",
    roomId: "ROOM-005",
    scheduledTime: "13:00",
    status: "completed",
    assignedStaffId: "STF001",
    priority: "normal",
    housekeeping: {
      category: "inspection",
      reservationId: "RSV005",
      description: "団体様用客室の最終点検完了。",
      estimatedDuration: 15,
      completedAt: "13:12",
    },
  },
  // ターンダウンタスク
  {
    id: "UT-HK-012",
    type: "housekeeping",
    title: "ターンダウン プレシャススイート",
    roomId: "ROOM-003",
    scheduledTime: "19:00",
    status: "pending",
    assignedStaffId: "STF001",
    priority: "normal",
    housekeeping: {
      category: "turndown",
      reservationId: "RSV002",
      description: "スイートルームのターンダウンサービス。",
      estimatedDuration: 15,
    },
  },
  // 露天風呂準備タスク
  {
    id: "UT-HK-013",
    type: "housekeeping",
    title: "露天風呂準備 プレミアムスイート",
    roomId: "ROOM-004",
    scheduledTime: "14:00",
    status: "pending",
    assignedStaffId: "STF003",
    priority: "high",
    housekeeping: {
      category: "bath",
      reservationId: "RSV004",
      description: "貴賓室専用露天風呂。花びら浮かべ対応。",
      estimatedDuration: 20,
    },
  },
  // 配膳タスク（追加）
  {
    id: "UT-ML-004",
    type: "meal",
    title: "朝食配膳 スタイリッシュスイート",
    roomId: "ROOM-001",
    scheduledTime: "08:00",
    status: "completed",
    assignedStaffId: "STF002",
    priority: "normal",
    meal: {
      reservationId: "RSV001",
      guestName: "山田 太郎",
      guestNameKana: "ヤマダ タロウ",
      mealType: "breakfast",
      courseType: "standard",
      guestCount: 2,
      dietaryRestrictions: ["shellfish"],
      dietaryNotes: "甲殻類アレルギー",
      mealStatus: "completed",
      isAnniversaryRelated: false,
    },
  },
  {
    id: "UT-ML-005",
    type: "meal",
    title: "誕生日特別ディナー プレミアムスイート",
    roomId: "ROOM-004",
    scheduledTime: "20:30",
    status: "pending",
    assignedStaffId: "STF002",
    priority: "urgent",
    meal: {
      reservationId: "RSV004",
      guestName: "田中 美咲",
      guestNameKana: "タナカ ミサキ",
      mealType: "special",
      courseType: "kaiseki",
      guestCount: 2,
      dietaryRestrictions: ["dairy", "wheat"],
      dietaryNotes: "乳製品・小麦アレルギー対応のケーキ提供",
      mealStatus: "preparing",
      isAnniversaryRelated: true,
      notes: "誕生日ケーキ提供時にサプライズ演出",
    },
  },
  {
    id: "UT-ML-006",
    type: "meal",
    title: "夕食配膳 ふふラグジュアリーコーナースイート",
    roomId: "ROOM-005",
    scheduledTime: "19:30",
    status: "pending",
    assignedStaffId: "STF006",
    priority: "normal",
    meal: {
      reservationId: "RSV005",
      guestName: "高橋 健二",
      guestNameKana: "タカハシ ケンジ",
      mealType: "dinner",
      courseType: "standard",
      guestCount: 4,
      dietaryRestrictions: [],
      mealStatus: "preparing",
      isAnniversaryRelated: false,
      notes: "団体様4名分",
    },
  },
  {
    id: "UT-ML-007",
    type: "meal",
    title: "追加注文確認 プレシャススイート",
    roomId: "ROOM-003",
    scheduledTime: "18:20",
    status: "in_progress",
    assignedStaffId: "STF002",
    priority: "high",
    meal: {
      reservationId: "RSV002",
      guestName: "佐藤 花子",
      guestNameKana: "サトウ ハナコ",
      mealType: "dinner",
      courseType: "premium",
      guestCount: 3,
      dietaryRestrictions: [],
      mealStatus: "needs_check",
      needsCheck: true,
      isAnniversaryRelated: false,
      notes: "お子様用ジュース追加注文あり",
    },
  },
  // 送迎タスク（追加）
  {
    id: "UT-SH-004",
    type: "shuttle",
    title: "送迎完了 鳥羽駅→旅館",
    roomId: null,
    scheduledTime: "10:00",
    status: "completed",
    assignedStaffId: "STF004",
    priority: "normal",
    shuttle: {
      reservationId: "RSV001",
      guestName: "山田 太郎",
      guestNameKana: "ヤマダ タロウ",
      numberOfGuests: 2,
      pickupLocation: "鳥羽駅",
      dropoffLocation: "旅館",
      direction: "pickup",
      estimatedDuration: 20,
      shuttleStatus: "completed",
      assignedVehicleId: "VEH001",
      guestArrivalNotified: true,
    },
  },
  {
    id: "UT-SH-005",
    type: "shuttle",
    title: "送迎 旅館→中部国際空港",
    roomId: null,
    scheduledTime: "09:00",
    status: "pending",
    assignedStaffId: "STF004",
    priority: "high",
    shuttle: {
      reservationId: "RSV002",
      guestName: "佐藤 花子",
      guestNameKana: "サトウ ハナコ",
      numberOfGuests: 3,
      pickupLocation: "旅館",
      dropoffLocation: "中部国際空港",
      direction: "dropoff",
      estimatedDuration: 60,
      shuttleStatus: "not_departed",
      assignedVehicleId: "VEH001",
      guestArrivalNotified: false,
      notes: "ベビーカーあり。余裕を持って出発",
    },
  },
  {
    id: "UT-SH-006",
    type: "shuttle",
    title: "送迎 近鉄鳥羽駅→旅館",
    roomId: null,
    scheduledTime: "14:00",
    status: "in_progress",
    assignedStaffId: "STF004",
    priority: "normal",
    shuttle: {
      reservationId: undefined,
      guestName: "渡辺 明",
      guestNameKana: "ワタナベ アキラ",
      numberOfGuests: 2,
      pickupLocation: "近鉄鳥羽駅",
      dropoffLocation: "旅館",
      direction: "pickup",
      estimatedDuration: 15,
      shuttleStatus: "arrived",
      assignedVehicleId: "VEH002",
      guestArrivalNotified: true,
      notes: "到着連絡済み。改札出口で待機中",
    },
  },
  // お祝いタスク（追加）
  {
    id: "UT-CB-003",
    type: "celebration",
    title: "還暦お祝い プレシャススイート",
    roomId: "ROOM-003",
    scheduledTime: "18:30",
    status: "completed",
    assignedStaffId: "STF005",
    priority: "normal",
    celebration: {
      reservationId: "RSV002",
      guestName: "佐藤 花子",
      guestNameKana: "サトウ ハナコ",
      celebrationType: "other",
      celebrationDescription: "還暦のお祝い（おばあ様）",
      items: [
        {
          item: "cake",
          isChecked: true,
          notes: "還暦ケーキ（赤いデコレーション）",
        },
        { item: "flowers", isChecked: true, notes: "赤いカーネーション" },
        { item: "message_card", isChecked: true },
      ],
      executionTime: "18:30",
      notes: "夕食開始時に提供完了",
      completionReport: "お客様大変喜んでいただけました。記念撮影のお手伝いも実施。",
    },
  },
  {
    id: "UT-CB-004",
    type: "celebration",
    title: "退職祝い ふふラグジュアリーコーナースイート",
    roomId: "ROOM-005",
    scheduledTime: "20:00",
    status: "pending",
    assignedStaffId: "STF002",
    priority: "normal",
    celebration: {
      reservationId: "RSV005",
      guestName: "高橋 健二",
      guestNameKana: "タカハシ ケンジ",
      celebrationType: "other",
      celebrationDescription: "退職祝い（団体様）",
      items: [
        {
          item: "champagne",
          isChecked: false,
          notes: "スパークリングワイン4人分",
        },
        {
          item: "message_card",
          isChecked: false,
          notes: "色紙（お客様持込）への記入依頼",
        },
      ],
      executionTime: "20:00",
      notes: "乾杯時にスパークリング提供",
    },
  },
];

// === Unified Task Helper Functions ===
export const getUnifiedTaskById = (id: string): UnifiedTask | undefined =>
  mockUnifiedTasks.find((t) => t.id === id);

export const getUnifiedTasksByStaff = (staffId: string): UnifiedTask[] =>
  mockUnifiedTasks.filter((t) => t.assignedStaffId === staffId);

export const getUnifiedTasksByType = (type: UnifiedTask["type"]): UnifiedTask[] =>
  mockUnifiedTasks.filter((t) => t.type === type);

export const getPendingUnifiedTasks = (): UnifiedTask[] =>
  mockUnifiedTasks.filter((t) => t.status !== "completed");
