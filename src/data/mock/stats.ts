import type { DailyStats } from "../../types";
import { mockTasks } from "./tasks";
import { mockReservations } from "./reservations";
import { getToday } from "./helpers";

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
