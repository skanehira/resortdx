// === Reservation Types ===
export type ReservationStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled";

export interface Reservation {
  id: string;
  guestName: string;
  guestNameKana: string;
  roomId: string;
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  numberOfGuests: number;
  status: ReservationStatus;
  specialRequests: string[];
  anniversary?: AnniversaryInfo;
  createdAt: string;
}

export interface AnniversaryInfo {
  type: "birthday" | "wedding" | "other";
  description: string;
  giftRequested: boolean;
}

export type RoomType = "standard" | "deluxe" | "suite" | "premium_suite";

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: "和室スタンダード",
  deluxe: "和洋室デラックス",
  suite: "特別室スイート",
  premium_suite: "貴賓室",
};

// 客室タイプマスター
export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  hasOutdoorBath: boolean;
}

// === Task Types ===
export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskCategory =
  | "cleaning" // 客室清掃
  | "inspection" // 点検
  | "meal_service" // 配膳
  | "turndown" // ターンダウン
  | "pickup" // 送迎
  | "bath" // 風呂準備
  | "celebration" // お祝い演出
  | "other"; // その他

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  cleaning: "客室清掃",
  inspection: "点検",
  meal_service: "配膳",
  turndown: "ターンダウン",
  pickup: "送迎",
  bath: "風呂準備",
  celebration: "お祝い演出",
  other: "その他",
};

export const TASK_CATEGORY_ICONS: Record<TaskCategory, string> = {
  cleaning: "🧹",
  inspection: "🔍",
  meal_service: "🍱",
  turndown: "🛏️",
  pickup: "🚗",
  bath: "♨️",
  celebration: "🎉",
  other: "📋",
};

// 清掃チェックリスト項目
export type CleaningChecklistItemType =
  | "bed_making" // ベッドメイキング
  | "floor_cleaning" // 床清掃
  | "bathroom_cleaning" // バスルーム清掃
  | "amenity_check" // アメニティ補充確認
  | "garbage_collection" // ゴミ回収
  | "outdoor_bath_cleaning" // 露天風呂清掃（suite以上）
  | "window_cleaning" // 窓拭き（suite以上）
  | "special_cleaning"; // 特別清掃（premium_suite）

export const CLEANING_CHECKLIST_LABELS: Record<CleaningChecklistItemType, string> = {
  bed_making: "ベッドメイキング",
  floor_cleaning: "床清掃（掃除機）",
  bathroom_cleaning: "バスルーム清掃",
  amenity_check: "アメニティ補充確認",
  garbage_collection: "ゴミ回収",
  outdoor_bath_cleaning: "露天風呂清掃",
  window_cleaning: "窓拭き",
  special_cleaning: "特別清掃",
};

export interface CleaningChecklistItem {
  item: CleaningChecklistItemType;
  isChecked: boolean;
  notes?: string;
}

// 部屋タイプ別のデフォルトチェックリスト項目
export const DEFAULT_CLEANING_ITEMS: Record<RoomType, CleaningChecklistItemType[]> = {
  standard: [
    "bed_making",
    "floor_cleaning",
    "bathroom_cleaning",
    "amenity_check",
    "garbage_collection",
  ],
  deluxe: [
    "bed_making",
    "floor_cleaning",
    "bathroom_cleaning",
    "amenity_check",
    "garbage_collection",
  ],
  suite: [
    "bed_making",
    "floor_cleaning",
    "bathroom_cleaning",
    "amenity_check",
    "garbage_collection",
    "outdoor_bath_cleaning",
    "window_cleaning",
  ],
  premium_suite: [
    "bed_making",
    "floor_cleaning",
    "bathroom_cleaning",
    "amenity_check",
    "garbage_collection",
    "outdoor_bath_cleaning",
    "window_cleaning",
    "special_cleaning",
  ],
};

// 客室清掃ステータス（マップ表示用）
export type RoomCleaningStatus = "not_cleaned" | "cleaning" | "cleaned" | "inspected";

