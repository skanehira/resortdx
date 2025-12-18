import type {
	Reservation,
	Task,
	Staff,
	TaskTemplate,
	DailyStats,
	RoomAmenity,
	RoomEquipment,
	Vehicle,
	ShuttleTask,
	MealTask,
	MealOrderNotification,
	CelebrationTask,
	MealStatus,
	RoomCleaningStatus,
	UnifiedTask,
	StaffMessage,
} from "../types";
import { STOCK_LEVEL_VALUES } from "../types";

// Helper to get today's date in YYYY-MM-DD format
const getToday = (): string => {
	const today = new Date();
	return today.toISOString().split("T")[0];
};

const getTomorrow = (): string => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	return tomorrow.toISOString().split("T")[0];
};

// === Mock Reservations ===
export const mockReservations: Reservation[] = [
	{
		id: "RSV001",
		guestName: "山田 太郎",
		guestNameKana: "ヤマダ タロウ",
		roomNumber: "201",
		roomType: "deluxe",
		checkInDate: getToday(),
		checkOutDate: getTomorrow(),
		checkInTime: "15:00",
		numberOfGuests: 2,
		status: "confirmed",
		specialRequests: ["禁煙ルーム希望", "アレルギー：甲殻類"],
		anniversary: {
			type: "wedding",
			description: "結婚10周年記念",
			giftRequested: true,
		},
		createdAt: "2024-12-15T10:30:00",
	},
	{
		id: "RSV002",
		guestName: "佐藤 花子",
		guestNameKana: "サトウ ハナコ",
		roomNumber: "305",
		roomType: "suite",
		checkInDate: getToday(),
		checkOutDate: getTomorrow(),
		checkInTime: "14:00",
		numberOfGuests: 3,
		status: "checked_in",
		specialRequests: ["ベビーベッド希望"],
		createdAt: "2024-12-14T14:00:00",
	},
	{
		id: "RSV003",
		guestName: "鈴木 一郎",
		guestNameKana: "スズキ イチロウ",
		roomNumber: "102",
		roomType: "standard",
		checkInDate: getToday(),
		checkOutDate: getTomorrow(),
		checkInTime: "16:00",
		numberOfGuests: 1,
		status: "confirmed",
		specialRequests: [],
		createdAt: "2024-12-16T09:00:00",
	},
	{
		id: "RSV004",
		guestName: "田中 美咲",
		guestNameKana: "タナカ ミサキ",
		roomNumber: "401",
		roomType: "premium_suite",
		checkInDate: getToday(),
		checkOutDate: getTomorrow(),
		checkInTime: "15:30",
		numberOfGuests: 2,
		status: "confirmed",
		specialRequests: ["露天風呂付き希望", "夕食は部屋食で"],
		anniversary: {
			type: "birthday",
			description: "奥様のお誕生日",
			giftRequested: true,
		},
		createdAt: "2024-12-13T11:00:00",
	},
	{
		id: "RSV005",
		guestName: "高橋 健二",
		guestNameKana: "タカハシ ケンジ",
		roomNumber: "203",
		roomType: "deluxe",
		checkInDate: getToday(),
		checkOutDate: getTomorrow(),
		checkInTime: "17:00",
		numberOfGuests: 4,
		status: "confirmed",
		specialRequests: ["団体での利用"],
		createdAt: "2024-12-15T16:00:00",
	},
];

// === Mock Staff ===
export const mockStaff: Staff[] = [
	{
		id: "STF001",
		name: "中村 さくら",
		nameKana: "ナカムラ サクラ",
		role: "cleaning",
		skills: ["cleaning", "turndown"],
		isOnDuty: true,
		shiftStart: "08:00",
		shiftEnd: "17:00",
		currentTaskId: "TSK002",
		avatarColor: "#5DAE8B",
	},
	{
		id: "STF002",
		name: "伊藤 大輔",
		nameKana: "イトウ ダイスケ",
		role: "service",
		skills: ["meal_service", "celebration", "turndown"],
		isOnDuty: true,
		shiftStart: "10:00",
		shiftEnd: "20:00",
		currentTaskId: null,
		avatarColor: "#1B4965",
	},
	{
		id: "STF003",
		name: "渡辺 明美",
		nameKana: "ワタナベ アケミ",
		role: "cleaning",
		skills: ["cleaning", "bath"],
		isOnDuty: true,
		shiftStart: "08:00",
		shiftEnd: "17:00",
		currentTaskId: "TSK005",
		avatarColor: "#C73E3A",
	},
	{
		id: "STF004",
		name: "小林 誠",
		nameKana: "コバヤシ マコト",
		role: "driver",
		skills: ["pickup"],
		isOnDuty: true,
		shiftStart: "09:00",
		shiftEnd: "18:00",
		currentTaskId: null,
		avatarColor: "#B8860B",
	},
	{
		id: "STF005",
		name: "加藤 由美",
		nameKana: "カトウ ユミ",
		role: "concierge",
		skills: ["celebration", "meal_service", "other"],
		isOnDuty: true,
		shiftStart: "07:00",
		shiftEnd: "16:00",
		currentTaskId: null,
		avatarColor: "#7D7D7D",
	},
	{
		id: "STF006",
		name: "吉田 浩二",
		nameKana: "ヨシダ コウジ",
		role: "kitchen",
		skills: ["meal_service"],
		isOnDuty: true,
		shiftStart: "06:00",
		shiftEnd: "15:00",
		currentTaskId: "TSK007",
		avatarColor: "#2E6B8A",
	},
];

