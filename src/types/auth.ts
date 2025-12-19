import type { StaffRole } from "./index";

// === Authentication Types ===

// ログイン資格情報
export interface AuthCredentials {
  loginId: string;
  password: string;
}

// 認証状態
export interface AuthState {
  isAuthenticated: boolean;
  currentUser: AuthenticatedStaff | null;
  isLoading: boolean;
  error: string | null;
}

// 認証済みユーザー情報（スタッフまたは管理者）
export interface AuthenticatedStaff {
  id: string;
  loginId: string;
  name: string;
  nameKana: string;
  role: StaffRole;
  avatarColor: string;
  isAdmin?: boolean; // 管理者フラグ
}

// パスワード変更リクエスト
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ログインID変更リクエスト
export interface LoginIdChangeRequest {
  newLoginId: string;
}
