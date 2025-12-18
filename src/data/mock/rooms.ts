import type {
  RoomAmenity,
  RoomEquipment,
  Room,
  AmenityTypeMaster,
  EquipmentTypeMaster,
} from "../../types";
import { STOCK_LEVEL_VALUES } from "../../types";

// === Room Type Master Data (6種類の客室タイプ) ===
export const mockRooms: Room[] = [
  {
    id: "ROOM-001",
    name: "スタイリッシュスイート",
    type: "standard",
    capacity: 2,
    hasOutdoorBath: false,
  },
  {
    id: "ROOM-002",
    name: "コンフォートスイート",
    type: "deluxe",
    capacity: 3,
    hasOutdoorBath: false,
  },
  {
    id: "ROOM-003",
    name: "プレシャススイート",
    type: "suite",
    capacity: 4,
    hasOutdoorBath: true,
  },
  {
    id: "ROOM-004",
    name: "プレミアムスイート",
    type: "premium_suite",
    capacity: 4,
    hasOutdoorBath: true,
  },
  {
    id: "ROOM-005",
    name: "ふふラグジュアリーコーナースイート",
    type: "premium_suite",
    capacity: 4,
    hasOutdoorBath: true,
  },
  {
    id: "ROOM-006",
    name: "ふふラグジュアリープレミアムスイート",
    type: "premium_suite",
    capacity: 6,
    hasOutdoorBath: true,
  },
];

// === 部屋ID から客室情報を取得 ===
export const getRoomById = (roomId: string): Room | undefined =>
  mockRooms.find((r) => r.id === roomId);

// 部屋IDから客室名を取得
export const getRoomName = (roomId: string | null | undefined): string => {
  if (!roomId) return "";
  const room = getRoomById(roomId);
  return room?.name || "";
};

// === Amenity Type Master Data ===
export const mockAmenityTypes: AmenityTypeMaster[] = [
  {
    id: "AMT-001",
    key: "shampoo",
    label: "シャンプー",
    defaultThreshold: "low",
    isActive: true,
  },
  {
    id: "AMT-002",
    key: "conditioner",
    label: "コンディショナー",
    defaultThreshold: "low",
    isActive: true,
  },
  {
    id: "AMT-003",
    key: "body_soap",
    label: "ボディソープ",
    defaultThreshold: "low",
    isActive: true,
  },
  {
    id: "AMT-004",
    key: "toothbrush",
    label: "歯ブラシセット",
    defaultThreshold: "half",
    isActive: true,
  },
  {
    id: "AMT-005",
    key: "towel_face",
    label: "フェイスタオル",
    defaultThreshold: "half",
    isActive: true,
  },
  {
    id: "AMT-006",
    key: "towel_bath",
    label: "バスタオル",
    defaultThreshold: "low",
    isActive: true,
  },
  {
    id: "AMT-007",
    key: "yukata",
    label: "浴衣",
    defaultThreshold: "half",
    isActive: true,
  },
  {
    id: "AMT-008",
    key: "slippers",
    label: "スリッパ",
    defaultThreshold: "half",
    isActive: true,
  },
];

// === Equipment Type Master Data ===
export const mockEquipmentTypes: EquipmentTypeMaster[] = [
  { id: "EQT-001", key: "air_conditioner", label: "エアコン", isActive: true },
  { id: "EQT-002", key: "tv", label: "テレビ", isActive: true },
  { id: "EQT-003", key: "refrigerator", label: "冷蔵庫", isActive: true },
  { id: "EQT-004", key: "wifi_router", label: "WiFiルーター", isActive: true },
  { id: "EQT-005", key: "safe", label: "金庫", isActive: true },
  { id: "EQT-006", key: "hair_dryer", label: "ドライヤー", isActive: true },
  { id: "EQT-007", key: "kettle", label: "電気ケトル", isActive: true },
];

