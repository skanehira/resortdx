import type { StaffSharedNote } from "../../types";

// スタッフ共有メモ（引き継ぎ・連絡用）
export const mockStaffNotes: StaffSharedNote[] = [
  {
    id: "NOTE001",
    content:
      "【重要】本日14:00から館内消毒作業があります。3階西側エリアは14:00-15:00の間清掃不可です。",
    createdBy: "STF008",
    createdByName: "田中 健太",
    createdAt: "2024-01-15T08:30:00",
    isImportant: true,
    expiresAt: "2024-01-15T18:00:00",
  },
  {
    id: "NOTE002",
    content:
      "301号室のお客様（山田様）は足が不自由なため、お食事の配膳時は必ずテーブルまでお持ちしてください。",
    createdBy: "STF007",
    createdByName: "山本 真理子",
    createdAt: "2024-01-15T09:00:00",
    isImportant: true,
    expiresAt: "2024-01-17T12:00:00",
  },
  {
    id: "NOTE003",
    content:
      "厨房の冷蔵庫（2番）が不調です。修理業者は明日10:00に来訪予定。それまで1番と3番を使用してください。",
    createdBy: "STF006",
    createdByName: "吉田 浩二",
    createdAt: "2024-01-14T16:00:00",
    updatedAt: "2024-01-14T17:30:00",
    isImportant: false,
    expiresAt: "2024-01-16T12:00:00",
  },
  {
    id: "NOTE004",
    content:
      "送迎車両（2号車）のエアコンが効きにくくなっています。暑い日は1号車を優先使用してください。",
    createdBy: "STF004",
    createdByName: "小林 誠",
    createdAt: "2024-01-14T11:00:00",
    isImportant: false,
    expiresAt: null,
  },
  {
    id: "NOTE005",
    content:
      "夜勤への引継ぎ：205号室のお客様から追加のタオルリクエストあり。22:00までにお届け予定です。",
    createdBy: "STF001",
    createdByName: "中村 さくら",
    createdAt: "2024-01-15T16:45:00",
    isImportant: false,
    expiresAt: "2024-01-15T23:00:00",
  },
];

// Helper functions
export const getActiveNotes = (): StaffSharedNote[] => {
  const now = new Date().toISOString();
  return mockStaffNotes.filter((note) => !note.expiresAt || note.expiresAt > now);
};

export const getImportantNotes = (): StaffSharedNote[] => {
  return getActiveNotes().filter((note) => note.isImportant);
};

export const addStaffNote = (
  content: string,
  createdBy: string,
  createdByName: string,
  isImportant: boolean = false,
  expiresAt?: string | null,
): StaffSharedNote => {
  const newNote: StaffSharedNote = {
    id: `NOTE${String(mockStaffNotes.length + 1).padStart(3, "0")}`,
    content,
    createdBy,
    createdByName,
    createdAt: new Date().toISOString(),
    isImportant,
    expiresAt: expiresAt ?? null,
  };
  mockStaffNotes.push(newNote);
  return newNote;
};

export const updateStaffNote = (
  noteId: string,
  updates: Partial<Pick<StaffSharedNote, "content" | "isImportant" | "expiresAt">>,
): boolean => {
  const note = mockStaffNotes.find((n) => n.id === noteId);
  if (!note) return false;

  if (updates.content !== undefined) note.content = updates.content;
  if (updates.isImportant !== undefined) note.isImportant = updates.isImportant;
  if (updates.expiresAt !== undefined) note.expiresAt = updates.expiresAt;
  note.updatedAt = new Date().toISOString();

  return true;
};

export const deleteStaffNote = (noteId: string): boolean => {
  const index = mockStaffNotes.findIndex((n) => n.id === noteId);
  if (index === -1) return false;
  mockStaffNotes.splice(index, 1);
  return true;
};