export const ROOM_CLEANING_STATUS_LABELS: Record<RoomCleaningStatus, string> = {
  not_cleaned: "未清掃",
  cleaning: "清掃中",
  cleaned: "清掃済",
  inspected: "点検済",
};

export interface Task {
  id: string;
  reservationId: string;
  category: TaskCategory;
  title: string;
  description: string;
  roomId: string;
  scheduledTime: string;
  estimatedDuration: number; // minutes
  status: TaskStatus;
  assignedStaffId: string | null;
  priority: "normal" | "high" | "urgent";
  isAnniversaryRelated: boolean;
  completedAt?: string;
  notes?: string;
  // 清掃タスク用チェックリスト
  cleaningChecklist?: CleaningChecklistItem[];
  // 点検タスク用: 関連する清掃タスクID
  relatedCleaningTaskId?: string;
}

// === Staff Types ===
export type StaffRole =
  | "cleaning" // 清掃スタッフ
  | "service" // 接客スタッフ
  | "kitchen" // 調理場スタッフ
  | "driver" // 送迎ドライバー
  | "concierge" // コンシェルジュ
  | "manager" // マネージャー
  | "front" // フロント
  | "guest"; // ゲスト

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  cleaning: "清掃",
  service: "接客",
  kitchen: "調理場",
  driver: "送迎",
  concierge: "コンシェルジュ",
  manager: "マネージャー",
  front: "フロント",
  guest: "ゲスト",
};

// スタッフステータス（5段階）
export type StaffStatus =
  | "on_duty" // 出勤中
  | "on_break" // 休憩中
  | "day_off" // 休日
  | "absent" // 欠勤
  | "out"; // 外出中

export const STAFF_STATUS_LABELS: Record<StaffStatus, string> = {
  on_duty: "出勤中",
  on_break: "休憩中",
  day_off: "休日",
  absent: "欠勤",
  out: "外出中",
};

// 緊急連絡先
export interface EmergencyContact {
  phone: string;
  relationship: string;
}

// 雇用形態
export type EmploymentType = "full_time" | "part_time" | "temp" | "dispatch";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "正社員",
  part_time: "パート",
  temp: "アルバイト",
  dispatch: "派遣",
};

// 資格
export type Certification =
  | "driver_license" // 普通自動車免許
  | "driver_license_2" // 中型自動車免許
  | "cooking_license" // 調理師免許
  | "food_hygiene" // 食品衛生責任者
  | "sommelier" // ソムリエ
  | "hotel_business" // ホテルビジネス実務検定
  | "service_hospitality" // サービス接遇検定
  | "first_aid"; // 救急法救急員

export const CERTIFICATION_LABELS: Record<Certification, string> = {
  driver_license: "普通自動車免許",
  driver_license_2: "中型自動車免許",
  cooking_license: "調理師免許",
  food_hygiene: "食品衛生責任者",
  sommelier: "ソムリエ",
  hotel_business: "ホテルビジネス実務検定",
  service_hospitality: "サービス接遇検定",
  first_aid: "救急法救急員",
};

// 言語能力
export type Language = "japanese" | "english" | "chinese" | "korean" | "other";

export const LANGUAGE_LABELS: Record<Language, string> = {
  japanese: "日本語",
  english: "英語",
  chinese: "中国語",
  korean: "韓国語",
  other: "その他",
};

// 担当エリア
export type AssignedArea = "east_wing" | "west_wing" | "main_building" | "annex" | "all";

export const ASSIGNED_AREA_LABELS: Record<AssignedArea, string> = {
  east_wing: "東館",
  west_wing: "西館",
  main_building: "本館",
  annex: "別館",
  all: "全エリア",
};