// === Mock Room Amenities ===
// 各部屋のアメニティデータ(5部屋 × 8種類)
export const mockRoomAmenities: RoomAmenity[] = [
  // Room 201 - ほぼ正常
  {
    id: "AMN-201-001",
    roomId: "ROOM-002",
    type: "shampoo",
    stockLevel: "full",
    threshold: "low",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-201-002",
    roomId: "ROOM-002",
    type: "conditioner",
    stockLevel: "half",
    threshold: "low",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-201-003",
    roomId: "ROOM-002",
    type: "body_soap",
    stockLevel: "full",
    threshold: "low",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-201-004",
    roomId: "ROOM-002",
    type: "toothbrush",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-201-005",
    roomId: "ROOM-002",
    type: "towel_face",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-201-006",
    roomId: "ROOM-002",
    type: "towel_bath",
    stockLevel: "half",
    threshold: "low",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-201-007",
    roomId: "ROOM-002",
    type: "yukata",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-201-008",
    roomId: "ROOM-002",
    type: "slippers",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:42",
    lastCheckedBy: "STF001",
  },

  // Room 305 - 正常
  {
    id: "AMN-305-001",
    roomId: "ROOM-003",
    type: "shampoo",
    stockLevel: "full",
    threshold: "low",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-305-002",
    roomId: "ROOM-003",
    type: "conditioner",
    stockLevel: "full",
    threshold: "low",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-305-003",
    roomId: "ROOM-003",
    type: "body_soap",
    stockLevel: "half",
    threshold: "low",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-305-004",
    roomId: "ROOM-003",
    type: "toothbrush",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-305-005",
    roomId: "ROOM-003",
    type: "towel_face",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-305-006",
    roomId: "ROOM-003",
    type: "towel_bath",
    stockLevel: "full",
    threshold: "low",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-305-007",
    roomId: "ROOM-003",
    type: "yukata",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-305-008",
    roomId: "ROOM-003",
    type: "slippers",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "10:05",
    lastCheckedBy: "STF003",
  },

  // Room 102 - いくつか要補充
  {
    id: "AMN-102-001",
    roomId: "ROOM-001",
    type: "shampoo",
    stockLevel: "low",
    threshold: "low",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-102-002",
    roomId: "ROOM-001",
    type: "conditioner",
    stockLevel: "low",
    threshold: "low",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-102-003",
    roomId: "ROOM-001",
    type: "body_soap",
    stockLevel: "half",
    threshold: "low",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-102-004",
    roomId: "ROOM-001",
    type: "toothbrush",
    stockLevel: "empty",
    threshold: "half",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-102-005",
    roomId: "ROOM-001",
    type: "towel_face",
    stockLevel: "half",
    threshold: "half",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-102-006",
    roomId: "ROOM-001",
    type: "towel_bath",
    stockLevel: "half",
    threshold: "low",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-102-007",
    roomId: "ROOM-001",
    type: "yukata",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },
  {
    id: "AMN-102-008",
    roomId: "ROOM-001",
    type: "slippers",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:28",
    lastCheckedBy: "STF001",
  },

  // Room 401 - 貴賓室(補充済み)
  {
    id: "AMN-401-001",
    roomId: "ROOM-004",
    type: "shampoo",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-401-002",
    roomId: "ROOM-004",
    type: "conditioner",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-401-003",
    roomId: "ROOM-004",
    type: "body_soap",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-401-004",
    roomId: "ROOM-004",
    type: "toothbrush",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-401-005",
    roomId: "ROOM-004",
    type: "towel_face",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-401-006",
    roomId: "ROOM-004",
    type: "towel_bath",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-401-007",
    roomId: "ROOM-004",
    type: "yukata",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-401-008",
    roomId: "ROOM-004",
    type: "slippers",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "11:00",
    lastCheckedBy: "STF003",
  },

  // Room 203 - 未チェック(前回のまま)
  {
    id: "AMN-203-001",
    roomId: "ROOM-002",
    type: "shampoo",
    stockLevel: "half",
    threshold: "low",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },
  {
    id: "AMN-203-002",
    roomId: "ROOM-002",
    type: "conditioner",
    stockLevel: "low",
    threshold: "low",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },
  {
    id: "AMN-203-003",
    roomId: "ROOM-002",
    type: "body_soap",
    stockLevel: "half",
    threshold: "low",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },
  {
    id: "AMN-203-004",
    roomId: "ROOM-002",
    type: "toothbrush",
    stockLevel: "low",
    threshold: "half",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },
  {
    id: "AMN-203-005",
    roomId: "ROOM-002",
    type: "towel_face",
    stockLevel: "half",
    threshold: "half",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },
  {
    id: "AMN-203-006",
    roomId: "ROOM-002",
    type: "towel_bath",
    stockLevel: "low",
    threshold: "low",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },
  {
    id: "AMN-203-007",
    roomId: "ROOM-002",
    type: "yukata",
    stockLevel: "half",
    threshold: "half",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },
  {
    id: "AMN-203-008",
    roomId: "ROOM-002",
    type: "slippers",
    stockLevel: "half",
    threshold: "half",
    lastCheckedAt: "前日",
    lastCheckedBy: null,
  },

  // ROOM-005 - ふふラグジュアリーコーナースイート（全て補充済み）
  {
    id: "AMN-005-001",
    roomId: "ROOM-005",
    type: "shampoo",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-005-002",
    roomId: "ROOM-005",
    type: "conditioner",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-005-003",
    roomId: "ROOM-005",
    type: "body_soap",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-005-004",
    roomId: "ROOM-005",
    type: "toothbrush",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-005-005",
    roomId: "ROOM-005",
    type: "towel_face",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-005-006",
    roomId: "ROOM-005",
    type: "towel_bath",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-005-007",
    roomId: "ROOM-005",
    type: "yukata",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-005-008",
    roomId: "ROOM-005",
    type: "slippers",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:30",
    lastCheckedBy: "STF003",
  },

  // ROOM-006 - ふふラグジュアリープレミアムスイート（一部補充要）
  {
    id: "AMN-006-001",
    roomId: "ROOM-006",
    type: "shampoo",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-006-002",
    roomId: "ROOM-006",
    type: "conditioner",
    stockLevel: "half",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-006-003",
    roomId: "ROOM-006",
    type: "body_soap",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-006-004",
    roomId: "ROOM-006",
    type: "toothbrush",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-006-005",
    roomId: "ROOM-006",
    type: "towel_face",
    stockLevel: "half",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-006-006",
    roomId: "ROOM-006",
    type: "towel_bath",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-006-007",
    roomId: "ROOM-006",
    type: "yukata",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
  {
    id: "AMN-006-008",
    roomId: "ROOM-006",
    type: "slippers",
    stockLevel: "full",
    threshold: "half",
    lastCheckedAt: "09:45",
    lastCheckedBy: "STF003",
  },
];

// === Mock Room Equipment ===
export const mockRoomEquipments: RoomEquipment[] = [
  // Room 201
  {
    id: "EQP-201-001",
    roomId: "ROOM-002",
    type: "air_conditioner",
    status: "working",
    lastMaintenanceAt: "2024-12-01",
    notes: null,
  },
  {
    id: "EQP-201-002",
    roomId: "ROOM-002",
    type: "tv",
    status: "working",
    lastMaintenanceAt: "2024-11-15",
    notes: null,
  },
  {
    id: "EQP-201-003",
    roomId: "ROOM-002",
    type: "refrigerator",
    status: "working",
    lastMaintenanceAt: "2024-10-20",
    notes: null,
  },
  {
    id: "EQP-201-004",
    roomId: "ROOM-002",
    type: "wifi_router",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-201-005",
    roomId: "ROOM-002",
    type: "safe",
    status: "working",
    lastMaintenanceAt: "2024-09-01",
    notes: null,
  },
  {
    id: "EQP-201-006",
    roomId: "ROOM-002",
    type: "hair_dryer",
    status: "working",
    lastMaintenanceAt: "2024-11-01",
    notes: null,
  },
  {
    id: "EQP-201-007",
    roomId: "ROOM-002",
    type: "kettle",
    status: "working",
    lastMaintenanceAt: "2024-10-15",
    notes: null,
  },

  // Room 305
  {
    id: "EQP-305-001",
    roomId: "ROOM-003",
    type: "air_conditioner",
    status: "working",
    lastMaintenanceAt: "2024-12-05",
    notes: null,
  },
  {
    id: "EQP-305-002",
    roomId: "ROOM-003",
    type: "tv",
    status: "working",
    lastMaintenanceAt: "2024-11-20",
    notes: null,
  },
  {
    id: "EQP-305-003",
    roomId: "ROOM-003",
    type: "refrigerator",
    status: "working",
    lastMaintenanceAt: "2024-10-25",
    notes: null,
  },
  {
    id: "EQP-305-004",
    roomId: "ROOM-003",
    type: "wifi_router",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-305-005",
    roomId: "ROOM-003",
    type: "safe",
    status: "working",
    lastMaintenanceAt: "2024-09-15",
    notes: null,
  },
  {
    id: "EQP-305-006",
    roomId: "ROOM-003",
    type: "hair_dryer",
    status: "working",
    lastMaintenanceAt: "2024-11-10",
    notes: null,
  },
  {
    id: "EQP-305-007",
    roomId: "ROOM-003",
    type: "kettle",
    status: "working",
    lastMaintenanceAt: "2024-10-20",
    notes: null,
  },

  // Room 102 - 一部故障あり
  {
    id: "EQP-102-001",
    roomId: "ROOM-001",
    type: "air_conditioner",
    status: "needs_maintenance",
    lastMaintenanceAt: "2024-08-01",
    notes: "異音がする",
  },
  {
    id: "EQP-102-002",
    roomId: "ROOM-001",
    type: "tv",
    status: "working",
    lastMaintenanceAt: "2024-11-01",
    notes: null,
  },
  {
    id: "EQP-102-003",
    roomId: "ROOM-001",
    type: "refrigerator",
    status: "working",
    lastMaintenanceAt: "2024-09-15",
    notes: null,
  },
  {
    id: "EQP-102-004",
    roomId: "ROOM-001",
    type: "wifi_router",
    status: "working",
    lastMaintenanceAt: "2024-12-05",
    notes: null,
  },
  {
    id: "EQP-102-005",
    roomId: "ROOM-001",
    type: "safe",
    status: "working",
    lastMaintenanceAt: "2024-07-01",
    notes: null,
  },
  {
    id: "EQP-102-006",
    roomId: "ROOM-001",
    type: "hair_dryer",
    status: "broken",
    lastMaintenanceAt: "2024-06-01",
    notes: "交換必要",
  },
  {
    id: "EQP-102-007",
    roomId: "ROOM-001",
    type: "kettle",
    status: "working",
    lastMaintenanceAt: "2024-10-01",
    notes: null,
  },

  // Room 401 - 貴賓室(全て正常)
  {
    id: "EQP-401-001",
    roomId: "ROOM-004",
    type: "air_conditioner",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-401-002",
    roomId: "ROOM-004",
    type: "tv",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-401-003",
    roomId: "ROOM-004",
    type: "refrigerator",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-401-004",
    roomId: "ROOM-004",
    type: "wifi_router",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-401-005",
    roomId: "ROOM-004",
    type: "safe",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-401-006",
    roomId: "ROOM-004",
    type: "hair_dryer",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-401-007",
    roomId: "ROOM-004",
    type: "kettle",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },

  // Room 203
  {
    id: "EQP-203-001",
    roomId: "ROOM-002",
    type: "air_conditioner",
    status: "working",
    lastMaintenanceAt: "2024-11-15",
    notes: null,
  },
  {
    id: "EQP-203-002",
    roomId: "ROOM-002",
    type: "tv",
    status: "needs_maintenance",
    lastMaintenanceAt: "2024-09-01",
    notes: "リモコン反応悪い",
  },
  {
    id: "EQP-203-003",
    roomId: "ROOM-002",
    type: "refrigerator",
    status: "working",
    lastMaintenanceAt: "2024-10-10",
    notes: null,
  },
  {
    id: "EQP-203-004",
    roomId: "ROOM-002",
    type: "wifi_router",
    status: "working",
    lastMaintenanceAt: "2024-12-01",
    notes: null,
  },
  {
    id: "EQP-203-005",
    roomId: "ROOM-002",
    type: "safe",
    status: "working",
    lastMaintenanceAt: "2024-08-15",
    notes: null,
  },
  {
    id: "EQP-203-006",
    roomId: "ROOM-002",
    type: "hair_dryer",
    status: "working",
    lastMaintenanceAt: "2024-10-20",
    notes: null,
  },
  {
    id: "EQP-203-007",
    roomId: "ROOM-002",
    type: "kettle",
    status: "working",
    lastMaintenanceAt: "2024-09-25",
    notes: null,
  },

  // ROOM-005 - ふふラグジュアリーコーナースイート（全て正常）
  {
    id: "EQP-005-001",
    roomId: "ROOM-005",
    type: "air_conditioner",
    status: "working",
    lastMaintenanceAt: "2024-12-15",
    notes: null,
  },
  {
    id: "EQP-005-002",
    roomId: "ROOM-005",
    type: "tv",
    status: "working",
    lastMaintenanceAt: "2024-12-15",
    notes: null,
  },
  {
    id: "EQP-005-003",
    roomId: "ROOM-005",
    type: "refrigerator",
    status: "working",
    lastMaintenanceAt: "2024-12-15",
    notes: null,
  },
  {
    id: "EQP-005-004",
    roomId: "ROOM-005",
    type: "wifi_router",
    status: "working",
    lastMaintenanceAt: "2024-12-15",
    notes: null,
  },
  {
    id: "EQP-005-005",
    roomId: "ROOM-005",
    type: "safe",
    status: "working",
    lastMaintenanceAt: "2024-12-15",
    notes: null,
  },
  {
    id: "EQP-005-006",
    roomId: "ROOM-005",
    type: "hair_dryer",
    status: "working",
    lastMaintenanceAt: "2024-12-15",
    notes: null,
  },
  {
    id: "EQP-005-007",
    roomId: "ROOM-005",
    type: "kettle",
    status: "working",
    lastMaintenanceAt: "2024-12-15",
    notes: null,
  },

  // ROOM-006 - ふふラグジュアリープレミアムスイート（一部要点検あり）
  {
    id: "EQP-006-001",
    roomId: "ROOM-006",
    type: "air_conditioner",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-006-002",
    roomId: "ROOM-006",
    type: "tv",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-006-003",
    roomId: "ROOM-006",
    type: "refrigerator",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-006-004",
    roomId: "ROOM-006",
    type: "wifi_router",
    status: "needs_maintenance",
    lastMaintenanceAt: "2024-10-01",
    notes: "接続が不安定",
  },
  {
    id: "EQP-006-005",
    roomId: "ROOM-006",
    type: "safe",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-006-006",
    roomId: "ROOM-006",
    type: "hair_dryer",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
  {
    id: "EQP-006-007",
    roomId: "ROOM-006",
    type: "kettle",
    status: "working",
    lastMaintenanceAt: "2024-12-10",
    notes: null,
  },
];

// === Helper Functions ===
export const getAmenitiesByRoom = (roomId: string): RoomAmenity[] =>
  mockRoomAmenities.filter((a) => a.roomId === roomId);

export const getEquipmentByRoom = (roomId: string): RoomEquipment[] =>
  mockRoomEquipments.filter((e) => e.roomId === roomId);

export const getAmenitiesBelowThreshold = (): RoomAmenity[] =>
  mockRoomAmenities.filter(
    (a) => STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
  );

export const getEquipmentNeedsMaintenance = (): RoomEquipment[] =>
  mockRoomEquipments.filter((e) => e.status !== "working");

export const getRoomEquipmentStatus = (
  roomId: string,
): {
  amenitiesOk: number;
  amenitiesLow: number;
  equipmentOk: number;
  equipmentIssues: number;
} => {
  const amenities = getAmenitiesByRoom(roomId);
  const equipment = getEquipmentByRoom(roomId);

  const amenitiesLow = amenities.filter(
    (a) => STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
  ).length;

  const equipmentIssues = equipment.filter((e) => e.status !== "working").length;

  return {
    amenitiesOk: amenities.length - amenitiesLow,
    amenitiesLow,
    equipmentOk: equipment.length - equipmentIssues,
    equipmentIssues,
  };
};

export const getAllRoomIds = (): string[] => {
  const roomSet = new Set<string>();
  mockRoomAmenities.forEach((amenity) => roomSet.add(amenity.roomId));
  mockRoomEquipments.forEach((equipment) => roomSet.add(equipment.roomId));
  return Array.from(roomSet).sort();
};

// === Room Amenities/Equipment by Room ID (Map形式) ===
export const roomAmenitiesMap: Record<string, RoomAmenity[]> = {
  "ROOM-001": mockRoomAmenities.filter((a) => a.roomId === "ROOM-001"),
  "ROOM-002": mockRoomAmenities.filter((a) => a.roomId === "ROOM-002"),
  "ROOM-003": mockRoomAmenities.filter((a) => a.roomId === "ROOM-003"),
  "ROOM-004": mockRoomAmenities.filter((a) => a.roomId === "ROOM-004"),
  "ROOM-005": mockRoomAmenities.filter((a) => a.roomId === "ROOM-005"),
  "ROOM-006": mockRoomAmenities.filter((a) => a.roomId === "ROOM-006"),
};

export const roomEquipmentMap: Record<string, RoomEquipment[]> = {
  "ROOM-001": mockRoomEquipments.filter((e) => e.roomId === "ROOM-001"),
  "ROOM-002": mockRoomEquipments.filter((e) => e.roomId === "ROOM-002"),
  "ROOM-003": mockRoomEquipments.filter((e) => e.roomId === "ROOM-003"),
  "ROOM-004": mockRoomEquipments.filter((e) => e.roomId === "ROOM-004"),
  "ROOM-005": mockRoomEquipments.filter((e) => e.roomId === "ROOM-005"),
  "ROOM-006": mockRoomEquipments.filter((e) => e.roomId === "ROOM-006"),
};
