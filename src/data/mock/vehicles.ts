import type { Vehicle, ShuttleTask } from "../../types";

// Helper function for getting today's date
const getToday = (): string => {
	const today = new Date();
	return today.toISOString().split("T")[0];
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

export const getShuttleTaskById = (id: string): ShuttleTask | undefined =>
	mockShuttleTasks.find((t) => t.id === id);