// === Mock Tasks ===
export const mockTasks: Task[] = [
	// Room 201 - Anniversary couple
	{
		id: "TSK001",
		reservationId: "RSV001",
		category: "cleaning",
		title: "客室清掃 201号室",
		description: "和洋室デラックス清掃。結婚記念日のお客様。",
		roomNumber: "201",
		scheduledTime: "10:00",
		estimatedDuration: 45,
		status: "completed",
		assignedStaffId: "STF001",
		priority: "high",
		isAnniversaryRelated: false,
		completedAt: "10:42",
		cleaningChecklist: [
			{ item: "bed_making", isChecked: true },
			{ item: "floor_cleaning", isChecked: true },
			{ item: "bathroom_cleaning", isChecked: true },
			{ item: "amenity_check", isChecked: true },
			{ item: "garbage_collection", isChecked: true },
		],
	},
	{
		id: "TSK002",
		reservationId: "RSV001",
		category: "celebration",
		title: "結婚記念セッティング 201号室",
		description: "花束・シャンパン・メッセージカードの準備",
		roomNumber: "201",
		scheduledTime: "14:00",
		estimatedDuration: 30,
		status: "in_progress",
		assignedStaffId: "STF005",
		priority: "high",
		isAnniversaryRelated: true,
	},
	{
		id: "TSK003",
		reservationId: "RSV001",
		category: "meal_service",
		title: "夕食配膳 201号室",
		description: "18:30開始。甲殻類アレルギー対応済み。",
		roomNumber: "201",
		scheduledTime: "18:30",
		estimatedDuration: 20,
		status: "pending",
		assignedStaffId: "STF002",
		priority: "normal",
		isAnniversaryRelated: false,
	},
	// Room 305 - Family with baby
	{
		id: "TSK004",
		reservationId: "RSV002",
		category: "cleaning",
		title: "客室清掃 305号室",
		description: "特別室スイート清掃。ベビーベッド設置済み確認。",
		roomNumber: "305",
		scheduledTime: "09:00",
		estimatedDuration: 60,
		status: "completed",
		assignedStaffId: "STF003",
		priority: "normal",
		isAnniversaryRelated: false,
		completedAt: "10:05",
		cleaningChecklist: [
			{ item: "bed_making", isChecked: true },
			{ item: "floor_cleaning", isChecked: true },
			{ item: "bathroom_cleaning", isChecked: true },
			{ item: "amenity_check", isChecked: true },
			{ item: "garbage_collection", isChecked: true },
			{ item: "outdoor_bath_cleaning", isChecked: true },
			{ item: "window_cleaning", isChecked: true },
		],
	},
	{
		id: "TSK005",
		reservationId: "RSV002",
		category: "bath",
		title: "露天風呂準備 305号室",
		description: "13:30までに完了。温度チェック必須。",
		roomNumber: "305",
		scheduledTime: "13:00",
		estimatedDuration: 15,
		status: "in_progress",
		assignedStaffId: "STF003",
		priority: "normal",
		isAnniversaryRelated: false,
	},
	{
		id: "TSK006",
		reservationId: "RSV002",
		category: "meal_service",
		title: "夕食配膳 305号室",
		description: "18:00開始。お子様メニュー含む。",
		roomNumber: "305",
		scheduledTime: "18:00",
		estimatedDuration: 25,
		status: "pending",
		assignedStaffId: "STF002",
		priority: "normal",
		isAnniversaryRelated: false,
	},
	// Room 102 - Single guest
	{
		id: "TSK007",
		reservationId: "RSV003",
		category: "cleaning",
		title: "客室清掃 102号室",
		description: "和室スタンダード清掃",
		roomNumber: "102",
		scheduledTime: "11:00",
		estimatedDuration: 30,
		status: "completed",
		assignedStaffId: "STF001",
		priority: "normal",
		isAnniversaryRelated: false,
		completedAt: "11:28",
		cleaningChecklist: [
			{ item: "bed_making", isChecked: true },
			{ item: "floor_cleaning", isChecked: true },
			{ item: "bathroom_cleaning", isChecked: true },
			{ item: "amenity_check", isChecked: true },
			{ item: "garbage_collection", isChecked: true },
		],
	},
	{
		id: "TSK008",
		reservationId: "RSV003",
		category: "pickup",
		title: "送迎 鳥羽駅→旅館",
		description: "15:30 鳥羽駅到着予定。鈴木様1名。",
		roomNumber: "102",
		scheduledTime: "15:30",
		estimatedDuration: 20,
		status: "pending",
		assignedStaffId: "STF004",
		priority: "normal",
		isAnniversaryRelated: false,
	},
	// Room 401 - Premium suite with birthday
	{
		id: "TSK009",
		reservationId: "RSV004",
		category: "cleaning",
		title: "客室清掃 401号室",
		description: "貴賓室清掃。誕生日のお客様、特別対応必要。",
		roomNumber: "401",
		scheduledTime: "09:30",
		estimatedDuration: 90,
		status: "completed",
		assignedStaffId: "STF003",
		priority: "urgent",
		isAnniversaryRelated: false,
		completedAt: "11:00",
		cleaningChecklist: [
			{ item: "bed_making", isChecked: true },
			{ item: "floor_cleaning", isChecked: true },
			{ item: "bathroom_cleaning", isChecked: true },
			{ item: "amenity_check", isChecked: true },
			{ item: "garbage_collection", isChecked: true },
			{ item: "outdoor_bath_cleaning", isChecked: true },
			{ item: "window_cleaning", isChecked: true },
			{ item: "special_cleaning", isChecked: true },
		],
	},
	{
		id: "TSK010",
		reservationId: "RSV004",
		category: "celebration",
		title: "バースデーセッティング 401号室",
		description: "ケーキ・花束・バルーン装飾の準備",
		roomNumber: "401",
		scheduledTime: "14:30",
		estimatedDuration: 45,
		status: "pending",
		assignedStaffId: "STF005",
		priority: "urgent",
		isAnniversaryRelated: true,
	},
	{
		id: "TSK011",
		reservationId: "RSV004",
		category: "bath",
		title: "露天風呂準備 401号室",
		description: "貴賓室専用露天風呂。花びら浮かべ対応。",
		roomNumber: "401",
		scheduledTime: "14:00",
		estimatedDuration: 20,
		status: "pending",
		assignedStaffId: "STF003",
		priority: "high",
		isAnniversaryRelated: true,
	},
	{
		id: "TSK012",
		reservationId: "RSV004",
		category: "meal_service",
		title: "部屋食準備 401号室",
		description: "19:00開始。特別コース料理。",
		roomNumber: "401",
		scheduledTime: "19:00",
		estimatedDuration: 30,
		status: "pending",
		assignedStaffId: "STF002",
		priority: "high",
		isAnniversaryRelated: false,
	},
	// Room 203 - Group
	{
		id: "TSK013",
		reservationId: "RSV005",
		category: "cleaning",
		title: "客室清掃 203号室",
		description: "和洋室デラックス清掃。団体様4名。",
		roomNumber: "203",
		scheduledTime: "12:00",
		estimatedDuration: 50,
		status: "pending",
		assignedStaffId: "STF001",
		priority: "normal",
		isAnniversaryRelated: false,
		cleaningChecklist: [
			{ item: "bed_making", isChecked: false },
			{ item: "floor_cleaning", isChecked: false },
			{ item: "bathroom_cleaning", isChecked: false },
			{ item: "amenity_check", isChecked: false },
			{ item: "garbage_collection", isChecked: false },
		],
	},
	{
		id: "TSK014",
		reservationId: "RSV005",
		category: "pickup",
		title: "送迎 伊勢市駅→旅館",
		description: "16:30 伊勢市駅到着予定。高橋様ご一行4名。",
		roomNumber: "203",
		scheduledTime: "16:30",
		estimatedDuration: 25,
		status: "pending",
		assignedStaffId: "STF004",
		priority: "normal",
		isAnniversaryRelated: false,
	},
	{
		id: "TSK015",
		reservationId: "RSV005",
		category: "meal_service",
		title: "夕食配膳 203号室",
		description: "19:30開始。団体様4名分。",
		roomNumber: "203",
		scheduledTime: "19:30",
		estimatedDuration: 30,
		status: "pending",
		assignedStaffId: "STF006",
		priority: "normal",
		isAnniversaryRelated: false,
	},
];