export interface Staff {
  id: string;
  name: string;
  nameKana: string;
  role: StaffRole;
  skills: TaskCategory[];
  status: StaffStatus;
  shiftStart: string;
  shiftEnd: string;
  currentTaskId: string | null;
  avatarColor: string;
  // 基本情報
  employmentType: EmploymentType;
  hireDate: string;
  phoneNumber: string;
  // スキル・資格
  certifications: Certification[];
  languages: Language[];
  assignedArea: AssignedArea;
  // 連絡先・管理
  emergencyContact?: EmergencyContact;
  notes?: string;
}

// === Task Template Types ===
export interface TaskTemplate {
  id: string;
  name: string;
  category: TaskCategory;
  description: string;
  defaultDuration: number;
  applicableRoomTypes: RoomType[];
  triggerConditions: TriggerCondition[];
  relativeTime: RelativeTimeConfig;
}

export interface TriggerCondition {
  type: "check_in" | "check_out" | "anniversary" | "guest_count" | "room_type";
  value?: string | number;
}

export interface RelativeTimeConfig {
  reference: "check_in" | "check_out" | "previous_task";
  offsetMinutes: number;
}

// === View State Types ===
export type AdminPage =
  | "dashboard"
  | "reservations"
  | "equipment"
  | "shuttle"
  | "meal"
  | "celebration"
  | "task_history"
  | "staff_messages"
  | "settings";

export interface FilterState {
  date: string;
  status?: TaskStatus;
  category?: TaskCategory;
  staffId?: string;
  roomId?: string;
}

// === Statistics Types ===
export interface DailyStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalReservations: number;
  checkInsToday: number;
  checkOutsToday: number;
  anniversaryGuests: number;
}

// === Timeline Types ===
export interface TimelineSlot {
  time: string;
  tasks: Task[];
}

export interface RoomTimeline {
  roomId: string;
  roomType: RoomType;
  reservation: Reservation | null;
  slots: TimelineSlot[];
}

// === Equipment Management Types ===

// アメニティ（消耗品）タイプ
export type AmenityType =
  | "shampoo" // シャンプー
  | "conditioner" // コンディショナー
  | "body_soap" // ボディソープ
  | "toothbrush" // 歯ブラシセット
  | "towel_face" // フェイスタオル
  | "towel_bath" // バスタオル
  | "yukata" // 浴衣
  | "slippers"; // スリッパ

export const AMENITY_TYPE_LABELS: Record<AmenityType, string> = {
  shampoo: "シャンプー",
  conditioner: "コンディショナー",
  body_soap: "ボディソープ",
  toothbrush: "歯ブラシセット",
  towel_face: "フェイスタオル",
  towel_bath: "バスタオル",
  yukata: "浴衣",
  slippers: "スリッパ",
};

// 設備タイプ
export type EquipmentType =
  | "air_conditioner" // エアコン
  | "tv" // テレビ
  | "refrigerator" // 冷蔵庫
  | "wifi_router" // WiFiルーター
  | "safe" // 金庫
  | "hair_dryer" // ドライヤー
  | "kettle"; // 電気ケトル

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  air_conditioner: "エアコン",
  tv: "テレビ",
  refrigerator: "冷蔵庫",
  wifi_router: "WiFiルーター",
  safe: "金庫",
  hair_dryer: "ドライヤー",
  kettle: "電気ケトル",
};

// 残量レベル（4段階）
export type StockLevel = "full" | "half" | "low" | "empty";

export const STOCK_LEVEL_LABELS: Record<StockLevel, string> = {
  full: "満タン",
  half: "半分",
  low: "少ない",
  empty: "空",
};

export const STOCK_LEVEL_VALUES: Record<StockLevel, number> = {
  full: 4,
  half: 3,
  low: 2,
  empty: 1,
};

// 設備状態
export type EquipmentStatusType = "working" | "needs_maintenance" | "broken";

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatusType, string> = {
  working: "正常",
  needs_maintenance: "要メンテナンス",
  broken: "故障",
};

