import type { Staff } from "../../types";

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

// Helper functions
export const getStaffById = (id: string): Staff | undefined =>
	mockStaff.find((staff) => staff.id === id);

export const getAvailableDrivers = (): Staff[] =>
	mockStaff.filter(
		(staff) =>
			staff.role === "driver" && staff.isOnDuty && !staff.currentTaskId,
	);
