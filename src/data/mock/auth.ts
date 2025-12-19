// スタッフ・管理者ログイン資格情報（モック）
// 実際のアプリケーションではパスワードはハッシュ化される

export interface StaffCredentials {
  staffId: string;
  loginId: string;
  password: string; // デモ用のプレーンテキスト
  isAdmin?: boolean; // 管理者フラグ
  isGuest?: boolean; // ゲストフラグ
}

// 管理者アカウント（スタッフIDがADMで始まる）
export const adminCredentials: StaffCredentials[] = [
  { staffId: "ADM001", loginId: "admin", password: "admin123", isAdmin: true },
  {
    staffId: "ADM002",
    loginId: "manager",
    password: "manager123",
    isAdmin: true,
  },
];

// スタッフアカウント
export const staffCredentials: StaffCredentials[] = [
  { staffId: "STF001", loginId: "nakamura", password: "pass001" },
  { staffId: "STF002", loginId: "itou", password: "pass002" },
  { staffId: "STF003", loginId: "watanabe", password: "pass003" },
  { staffId: "STF004", loginId: "kobayashi", password: "pass004" },
  { staffId: "STF005", loginId: "kato", password: "pass005" },
  { staffId: "STF006", loginId: "yoshida", password: "pass006" },
  { staffId: "STF007", loginId: "yamamoto", password: "pass007" },
  { staffId: "STF008", loginId: "tanaka", password: "pass008" },
];

// ゲストアカウント（デモ用）
export const guestCredentials: StaffCredentials[] = [
  { staffId: "GST001", loginId: "guest", password: "guest123", isGuest: true },
];

// 全ての資格情報（後方互換性のため）
export const mockCredentials: StaffCredentials[] = [
  ...adminCredentials,
  ...staffCredentials,
  ...guestCredentials,
];

// 資格情報の検証
export const validateCredentials = (loginId: string, password: string): StaffCredentials | null => {
  return mockCredentials.find((c) => c.loginId === loginId && c.password === password) || null;
};

// パスワード更新（モック）
export const updatePassword = (
  staffId: string,
  currentPassword: string,
  newPassword: string,
): boolean => {
  const cred = mockCredentials.find((c) => c.staffId === staffId);
  if (!cred || cred.password !== currentPassword) return false;
  cred.password = newPassword; // インメモリ更新（デモ用）
  return true;
};

// ログインID更新（モック）
export const updateLoginId = (staffId: string, newLoginId: string): boolean => {
  // 重複チェック
  if (mockCredentials.some((c) => c.loginId === newLoginId && c.staffId !== staffId)) {
    return false;
  }
  const cred = mockCredentials.find((c) => c.staffId === staffId);
  if (!cred) return false;
  cred.loginId = newLoginId;
  return true;
};

// スタッフIDからログインIDを取得
export const getLoginIdByStaffId = (staffId: string): string | null => {
  const cred = mockCredentials.find((c) => c.staffId === staffId);
  return cred?.loginId || null;
};