// アメニティ（消耗品）インターフェース
export interface RoomAmenity {
  id: string;
  roomId: string;
  type: AmenityType;
  stockLevel: StockLevel;
  threshold: StockLevel; // このレベル以下で補充タスク生成
  lastCheckedAt: string;
  lastCheckedBy: string | null;
}

// 設備インターフェース
export interface RoomEquipment {
  id: string;
  roomId: string;
  type: EquipmentType;
  status: EquipmentStatusType;
  lastMaintenanceAt: string | null;
  notes: string | null;
}

// === Shuttle Management Types ===

// 送迎ステータス（5段階）
export type ShuttleStatus =
  | "not_departed" // 未出発
  | "heading" // 向かい中
  | "arrived" // 到着済
  | "boarded" // 乗車済
  | "completed"; // 完了

export const SHUTTLE_STATUS_LABELS: Record<ShuttleStatus, string> = {
  not_departed: "未出発",
  heading: "向かい中",
  arrived: "到着済",
  boarded: "乗車済",
  completed: "完了",
};

// ゲスト向けラベル
export const SHUTTLE_STATUS_GUEST_LABELS: Record<ShuttleStatus, string> = {
  not_departed: "準備中",
  heading: "お迎えに向かっています",
  arrived: "到着しました",
  boarded: "ご乗車確認済み",
  completed: "送迎完了",
};

// 車両ステータス
export type VehicleStatus = "available" | "in_use" | "maintenance";

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "利用可能",
  in_use: "稼働中",
  maintenance: "メンテナンス中",
};

// 車両インターフェース
export interface Vehicle {
  id: string;
  name: string; // "1号車"
  licensePlate: string; // "三重 500 あ 1234"
  capacity: number;
  status: VehicleStatus;
  currentDriverId: string | null;
  currentShuttleTaskId: string | null;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string | null;
  notes: string | null;
}

// 送迎タスクインターフェース
export interface ShuttleTask {
  id: string;
  reservationId: string;
  guestName: string;
  guestNameKana: string;
  numberOfGuests: number;
  pickupLocation: string; // "鳥羽駅"
  dropoffLocation: string; // "旅館"
  direction: "pickup" | "dropoff";
  scheduledTime: string;
  estimatedDuration: number;
  shuttleStatus: ShuttleStatus;
  assignedVehicleId: string | null;
  assignedDriverId: string | null;
  priority: "normal" | "high" | "urgent";
  guestArrivalNotified: boolean;
  guestNotifiedAt?: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
}

// === Meal Service Types ===

// 配膳ワークフローステータス（進行状態のみ）
export type MealProgressStatus = "preparing" | "serving" | "completed";

// 配膳表示ステータス（UI表示用、再確認要を含む）
export type MealDisplayStatus = MealProgressStatus | "needs_check";

// 後方互換性のためのエイリアス（非推奨、将来削除予定）
/** @deprecated Use MealProgressStatus or MealDisplayStatus instead */
export type MealStatus = MealDisplayStatus;

export const MEAL_STATUS_LABELS: Record<MealDisplayStatus, string> = {
  preparing: "準備中",
  serving: "配膳中",
  completed: "完了",
  needs_check: "再確認要",
};

// 食事タイプ
export type MealType = "breakfast" | "dinner" | "room_service" | "special";

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "朝食",
  dinner: "夕食",
  room_service: "部屋食",
  special: "特別料理",
};

// コースタイプ
export type CourseType = "standard" | "premium" | "kaiseki" | "kids" | "vegetarian";

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  standard: "スタンダード",
  premium: "プレミアム",
  kaiseki: "懐石",
  kids: "お子様",
  vegetarian: "ベジタリアン",
};

// アレルギー・食事制限
export type DietaryRestriction =
  | "shellfish" // 甲殻類
  | "egg" // 卵
  | "dairy" // 乳製品
  | "wheat" // 小麦
  | "soba" // そば
  | "peanut" // 落花生
  | "fish" // 魚介類
  | "other"; // その他

