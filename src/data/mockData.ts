import type {
	Reservation,
	Task,
	Staff,
	TaskTemplate,
	DailyStats,
	RoomAmenity,
	RoomEquipment,
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
