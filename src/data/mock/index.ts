// Re-export all mock data and helper functions

// === Helpers ===
export { getToday, getTomorrow, formatTime, getTimeSlots } from "./helpers";

// === Staff ===
export { mockStaff, getStaffById, getAvailableDrivers } from "./staff";

// === Reservations ===
export { mockReservations, getReservationById } from "./reservations";

// === Rooms (Amenities & Equipment) ===
export {
  mockRooms,
  mockAmenityTypes,
  mockEquipmentTypes,
  mockRoomAmenities,
  mockRoomEquipments,
  getAmenitiesByRoom,
  getEquipmentByRoom,
  getAmenitiesBelowThreshold,
  getEquipmentNeedsMaintenance,
  getRoomEquipmentStatus,
  getAllRoomIds,
  roomAmenitiesMap,
  roomEquipmentMap,
  getRoomById,
  getRoomName,
} from "./rooms";

// === Vehicles & Shuttle Tasks ===
export {
  mockVehicles,
  mockShuttleTasks,
  getVehicleById,
  getShuttleTasksByDriver,
  getShuttleTasksByVehicle,
  getPendingShuttleTasks,
  getUnassignedShuttleTasks,
  getAvailableVehicles,
  getShuttleTaskById,
} from "./vehicles";

// === Tasks (Legacy) ===
export {
  mockTasks,
  mockTaskTemplates,
  getTasksByRoom,
  getTasksByStaff,
  getTasksByStatus,
  getPendingTasksForStaff,
} from "./tasks";

// === Unified Tasks (Meals, Celebrations, etc.) ===
export {
  // Meal Tasks
  mockMealTasks,
  mockMealOrderNotifications,
  getMealTaskById,
  getMealTasksByStaff,
  getMealTasksByStatus,
  getMealTasksByRoom,
  getPendingMealTasks,
  getMealTasksNeedingCheck,
  getUnreadOrderNotifications,
  getOrderNotificationsByRoom,
  // Celebration Tasks
  mockCelebrationTasks,
  getCelebrationTaskById,
  getCelebrationTasksByStaff,
  getCelebrationTasksByStatus,
  getPendingCelebrationTasks,
  getCelebrationTasksByRoom,
  // Room Cleaning Status
  getRoomCleaningStatuses,
  getCleaningTasks,
  getInspectionTasks,
  createInspectionTask,
  // Unified Tasks
  mockUnifiedTasks,
  getUnifiedTaskById,
  getUnifiedTasksByStaff,
  getUnifiedTasksByType,
  getPendingUnifiedTasks,
} from "./unifiedTasks";

// Re-export RoomCleaningInfo interface
export type { RoomCleaningInfo } from "./unifiedTasks";

// === Staff Messages ===
export { mockStaffMessages, getMessagesByStaff, getUnreadMessages } from "./messages";

// === Statistics ===
export { mockDailyStats } from "./stats";

// === Staff Chat ===
export {
  mockChatRooms,
  mockChatMessages,
  getChatRoomsByStaff,
  getMessagesByChatRoom,
  getUnreadCountByRoom,
  getLastMessageByRoom,
  getChatRoomById,
  getDMPartnerId,
} from "./chat";