// === Mock Task Templates ===
export const mockTaskTemplates: TaskTemplate[] = [
	{
		id: "TPL001",
		name: "客室清掃（スタンダード）",
		category: "cleaning",
		description: "和室スタンダードの基本清掃",
		defaultDuration: 30,
		applicableRoomTypes: ["standard"],
		triggerConditions: [{ type: "check_in" }],
		relativeTime: { reference: "check_in", offsetMinutes: -300 },
	},
	{
		id: "TPL002",
		name: "客室清掃（デラックス）",
		category: "cleaning",
		description: "和洋室デラックスの清掃",
		defaultDuration: 45,
		applicableRoomTypes: ["deluxe"],
		triggerConditions: [{ type: "check_in" }],
		relativeTime: { reference: "check_in", offsetMinutes: -300 },
	},
	{
		id: "TPL003",
		name: "客室清掃（スイート）",
		category: "cleaning",
		description: "特別室スイートの清掃",
		defaultDuration: 60,
		applicableRoomTypes: ["suite"],
		triggerConditions: [{ type: "check_in" }],
		relativeTime: { reference: "check_in", offsetMinutes: -360 },
	},
	{
		id: "TPL004",
		name: "客室清掃（貴賓室）",
		category: "cleaning",
		description: "貴賓室の特別清掃",
		defaultDuration: 90,
		applicableRoomTypes: ["premium_suite"],
		triggerConditions: [{ type: "check_in" }],
		relativeTime: { reference: "check_in", offsetMinutes: -360 },
	},
	{
		id: "TPL005",
		name: "夕食配膳",
		category: "meal_service",
		description: "夕食の配膳準備と提供",
		defaultDuration: 25,
		applicableRoomTypes: ["standard", "deluxe", "suite", "premium_suite"],
		triggerConditions: [{ type: "check_in" }],
		relativeTime: { reference: "check_in", offsetMinutes: 210 },
	},
	{
		id: "TPL006",
		name: "記念日セッティング",
		category: "celebration",
		description: "花束、ケーキ、装飾の準備",
		defaultDuration: 30,
		applicableRoomTypes: ["deluxe", "suite", "premium_suite"],
		triggerConditions: [{ type: "anniversary" }],
		relativeTime: { reference: "check_in", offsetMinutes: -60 },
	},
	{
		id: "TPL007",
		name: "露天風呂準備",
		category: "bath",
		description: "露天風呂の清掃と温度調整",
		defaultDuration: 20,
		applicableRoomTypes: ["suite", "premium_suite"],
		triggerConditions: [{ type: "room_type", value: "suite" }],
		relativeTime: { reference: "check_in", offsetMinutes: -60 },
	},
	{
		id: "TPL008",
		name: "駅送迎",
		category: "pickup",
		description: "最寄り駅からの送迎",
		defaultDuration: 20,
		applicableRoomTypes: ["standard", "deluxe", "suite", "premium_suite"],
		triggerConditions: [{ type: "check_in" }],
		relativeTime: { reference: "check_in", offsetMinutes: -30 },
	},
	{
		id: "TPL009",
		name: "ターンダウンサービス",
		category: "turndown",
		description: "就寝前の客室準備",
		defaultDuration: 15,
		applicableRoomTypes: ["suite", "premium_suite"],
		triggerConditions: [{ type: "check_in" }],
		relativeTime: { reference: "check_in", offsetMinutes: 360 },
	},
];

