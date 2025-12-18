import type { RoomAmenity, RoomEquipment } from "../../types";
import { STOCK_LEVEL_VALUES } from "../../types";

// === Mock Room Amenities ===
// 各部屋のアメニティデータ(5部屋 × 8種類)
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

	// Room 401 - 貴賓室(補充済み)
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

	// Room 203 - 未チェック(前回のまま)
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

	// Room 401 - 貴賓室(全て正常)
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

// === Helper Functions ===
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
	mockRoomAmenities.forEach((amenity) => roomSet.add(amenity.roomNumber));
	mockRoomEquipments.forEach((equipment) => roomSet.add(equipment.roomNumber));
	return Array.from(roomSet).sort();
};

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
