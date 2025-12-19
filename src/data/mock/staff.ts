import type { Staff } from "../../types";

export const mockStaff: Staff[] = [
  {
    id: "STF001",
    name: "中村 さくら",
    nameKana: "ナカムラ サクラ",
    role: "cleaning",
    skills: ["cleaning", "turndown"],
    status: "on_duty",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    currentTaskId: "TSK002",
    avatarColor: "#5DAE8B",
    emergencyContact: {
      phone: "090-1234-5678",
      relationship: "母",
    },
  },
  {
    id: "STF002",
    name: "伊藤 大輔",
    nameKana: "イトウ ダイスケ",
    role: "service",
    skills: ["meal_service", "celebration", "turndown"],
    status: "on_duty",
    shiftStart: "10:00",
    shiftEnd: "20:00",
    currentTaskId: null,
    avatarColor: "#1B4965",
    emergencyContact: {
      phone: "090-2345-6789",
      relationship: "配偶者",
    },
  },
  {
    id: "STF003",
    name: "渡辺 明美",
    nameKana: "ワタナベ アケミ",
    role: "cleaning",
    skills: ["cleaning", "bath"],
    status: "on_break",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    currentTaskId: "TSK005",
    avatarColor: "#C73E3A",
    emergencyContact: {
      phone: "090-3456-7890",
      relationship: "兄",
    },
  },
  {
    id: "STF004",
    name: "小林 誠",
    nameKana: "コバヤシ マコト",
    role: "driver",
    skills: ["pickup"],
    status: "on_duty",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    currentTaskId: null,
    avatarColor: "#B8860B",
    emergencyContact: {
      phone: "090-4567-8901",
      relationship: "父",
    },
  },
  {
    id: "STF005",
    name: "加藤 由美",
    nameKana: "カトウ ユミ",
    role: "concierge",
    skills: ["celebration", "meal_service", "other"],
    status: "out",
    shiftStart: "07:00",
    shiftEnd: "16:00",
    currentTaskId: null,
    avatarColor: "#7D7D7D",
    emergencyContact: {
      phone: "090-5678-9012",
      relationship: "姉",
    },
  },
  {
    id: "STF006",
    name: "吉田 浩二",
    nameKana: "ヨシダ コウジ",
    role: "kitchen",
    skills: ["meal_service"],
    status: "on_duty",
    shiftStart: "06:00",
    shiftEnd: "15:00",
    currentTaskId: "TSK007",
    avatarColor: "#2E6B8A",
    emergencyContact: {
      phone: "090-6789-0123",
      relationship: "配偶者",
    },
  },
  {
    id: "STF007",
    name: "山本 真理子",
    nameKana: "ヤマモト マリコ",
    role: "front",
    skills: ["meal_service", "celebration", "other"],
    status: "on_duty",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    currentTaskId: null,
    avatarColor: "#9B59B6",
    emergencyContact: {
      phone: "090-7890-1234",
      relationship: "母",
    },
  },
  {
    id: "STF008",
    name: "田中 健太",
    nameKana: "タナカ ケンタ",
    role: "manager",
    skills: ["cleaning", "meal_service", "celebration", "pickup", "other"],
    status: "on_duty",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    currentTaskId: null,
    avatarColor: "#2C3E50",
    emergencyContact: {
      phone: "090-8901-2345",
      relationship: "配偶者",
    },
  },
];

// Helper functions
export const getStaffById = (id: string): Staff | undefined =>
  mockStaff.find((staff) => staff.id === id);

export const getAvailableDrivers = (): Staff[] =>
  mockStaff.filter(
    (staff) => staff.role === "driver" && staff.status === "on_duty" && !staff.currentTaskId,
  );
