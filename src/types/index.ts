// === Reservation Types ===
export type ReservationStatus =
	| "confirmed"
	| "checked_in"
	| "checked_out"
	| "cancelled";

export interface Reservation {
	id: string;
	guestName: string;
	guestNameKana: string;
	roomNumber: string;
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

// === Task Types ===
export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskCategory =
	| "cleaning" // 客室清掃
	| "meal_service" // 配膳
	| "turndown" // ターンダウン
	| "pickup" // 送迎
	| "bath" // 風呂準備
	| "celebration" // お祝い演出
	| "other"; // その他

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
	cleaning: "客室清掃",
	meal_service: "配膳",
	turndown: "ターンダウン",
	pickup: "送迎",
	bath: "風呂準備",
	celebration: "お祝い演出",
	other: "その他",
};

export const TASK_CATEGORY_ICONS: Record<TaskCategory, string> = {
	cleaning: "🧹",
	meal_service: "🍱",
	turndown: "🛏️",
	pickup: "🚗",
	bath: "♨️",
	celebration: "🎉",
	other: "📋",
};

export interface Task {
	id: string;
	reservationId: string;
	category: TaskCategory;
	title: string;
	description: string;
	roomNumber: string;
	scheduledTime: string;
	estimatedDuration: number; // minutes
	status: TaskStatus;
	assignedStaffId: string | null;
	priority: "normal" | "high" | "urgent";
	isAnniversaryRelated: boolean;
	completedAt?: string;
	notes?: string;
}

// === Staff Types ===
export type StaffRole =
	| "cleaning" // 清掃スタッフ
	| "service" // 接客スタッフ
	| "kitchen" // 調理場スタッフ
	| "driver" // 送迎ドライバー
	| "concierge" // コンシェルジュ
	| "manager"; // マネージャー

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
	cleaning: "清掃",
	service: "接客",
	kitchen: "調理場",
	driver: "送迎",
	concierge: "コンシェルジュ",
	manager: "マネージャー",
};

export interface Staff {
	id: string;
	name: string;
	nameKana: string;
	role: StaffRole;
	skills: TaskCategory[];
	isOnDuty: boolean;
	shiftStart: string;
	shiftEnd: string;
	currentTaskId: string | null;
	avatarColor: string;
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
	| "templates"
	| "staff_monitor"
	| "equipment"
	| "shuttle"
	| "task_history";

export interface FilterState {
	date: string;
	status?: TaskStatus;
	category?: TaskCategory;
	staffId?: string;
	roomNumber?: string;
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
	roomNumber: string;
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
	roomNumber: string;
	type: AmenityType;
	stockLevel: StockLevel;
	threshold: StockLevel; // このレベル以下で補充タスク生成
	lastCheckedAt: string;
	lastCheckedBy: string | null;
}

// 設備インターフェース
export interface RoomEquipment {
	id: string;
	roomNumber: string;
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