export const DIETARY_RESTRICTION_LABELS: Record<DietaryRestriction, string> = {
  shellfish: "甲殻類",
  egg: "卵",
  dairy: "乳製品",
  wheat: "小麦",
  soba: "そば",
  peanut: "落花生",
  fish: "魚介類",
  other: "その他",
};

// 配膳タスクの共通フィールド
interface MealTaskBase {
  id: string;
  reservationId: string;
  guestName: string;
  guestNameKana: string;
  roomId: string;
  mealType: MealType;
  courseType: CourseType;
  scheduledTime: string;
  guestCount: number;
  dietaryRestrictions: DietaryRestriction[];
  dietaryNotes: string | null;
  assignedStaffId: string | null;
  priority: "normal" | "high" | "urgent";
  isAnniversaryRelated: boolean;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
}

// 配膳タスクの状態（型安全な状態遷移）
// - 進行中（preparing/serving）: needsCheckを設定可能
// - 完了（completed）: needsCheckは必ずfalse（再確認不要）
type MealTaskInProgress = MealTaskBase & {
  mealStatus: "preparing" | "serving";
  needsCheck: boolean;
};

type MealTaskCompleted = MealTaskBase & {
  mealStatus: "completed";
  needsCheck: false;
};

// 配膳タスクインターフェース（discriminated union）
export type MealTask = MealTaskInProgress | MealTaskCompleted;

// QR注文通知タイプ
export type OrderType = "drink" | "menu_change" | "timing_change" | "other";

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  drink: "追加ドリンク",
  menu_change: "メニュー変更",
  timing_change: "時間変更",
  other: "その他",
};

