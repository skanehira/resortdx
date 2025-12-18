import type { Reservation, Task, Staff, TaskTemplate, DailyStats } from "../types";

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

// === Daily Statistics ===
export const mockDailyStats: DailyStats = {
	totalTasks: mockTasks.length,
	completedTasks: mockTasks.filter((t) => t.status === "completed").length,
	inProgressTasks: mockTasks.filter((t) => t.status === "in_progress").length,
	pendingTasks: mockTasks.filter((t) => t.status === "pending").length,
	totalReservations: mockReservations.length,
	checkInsToday: mockReservations.filter((r) => r.checkInDate === getToday()).length,
	checkOutsToday: mockReservations.filter((r) => r.checkOutDate === getToday()).length,
	anniversaryGuests: mockReservations.filter((r) => r.anniversary).length,
};

// === Helper Functions ===
export const getStaffById = (id: string): Staff | undefined => mockStaff.find((s) => s.id === id);

export const getReservationById = (id: string): Reservation | undefined =>
	mockReservations.find((r) => r.id === id);

export const getTasksByRoom = (roomNumber: string): Task[] =>
	mockTasks.filter((t) => t.roomNumber === roomNumber);

export const getTasksByStaff = (staffId: string): Task[] =>
	mockTasks.filter((t) => t.assignedStaffId === staffId);

export const getTasksByStatus = (status: Task["status"]): Task[] =>
	mockTasks.filter((t) => t.status === status);

export const getPendingTasksForStaff = (staffId: string): Task[] =>
	mockTasks.filter((t) => t.assignedStaffId === staffId && t.status !== "completed");

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
