// === Reservation Types ===
export type ReservationStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled";

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
export type ViewMode = "admin" | "staff";
export type AdminPage = "dashboard" | "reservations" | "templates" | "staff_monitor" | "timeline";

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