// QR注文通知インターフェース
export interface MealOrderNotification {
  id: string;
  reservationId: string;
  roomId: string;
  guestName: string;
  orderType: OrderType;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// === Celebration Types ===

// お祝いタイプ
export type CelebrationType = "birthday" | "wedding_anniversary" | "other";

export const CELEBRATION_TYPE_LABELS: Record<CelebrationType, string> = {
  birthday: "誕生日",
  wedding_anniversary: "結婚記念日",
  other: "その他",
};

// お祝いアイテム
export type CelebrationItem =
  | "cake"
  | "flowers"
  | "champagne"
  | "decoration"
  | "message_card"
  | "other";

export const CELEBRATION_ITEM_LABELS: Record<CelebrationItem, string> = {
  cake: "ケーキ",
  flowers: "花束",
  champagne: "シャンパン",
  decoration: "装飾",
  message_card: "メッセージカード",
  other: "その他",
};

// お祝いアイテムチェック状態
export interface CelebrationItemCheck {
  item: CelebrationItem;
  isChecked: boolean;
  notes?: string;
}

// お祝い対応タスクインターフェース
export interface CelebrationTask {
  id: string;
  reservationId: string;
  guestName: string;
  guestNameKana: string;
  roomId: string;
  celebrationType: CelebrationType;
  celebrationDescription: string;
  items: CelebrationItemCheck[];
  executionTime: string;
  status: TaskStatus; // 既存の3段階を流用
  assignedStaffId: string | null;
  priority: "normal" | "high" | "urgent";
  notes: string | null;
  completionReport: string | null;
  completedAt: string | null;
  createdAt: string;
}

// === Unified Task Types (統合タスクシステム) ===

// 統合タスクタイプ
export type UnifiedTaskType =
  | "housekeeping" // 清掃・点検・ターンダウン・風呂準備
  | "meal" // 配膳
  | "shuttle" // 送迎
  | "celebration" // お祝い
  | "help_request"; // ヘルプ依頼

export const UNIFIED_TASK_TYPE_LABELS: Record<UnifiedTaskType, string> = {
  housekeeping: "清掃",
  meal: "配膳",
  shuttle: "送迎",
  celebration: "お祝い",
  help_request: "ヘルプ",
};

export const UNIFIED_TASK_TYPE_ICONS: Record<UnifiedTaskType, string> = {
  housekeeping: "🧹",
  meal: "🍱",
  shuttle: "🚗",
  celebration: "🎉",
  help_request: "🆘",
};

// 統合タスク用の共通ステータス取得
export type UnifiedTaskStatus = "pending" | "in_progress" | "completed";

// ハウスキーピングデータ
export interface HousekeepingData {
  category: "cleaning" | "inspection" | "turndown" | "bath";
  reservationId?: string;
  description?: string;
  estimatedDuration?: number;
  completedAt?: string;
  cleaningChecklist?: CleaningChecklistItem[];
  relatedCleaningTaskId?: string;
  // 点検タスク用: 設備報告
  equipmentReport?: EquipmentReport;
}

// 設備報告（点検タスク完了時に記録）
export interface EquipmentReport {
  inspectedAt: string;
  inspectedBy: string;
  amenityUpdates: AmenityUpdate[];
  equipmentUpdates: EquipmentUpdate[];
}

export interface AmenityUpdate {
  amenityId: string;
  type: AmenityType;
  previousLevel: StockLevel;
  newLevel: StockLevel;
}

export interface EquipmentUpdate {
  equipmentId: string;
  type: EquipmentType;
  previousStatus: EquipmentStatusType;
  newStatus: EquipmentStatusType;
  notes?: string;
}

// 配膳データ
export interface MealData {
  reservationId?: string;
  guestName: string;
  guestNameKana?: string;
  mealType: MealType;
  courseType: CourseType;
  guestCount: number;
  dietaryRestrictions: DietaryRestriction[];
  dietaryNotes?: string | null;
  mealStatus: MealStatus;
  needsCheck?: boolean;
  isAnniversaryRelated?: boolean;
  notes?: string | null;
}

// 送迎データ
export interface ShuttleData {
  reservationId?: string;
  guestName: string;
  guestNameKana?: string;
  numberOfGuests: number;
  pickupLocation: string;
  dropoffLocation: string;
  direction: "pickup" | "dropoff";
  estimatedDuration?: number;
  shuttleStatus: ShuttleStatus;
  assignedVehicleId: string | null;
  guestArrivalNotified: boolean;
  notes?: string | null;
  // メッセージング機能用
  messages?: ShuttleMessage[];
  lastMessageAt?: string | null;
  hasUnreadStaffMessages?: boolean; // スタッフ側で未読があるか
  hasUnreadGuestMessages?: boolean; // ゲスト側で未読があるか
}

// お祝いデータ
export interface CelebrationData {
  reservationId?: string;
  guestName: string;
  guestNameKana?: string;
  celebrationType: CelebrationType;
  celebrationDescription: string;
  items: CelebrationItemCheck[];
  executionTime?: string;
  completionReport?: string | null;
  notes?: string | null;
}

// ヘルプ依頼データ
export interface HelpRequestData {
  requesterId: string;
  requesterName: string;
  targetStaffIds: string[] | "all"; // "all"は全スタッフへのブロードキャスト
  message: string;
  helpStatus: HelpRequestStatus;
  acceptedBy: string | null;
  acceptedAt: string | null;
  originalTaskId?: string; // 関連タスクID
}

export type HelpRequestStatus = "pending" | "accepted" | "completed" | "cancelled";

export const HELP_REQUEST_STATUS_LABELS: Record<HelpRequestStatus, string> = {
  pending: "依頼中",
  accepted: "対応中",
  completed: "完了",
  cancelled: "キャンセル",
};

// 統合タスクインターフェース
export interface UnifiedTask {
  id: string;
  type: UnifiedTaskType;
  title: string;
  description?: string;
  roomId: string | null;
  scheduledTime: string;
  estimatedDuration?: number;
  status: UnifiedTaskStatus;
  assignedStaffId: string | null;
  priority: "normal" | "high" | "urgent";
  isAnniversaryRelated?: boolean;
  completedAt?: string | null;
  createdAt?: string;
  notes?: string | null;
  // メモフィールド
  adminMemo?: string | null; // 管理者用メモ（管理画面のみ表示）
  personalMemo?: string | null; // 担当者個人メモ（担当者のみ表示）
  sharedMemo?: string | null; // 全スタッフ共有メモ（引継ぎ用）
  // タイプ固有データ（1つのみ設定）
  housekeeping?: HousekeepingData;
  meal?: MealData;
  shuttle?: ShuttleData;
  celebration?: CelebrationData;
  helpRequest?: HelpRequestData;
}

// === Staff Message Types (スタッフメッセージ) ===

export interface StaffMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  sentAt: string;
  readAt?: string | null;
  relatedTaskId?: string | null;
  // 管理者からの返信
  reply?: {
    content: string;
    repliedAt: string;
    repliedBy: string;
  } | null;
}