// === Mock Room Amenities ===
// 各部屋のアメニティデータ（5部屋 × 8種類）
export const mockRoomAmenities: RoomAmenity[] = [
	// Room 201 - ほぼ正常
	{
		id: "AMN-201-001",
		roomNumber: "201",
		type: "shampoo",
		stockLevel: "full",
		threshold: "low",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-201-002",
		roomNumber: "201",
		type: "conditioner",
		stockLevel: "half",
		threshold: "low",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-201-003",
		roomNumber: "201",
		type: "body_soap",
		stockLevel: "full",
		threshold: "low",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-201-004",
		roomNumber: "201",
		type: "toothbrush",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-201-005",
		roomNumber: "201",
		type: "towel_face",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-201-006",
		roomNumber: "201",
		type: "towel_bath",
		stockLevel: "half",
		threshold: "low",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-201-007",
		roomNumber: "201",
		type: "yukata",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-201-008",
		roomNumber: "201",
		type: "slippers",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:42",
		lastCheckedBy: "STF001",
	},

	// Room 305 - 正常
	{
		id: "AMN-305-001",
		roomNumber: "305",
		type: "shampoo",
		stockLevel: "full",
		threshold: "low",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-305-002",
		roomNumber: "305",
		type: "conditioner",
		stockLevel: "full",
		threshold: "low",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-305-003",
		roomNumber: "305",
		type: "body_soap",
		stockLevel: "half",
		threshold: "low",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-305-004",
		roomNumber: "305",
		type: "toothbrush",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-305-005",
		roomNumber: "305",
		type: "towel_face",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-305-006",
		roomNumber: "305",
		type: "towel_bath",
		stockLevel: "full",
		threshold: "low",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-305-007",
		roomNumber: "305",
		type: "yukata",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-305-008",
		roomNumber: "305",
		type: "slippers",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "10:05",
		lastCheckedBy: "STF003",
	},

	// Room 102 - いくつか要補充
	{
		id: "AMN-102-001",
		roomNumber: "102",
		type: "shampoo",
		stockLevel: "low",
		threshold: "low",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-102-002",
		roomNumber: "102",
		type: "conditioner",
		stockLevel: "low",
		threshold: "low",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-102-003",
		roomNumber: "102",
		type: "body_soap",
		stockLevel: "half",
		threshold: "low",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-102-004",
		roomNumber: "102",
		type: "toothbrush",
		stockLevel: "empty",
		threshold: "half",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-102-005",
		roomNumber: "102",
		type: "towel_face",
		stockLevel: "half",
		threshold: "half",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-102-006",
		roomNumber: "102",
		type: "towel_bath",
		stockLevel: "half",
		threshold: "low",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-102-007",
		roomNumber: "102",
		type: "yukata",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},
	{
		id: "AMN-102-008",
		roomNumber: "102",
		type: "slippers",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:28",
		lastCheckedBy: "STF001",
	},

	// Room 401 - 貴賓室（補充済み）
	{
		id: "AMN-401-001",
		roomNumber: "401",
		type: "shampoo",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-401-002",
		roomNumber: "401",
		type: "conditioner",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-401-003",
		roomNumber: "401",
		type: "body_soap",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-401-004",
		roomNumber: "401",
		type: "toothbrush",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-401-005",
		roomNumber: "401",
		type: "towel_face",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-401-006",
		roomNumber: "401",
		type: "towel_bath",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-401-007",
		roomNumber: "401",
		type: "yukata",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},
	{
		id: "AMN-401-008",
		roomNumber: "401",
		type: "slippers",
		stockLevel: "full",
		threshold: "half",
		lastCheckedAt: "11:00",
		lastCheckedBy: "STF003",
	},

	// Room 203 - 未チェック（前回のまま）
	{
		id: "AMN-203-001",
		roomNumber: "203",
		type: "shampoo",
		stockLevel: "half",
		threshold: "low",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
	{
		id: "AMN-203-002",
		roomNumber: "203",
		type: "conditioner",
		stockLevel: "low",
		threshold: "low",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
	{
		id: "AMN-203-003",
		roomNumber: "203",
		type: "body_soap",
		stockLevel: "half",
		threshold: "low",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
	{
		id: "AMN-203-004",
		roomNumber: "203",
		type: "toothbrush",
		stockLevel: "low",
		threshold: "half",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
	{
		id: "AMN-203-005",
		roomNumber: "203",
		type: "towel_face",
		stockLevel: "half",
		threshold: "half",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
	{
		id: "AMN-203-006",
		roomNumber: "203",
		type: "towel_bath",
		stockLevel: "low",
		threshold: "low",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
	{
		id: "AMN-203-007",
		roomNumber: "203",
		type: "yukata",
		stockLevel: "half",
		threshold: "half",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
	{
		id: "AMN-203-008",
		roomNumber: "203",
		type: "slippers",
		stockLevel: "half",
		threshold: "half",
		lastCheckedAt: "前日",
		lastCheckedBy: null,
	},
];

// === Mock Room Equipment ===
export const mockRoomEquipments: RoomEquipment[] = [
	// Room 201
	{
		id: "EQP-201-001",
		roomNumber: "201",
		type: "air_conditioner",
		status: "working",
		lastMaintenanceAt: "2024-12-01",
		notes: null,
	},
	{
		id: "EQP-201-002",
		roomNumber: "201",
		type: "tv",
		status: "working",
		lastMaintenanceAt: "2024-11-15",
		notes: null,
	},
	{
		id: "EQP-201-003",
		roomNumber: "201",
		type: "refrigerator",
		status: "working",
		lastMaintenanceAt: "2024-10-20",
		notes: null,
	},
	{
		id: "EQP-201-004",
		roomNumber: "201",
		type: "wifi_router",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-201-005",
		roomNumber: "201",
		type: "safe",
		status: "working",
		lastMaintenanceAt: "2024-09-01",
		notes: null,
	},
	{
		id: "EQP-201-006",
		roomNumber: "201",
		type: "hair_dryer",
		status: "working",
		lastMaintenanceAt: "2024-11-01",
		notes: null,
	},
	{
		id: "EQP-201-007",
		roomNumber: "201",
		type: "kettle",
		status: "working",
		lastMaintenanceAt: "2024-10-15",
		notes: null,
	},

	// Room 305
	{
		id: "EQP-305-001",
		roomNumber: "305",
		type: "air_conditioner",
		status: "working",
		lastMaintenanceAt: "2024-12-05",
		notes: null,
	},
	{
		id: "EQP-305-002",
		roomNumber: "305",
		type: "tv",
		status: "working",
		lastMaintenanceAt: "2024-11-20",
		notes: null,
	},
	{
		id: "EQP-305-003",
		roomNumber: "305",
		type: "refrigerator",
		status: "working",
		lastMaintenanceAt: "2024-10-25",
		notes: null,
	},
	{
		id: "EQP-305-004",
		roomNumber: "305",
		type: "wifi_router",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-305-005",
		roomNumber: "305",
		type: "safe",
		status: "working",
		lastMaintenanceAt: "2024-09-15",
		notes: null,
	},
	{
		id: "EQP-305-006",
		roomNumber: "305",
		type: "hair_dryer",
		status: "working",
		lastMaintenanceAt: "2024-11-10",
		notes: null,
	},
	{
		id: "EQP-305-007",
		roomNumber: "305",
		type: "kettle",
		status: "working",
		lastMaintenanceAt: "2024-10-20",
		notes: null,
	},

	// Room 102 - 一部故障あり
	{
		id: "EQP-102-001",
		roomNumber: "102",
		type: "air_conditioner",
		status: "needs_maintenance",
		lastMaintenanceAt: "2024-08-01",
		notes: "異音がする",
	},
	{
		id: "EQP-102-002",
		roomNumber: "102",
		type: "tv",
		status: "working",
		lastMaintenanceAt: "2024-11-01",
		notes: null,
	},
	{
		id: "EQP-102-003",
		roomNumber: "102",
		type: "refrigerator",
		status: "working",
		lastMaintenanceAt: "2024-09-15",
		notes: null,
	},
	{
		id: "EQP-102-004",
		roomNumber: "102",
		type: "wifi_router",
		status: "working",
		lastMaintenanceAt: "2024-12-05",
		notes: null,
	},
	{
		id: "EQP-102-005",
		roomNumber: "102",
		type: "safe",
		status: "working",
		lastMaintenanceAt: "2024-07-01",
		notes: null,
	},
	{
		id: "EQP-102-006",
		roomNumber: "102",
		type: "hair_dryer",
		status: "broken",
		lastMaintenanceAt: "2024-06-01",
		notes: "交換必要",
	},
	{
		id: "EQP-102-007",
		roomNumber: "102",
		type: "kettle",
		status: "working",
		lastMaintenanceAt: "2024-10-01",
		notes: null,
	},

	// Room 401 - 貴賓室（全て正常）
	{
		id: "EQP-401-001",
		roomNumber: "401",
		type: "air_conditioner",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-401-002",
		roomNumber: "401",
		type: "tv",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-401-003",
		roomNumber: "401",
		type: "refrigerator",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-401-004",
		roomNumber: "401",
		type: "wifi_router",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-401-005",
		roomNumber: "401",
		type: "safe",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-401-006",
		roomNumber: "401",
		type: "hair_dryer",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},
	{
		id: "EQP-401-007",
		roomNumber: "401",
		type: "kettle",
		status: "working",
		lastMaintenanceAt: "2024-12-10",
		notes: null,
	},

	// Room 203
	{
		id: "EQP-203-001",
		roomNumber: "203",
		type: "air_conditioner",
		status: "working",
		lastMaintenanceAt: "2024-11-15",
		notes: null,
	},
	{
		id: "EQP-203-002",
		roomNumber: "203",
		type: "tv",
		status: "needs_maintenance",
		lastMaintenanceAt: "2024-09-01",
		notes: "リモコン反応悪い",
	},
	{
		id: "EQP-203-003",
		roomNumber: "203",
		type: "refrigerator",
		status: "working",
		lastMaintenanceAt: "2024-10-10",
		notes: null,
	},
	{
		id: "EQP-203-004",
		roomNumber: "203",
		type: "wifi_router",
		status: "working",
		lastMaintenanceAt: "2024-12-01",
		notes: null,
	},
	{
		id: "EQP-203-005",
		roomNumber: "203",
		type: "safe",
		status: "working",
		lastMaintenanceAt: "2024-08-15",
		notes: null,
	},
	{
		id: "EQP-203-006",
		roomNumber: "203",
		type: "hair_dryer",
		status: "working",
		lastMaintenanceAt: "2024-10-20",
		notes: null,
	},
	{
		id: "EQP-203-007",
		roomNumber: "203",
		type: "kettle",
		status: "working",
		lastMaintenanceAt: "2024-09-25",
		notes: null,
	},
];

// === Daily Statistics ===
export const mockDailyStats: DailyStats = {
	totalTasks: mockTasks.length,
	completedTasks: mockTasks.filter((t) => t.status === "completed").length,
	inProgressTasks: mockTasks.filter((t) => t.status === "in_progress").length,
	pendingTasks: mockTasks.filter((t) => t.status === "pending").length,
	totalReservations: mockReservations.length,
	checkInsToday: mockReservations.filter((r) => r.checkInDate === getToday())
		.length,
	checkOutsToday: mockReservations.filter((r) => r.checkOutDate === getToday())
		.length,
	anniversaryGuests: mockReservations.filter((r) => r.anniversary).length,
};

// === Helper Functions ===
export const getStaffById = (id: string): Staff | undefined =>
	mockStaff.find((s) => s.id === id);

export const getReservationById = (id: string): Reservation | undefined =>
	mockReservations.find((r) => r.id === id);

export const getTasksByRoom = (roomNumber: string): Task[] =>
	mockTasks.filter((t) => t.roomNumber === roomNumber);

export const getTasksByStaff = (staffId: string): Task[] =>
	mockTasks.filter((t) => t.assignedStaffId === staffId);

export const getTasksByStatus = (status: Task["status"]): Task[] =>
	mockTasks.filter((t) => t.status === status);

export const getPendingTasksForStaff = (staffId: string): Task[] =>
	mockTasks.filter(
		(t) => t.assignedStaffId === staffId && t.status !== "completed",
	);

// === Time helpers ===
export const formatTime = (time: string): string => {
	return time;
};

export const getTimeSlots = (): string[] => {
	const slots: string[] = [];
	for (let hour = 6; hour <= 22; hour++) {
		slots.push(`${hour.toString().padStart(2, "0")}:00`);
		slots.push(`${hour.toString().padStart(2, "0")}:30`);
	}
	return slots;
};

// === Equipment Management Helper Functions ===
export const getAmenitiesByRoom = (roomNumber: string): RoomAmenity[] =>
	mockRoomAmenities.filter((a) => a.roomNumber === roomNumber);

export const getEquipmentByRoom = (roomNumber: string): RoomEquipment[] =>
	mockRoomEquipments.filter((e) => e.roomNumber === roomNumber);

export const getAmenitiesBelowThreshold = (): RoomAmenity[] =>
	mockRoomAmenities.filter(
		(a) => STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
	);

export const getEquipmentNeedsMaintenance = (): RoomEquipment[] =>
	mockRoomEquipments.filter((e) => e.status !== "working");

export const getRoomEquipmentStatus = (
	roomNumber: string,
): {
	amenitiesOk: number;
	amenitiesLow: number;
	equipmentOk: number;
	equipmentIssues: number;
} => {
	const amenities = getAmenitiesByRoom(roomNumber);
	const equipment = getEquipmentByRoom(roomNumber);

	const amenitiesLow = amenities.filter(
		(a) => STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
	).length;

	const equipmentIssues = equipment.filter(
		(e) => e.status !== "working",
	).length;

	return {
		amenitiesOk: amenities.length - amenitiesLow,
		amenitiesLow,
		equipmentOk: equipment.length - equipmentIssues,
		equipmentIssues,
	};
};

export const getAllRoomNumbers = (): string[] => {
	const roomSet = new Set<string>();
	for (const reservation of mockReservations) {
		roomSet.add(reservation.roomNumber);
	}
	return Array.from(roomSet).sort();
};

// === Mock Vehicles ===
export const mockVehicles: Vehicle[] = [
	{
		id: "VEH001",
		name: "1号車",
		licensePlate: "三重 500 あ 1234",
		capacity: 7,
		status: "available",
		currentDriverId: null,
		currentShuttleTaskId: null,
		lastMaintenanceDate: "2024-12-01",
		nextMaintenanceDate: "2025-01-15",
		notes: null,
	},
	{
		id: "VEH002",
		name: "2号車",
		licensePlate: "三重 500 あ 5678",
		capacity: 4,
		status: "in_use",
		currentDriverId: "STF004",
		currentShuttleTaskId: "SHT001",
		lastMaintenanceDate: "2024-11-15",
		nextMaintenanceDate: "2025-01-01",
		notes: null,
	},
	{
		id: "VEH003",
		name: "3号車",
		licensePlate: "三重 300 い 9012",
		capacity: 9,
		status: "maintenance",
		currentDriverId: null,
		currentShuttleTaskId: null,
		lastMaintenanceDate: "2024-12-10",
		nextMaintenanceDate: null,
		notes: "タイヤ交換中",
	},
];

// === Mock Shuttle Tasks ===
export const mockShuttleTasks: ShuttleTask[] = [
	{
		id: "SHT001",
		reservationId: "RSV003",
		guestName: "鈴木 一郎",
		guestNameKana: "スズキ イチロウ",
		numberOfGuests: 1,
		pickupLocation: "鳥羽駅",
		dropoffLocation: "旅館",
		direction: "pickup",
		scheduledTime: "15:30",
		estimatedDuration: 20,
		shuttleStatus: "heading",
		assignedVehicleId: "VEH002",
		assignedDriverId: "STF004",
		priority: "normal",
		guestArrivalNotified: false,
		notes: "改札出口でお待ちください",
		createdAt: getToday() + "T08:00:00",
	},
	{
		id: "SHT002",
		reservationId: "RSV005",
		guestName: "高橋 健二",
		guestNameKana: "タカハシ ケンジ",
		numberOfGuests: 4,
		pickupLocation: "伊勢市駅",
		dropoffLocation: "旅館",
		direction: "pickup",
		scheduledTime: "16:30",
		estimatedDuration: 25,
		shuttleStatus: "not_departed",
		assignedVehicleId: "VEH001",
		assignedDriverId: "STF004",
		priority: "normal",
		guestArrivalNotified: false,
		notes: "団体様4名。大きな荷物あり",
		createdAt: getToday() + "T08:00:00",
	},
	{
		id: "SHT003",
		reservationId: "RSV001",
		guestName: "山田 太郎",
		guestNameKana: "ヤマダ タロウ",
		numberOfGuests: 2,
		pickupLocation: "旅館",
		dropoffLocation: "鳥羽駅",
		direction: "dropoff",
		scheduledTime: "10:00",
		estimatedDuration: 20,
		shuttleStatus: "completed",
		assignedVehicleId: "VEH001",
		assignedDriverId: "STF004",
		priority: "normal",
		guestArrivalNotified: false,
		completedAt: "10:25",
		createdAt: getToday() + "T06:00:00",
	},
	{
		id: "SHT004",
		reservationId: "RSV002",
		guestName: "佐藤 花子",
		guestNameKana: "サトウ ハナコ",
		numberOfGuests: 3,
		pickupLocation: "中部国際空港",
		dropoffLocation: "旅館",
		direction: "pickup",
		scheduledTime: "13:00",
		estimatedDuration: 60,
		shuttleStatus: "completed",
		assignedVehicleId: "VEH002",
		assignedDriverId: "STF004",
		priority: "high",
		guestArrivalNotified: true,
		guestNotifiedAt: "12:55",
		completedAt: "14:05",
		notes: "ベビーカーあり",
		createdAt: getToday() + "T06:00:00",
	},
	{
		id: "SHT005",
		reservationId: "RSV004",
		guestName: "田中 美咲",
		guestNameKana: "タナカ ミサキ",
		numberOfGuests: 2,
		pickupLocation: "鳥羽駅",
		dropoffLocation: "旅館",
		direction: "pickup",
		scheduledTime: "15:00",
		estimatedDuration: 20,
		shuttleStatus: "not_departed",
		assignedVehicleId: null,
		assignedDriverId: null,
		priority: "urgent",
		guestArrivalNotified: false,
		notes: "誕生日のお客様。特別対応",
		createdAt: getToday() + "T08:00:00",
	},
];

// === Shuttle Management Helper Functions ===
export const getVehicleById = (id: string): Vehicle | undefined =>
	mockVehicles.find((v) => v.id === id);

export const getShuttleTasksByDriver = (driverId: string): ShuttleTask[] =>
	mockShuttleTasks.filter((t) => t.assignedDriverId === driverId);

export const getShuttleTasksByVehicle = (vehicleId: string): ShuttleTask[] =>
	mockShuttleTasks.filter((t) => t.assignedVehicleId === vehicleId);

export const getPendingShuttleTasks = (): ShuttleTask[] =>
	mockShuttleTasks.filter((t) => t.shuttleStatus !== "completed");

export const getUnassignedShuttleTasks = (): ShuttleTask[] =>
	mockShuttleTasks.filter(
		(t) =>
			(!t.assignedVehicleId || !t.assignedDriverId) &&
			t.shuttleStatus !== "completed",
	);

export const getAvailableVehicles = (): Vehicle[] =>
	mockVehicles.filter((v) => v.status === "available");

export const getAvailableDrivers = (): Staff[] =>
	mockStaff.filter(
		(s) => s.role === "driver" && s.isOnDuty && !s.currentTaskId,
	);

export const getShuttleTaskById = (id: string): ShuttleTask | undefined =>
	mockShuttleTasks.find((t) => t.id === id);

// === Mock Meal Tasks ===
export const mockMealTasks: MealTask[] = [
	{
		id: "MEAL001",
		reservationId: "RSV001",
		guestName: "山田 太郎",
		guestNameKana: "ヤマダ タロウ",
		roomNumber: "201",
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
		roomNumber: "305",
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
		roomNumber: "102",
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
		roomNumber: "401",
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
		roomNumber: "203",
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
		roomNumber: "201",
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
		roomNumber: "305",
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
		roomNumber: "401",
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
		roomNumber: "201",
		guestName: "山田 太郎",
		orderType: "drink",
		content: "日本酒（熱燗）2合追加",
		isRead: false,
		createdAt: getToday() + "T18:45:00",
	},
	{
		id: "ORD002",
		reservationId: "RSV002",
		roomNumber: "305",
		guestName: "佐藤 花子",
		orderType: "drink",
		content: "お子様用ジュース追加",
		isRead: false,
		createdAt: getToday() + "T18:20:00",
	},
	{
		id: "ORD003",
		reservationId: "RSV004",
		roomNumber: "401",
		guestName: "田中 美咲",
		orderType: "timing_change",
		content: "夕食開始を19:30に変更希望",
		isRead: true,
		createdAt: getToday() + "T17:30:00",
	},
	{
		id: "ORD004",
		reservationId: "RSV005",
		roomNumber: "203",
		guestName: "高橋 健二",
		orderType: "menu_change",
		content: "1名分をベジタリアンメニューに変更",
		isRead: false,
		createdAt: getToday() + "T18:50:00",
	},
	{
		id: "ORD005",
		reservationId: "RSV001",
		roomNumber: "201",
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
		roomNumber: "201",
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
		roomNumber: "401",
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
		roomNumber: "305",
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
		completionReport:
			"お客様大変喜んでいただけました。記念撮影のお手伝いも実施。",
		completedAt: "18:45",
		createdAt: getToday() + "T08:00:00",
	},
	{
		id: "CLB004",
		reservationId: "RSV005",
		guestName: "高橋 健二",
		guestNameKana: "タカハシ ケンジ",
		roomNumber: "203",
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

export const getMealTasksByRoom = (roomNumber: string): MealTask[] =>
	mockMealTasks.filter((t) => t.roomNumber === roomNumber);

export const getPendingMealTasks = (): MealTask[] =>
	mockMealTasks.filter((t) => t.mealStatus !== "completed");

export const getMealTasksNeedingCheck = (): MealTask[] =>
	mockMealTasks.filter((t) => t.needsCheck);

export const getUnreadOrderNotifications = (): MealOrderNotification[] =>
	mockMealOrderNotifications.filter((n) => !n.isRead);

export const getOrderNotificationsByRoom = (
	roomNumber: string,
): MealOrderNotification[] =>
	mockMealOrderNotifications.filter((n) => n.roomNumber === roomNumber);

// === Celebration Management Helper Functions ===
export const getCelebrationTaskById = (
	id: string,
): CelebrationTask | undefined => mockCelebrationTasks.find((t) => t.id === id);

export const getCelebrationTasksByStaff = (
	staffId: string,
): CelebrationTask[] =>
	mockCelebrationTasks.filter((t) => t.assignedStaffId === staffId);

export const getCelebrationTasksByStatus = (
	status: CelebrationTask["status"],
): CelebrationTask[] => mockCelebrationTasks.filter((t) => t.status === status);

export const getPendingCelebrationTasks = (): CelebrationTask[] =>
	mockCelebrationTasks.filter((t) => t.status !== "completed");

export const getCelebrationTasksByRoom = (
	roomNumber: string,
): CelebrationTask[] =>
	mockCelebrationTasks.filter((t) => t.roomNumber === roomNumber);

// === Room Cleaning Status Helper Functions ===

export interface RoomCleaningInfo {
	roomNumber: string;
	status: RoomCleaningStatus;
	cleaningTask: Task | null;
	inspectionTask: Task | null;
	assignedStaff: Staff | null;
}

export const getRoomCleaningStatuses = (tasks: Task[]): RoomCleaningInfo[] => {
	const roomNumbers = [...new Set(tasks.map((t) => t.roomNumber))];

	return roomNumbers.map((roomNumber) => {
		const cleaningTask = tasks.find(
			(t) => t.roomNumber === roomNumber && t.category === "cleaning",
		);
		const inspectionTask = tasks.find(
			(t) => t.roomNumber === roomNumber && t.category === "inspection",
		);

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
			roomNumber,
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
): Task => {
	const now = new Date();
	const scheduledTime = `${now.getHours().toString().padStart(2, "0")}:${(now.getMinutes() + 30).toString().padStart(2, "0")}`;

	return {
		id: `INS-${cleaningTask.id}`,
		reservationId: cleaningTask.reservationId,
		category: "inspection",
		title: `点検 ${cleaningTask.roomNumber}号室`,
		description: `清掃完了後の最終点検。清掃担当: ${getStaffById(cleaningTask.assignedStaffId || "")?.name || "未割当"}`,
		roomNumber: cleaningTask.roomNumber,
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
		title: "客室清掃 201号室",
		roomNumber: "201",
		scheduledTime: "10:00",
		status: "completed",
		assignedStaffId: "STF001",
		priority: "high",
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
		title: "客室清掃 305号室",
		roomNumber: "305",
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
		title: "点検 201号室",
		roomNumber: "201",
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
		title: "客室清掃 203号室",
		roomNumber: "203",
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
		title: "夕食配膳 201号室",
		roomNumber: "201",
		scheduledTime: "18:30",
		status: "pending",
		assignedStaffId: "STF001",
		priority: "high",
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
		title: "夕食配膳 305号室",
		roomNumber: "305",
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
		title: "部屋食準備 401号室",
		roomNumber: "401",
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
		roomNumber: null,
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
		roomNumber: null,
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
		roomNumber: null,
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
		title: "結婚記念セッティング 201号室",
		roomNumber: "201",
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
		title: "バースデーセッティング 401号室",
		roomNumber: "401",
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
		title: "客室清掃 102号室",
		roomNumber: "102",
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
		title: "客室清掃 401号室",
		roomNumber: "401",
		scheduledTime: "09:30",
		status: "in_progress",
		assignedStaffId: "STF001",
		priority: "urgent",
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
		title: "緊急清掃 303号室",
		roomNumber: "303",
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
		title: "点検 305号室",
		roomNumber: "305",
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
		title: "点検 102号室",
		roomNumber: "102",
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
		title: "点検 401号室",
		roomNumber: "401",
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
		title: "点検 203号室",
		roomNumber: "203",
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
		title: "ターンダウン 305号室",
		roomNumber: "305",
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
		title: "露天風呂準備 401号室",
		roomNumber: "401",
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
		title: "朝食配膳 201号室",
		roomNumber: "201",
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
		title: "誕生日特別ディナー 401号室",
		roomNumber: "401",
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
		title: "夕食配膳 203号室",
		roomNumber: "203",
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
		title: "追加注文確認 305号室",
		roomNumber: "305",
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
		roomNumber: null,
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
		roomNumber: null,
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
		roomNumber: null,
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
		title: "還暦お祝い 305号室",
		roomNumber: "305",
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
			completionReport:
				"お客様大変喜んでいただけました。記念撮影のお手伝いも実施。",
		},
	},
	{
		id: "UT-CB-004",
		type: "celebration",
		title: "退職祝い 203号室",
		roomNumber: "203",
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

// === Staff Messages (スタッフメッセージ) ===
export const mockStaffMessages: StaffMessage[] = [
	{
		id: "MSG001",
		senderId: "STF001",
		content:
			"201号室の清掃完了しました。アメニティの補充をお願いしたいのですが、在庫は十分ありますか？",
		sentAt: getToday() + "T10:45:00",
		readAt: getToday() + "T10:50:00",
		relatedTaskId: "UT-HK-001",
		reply: {
			content:
				"在庫確認しました。シャンプーとコンディショナーの在庫が少なめです。本日中に発注しますので、現状の在庫で対応お願いします。",
			repliedBy: "管理者",
			repliedAt: getToday() + "T10:52:00",
		},
	},
	{
		id: "MSG002",
		senderId: "STF003",
		content:
			"102号室のエアコンから異音がしています。修理が必要かもしれません。",
		sentAt: getToday() + "T11:30:00",
		readAt: getToday() + "T11:35:00",
		relatedTaskId: null,
		reply: {
			content:
				"報告ありがとうございます。メンテナンス業者に連絡しました。本日夕方に確認に来る予定です。",
			repliedBy: "管理者",
			repliedAt: getToday() + "T11:40:00",
		},
	},
	{
		id: "MSG003",
		senderId: "STF002",
		content:
			"201号室のお客様から、デザートのタイミングを少し遅らせてほしいとリクエストがありました。19:45頃でよろしいでしょうか？",
		sentAt: getToday() + "T19:15:00",
		readAt: null,
		relatedTaskId: "UT-ML-001",
		reply: null,
	},
	{
		id: "MSG004",
		senderId: "STF004",
		content:
			"鳥羽駅への迎えですが、電車が15分遅延しているとの連絡がありました。出発を調整します。",
		sentAt: getToday() + "T15:00:00",
		readAt: getToday() + "T15:05:00",
		relatedTaskId: "UT-SH-001",
		reply: {
			content: "了解です。お客様にはおもてなしの気持ちで対応お願いします。",
			repliedBy: "管理者",
			repliedAt: getToday() + "T15:07:00",
		},
	},
	{
		id: "MSG005",
		senderId: "STF005",
		content:
			"401号室のバースデーセッティングについて、バルーンの色はピンクと白でよろしいでしょうか？ご主人様から追加のご希望があれば確認したいです。",
		sentAt: getToday() + "T13:30:00",
		readAt: null,
		relatedTaskId: "UT-CB-002",
		reply: null,
	},
];

// === Unified Task Helper Functions ===
export const getUnifiedTaskById = (id: string): UnifiedTask | undefined =>
	mockUnifiedTasks.find((t) => t.id === id);

export const getUnifiedTasksByStaff = (staffId: string): UnifiedTask[] =>
	mockUnifiedTasks.filter((t) => t.assignedStaffId === staffId);

export const getUnifiedTasksByType = (
	type: UnifiedTask["type"],
): UnifiedTask[] => mockUnifiedTasks.filter((t) => t.type === type);

export const getPendingUnifiedTasks = (): UnifiedTask[] =>
	mockUnifiedTasks.filter((t) => t.status !== "completed");

// === Staff Message Helper Functions ===
export const getMessagesByStaff = (staffId: string): StaffMessage[] =>
	mockStaffMessages.filter((m) => m.senderId === staffId);

export const getUnreadMessages = (): StaffMessage[] =>
	mockStaffMessages.filter((m) => m.readAt === null);

// === Room Amenities/Equipment by Room Number (Map形式) ===
export const roomAmenitiesMap: Record<string, RoomAmenity[]> = {
	"201": mockRoomAmenities.filter((a) => a.roomNumber === "201"),
	"305": mockRoomAmenities.filter((a) => a.roomNumber === "305"),
	"102": mockRoomAmenities.filter((a) => a.roomNumber === "102"),
	"401": mockRoomAmenities.filter((a) => a.roomNumber === "401"),
	"203": mockRoomAmenities.filter((a) => a.roomNumber === "203"),
};

export const roomEquipmentMap: Record<string, RoomEquipment[]> = {
	"201": mockRoomEquipments.filter((e) => e.roomNumber === "201"),
	"305": mockRoomEquipments.filter((e) => e.roomNumber === "305"),
	"102": mockRoomEquipments.filter((e) => e.roomNumber === "102"),
	"401": mockRoomEquipments.filter((e) => e.roomNumber === "401"),
	"203": mockRoomEquipments.filter((e) => e.roomNumber === "203"),
};