// === Shuttle Message Types (送迎メッセージング) ===

// 送迎メッセージタイプ（緊急度識別用）
export type ShuttleMessageType = "normal" | "arrival" | "delay" | "sos";

export const SHUTTLE_MESSAGE_TYPE_LABELS: Record<ShuttleMessageType, string> = {
  normal: "通常",
  arrival: "到着連絡",
  delay: "遅延連絡",
  sos: "緊急連絡",
};

// 送迎メッセージインターフェース
export interface ShuttleMessage {
  id: string;
  shuttleTaskId: string;
  senderType: "staff" | "guest";
  senderId: string;
  senderName: string;
  content: string;
  messageType: ShuttleMessageType;
  sentAt: string;
  readAt: string | null;
  isQuickMessage: boolean; // プリセットメッセージかどうか
}

// スタッフ用クイックメッセージ
export const STAFF_QUICK_MESSAGES = [
  { id: "staff_5min", content: "あと5分で到着します", type: "normal" as const },
  { id: "staff_arrived", content: "到着しました", type: "arrival" as const },
  {
    id: "staff_where",
    content: "お待ちの場所を教えてください",
    type: "normal" as const,
  },
  {
    id: "staff_wait",
    content: "少々お待ちください",
    type: "normal" as const,
  },
] as const;

// ゲスト用クイックメッセージ
export const GUEST_QUICK_MESSAGES = [
  {
    id: "guest_arrived",
    content: "今、指定場所に到着しました",
    type: "arrival" as const,
  },
  {
    id: "guest_delay",
    content: "少し遅れそうです",
    type: "delay" as const,
  },
] as const;

// ゲスト用SOS/緊急メッセージ
export const GUEST_SOS_MESSAGE = {
  id: "guest_sos",
  content: "場所がわかりません、助けてください",
  type: "sos" as const,
} as const;

// === Master Data Types (マスターデータ) ===

// アメニティ種類マスター
export interface AmenityTypeMaster {
  id: string;
  key: string;
  label: string;
  defaultThreshold: StockLevel;
  isActive: boolean;
}

// 設備種類マスター
export interface EquipmentTypeMaster {
  id: string;
  key: string;
  label: string;
  isActive: boolean;
}

// === Staff Chat Types (スタッフチャット) ===

export type ChatType = "dm" | "group";

export interface ChatRoom {
  id: string;
  type: ChatType;
  name?: string;
  participants: string[];
  lastMessageAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  readBy: string[];
}

// === Staff Shared Notes (スタッフ共有メモ) ===

// 全スタッフ向け共有メモ（引継ぎ・伝達用）
export interface StaffSharedNote {
  id: string;
  content: string;
  createdBy: string; // スタッフID
  createdByName: string; // スタッフ名
  createdAt: string;
  updatedAt?: string;
  isImportant: boolean; // 重要フラグ
  expiresAt?: string | null; // 有効期限（nullの場合は無期限）
}
