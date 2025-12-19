import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthState, AuthenticatedStaff } from "../types/auth";
import {
  validateCredentials,
  updatePassword as mockUpdatePassword,
  updateLoginId as mockUpdateLoginId,
  getLoginIdByStaffId,
} from "../data/mock/auth";
import { getStaffById } from "../data/mock/staff";

interface AuthContextType extends AuthState {
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateLoginId: (newLoginId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "resortdx_auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    isLoading: true,
    error: null,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth) as AuthenticatedStaff;
        setAuthState({
          isAuthenticated: true,
          currentUser: parsed,
          isLoading: false,
          error: null,
        });
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (loginId: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const credentials = validateCredentials(loginId, password);
    if (!credentials) {
      setAuthState({
        isAuthenticated: false,
        currentUser: null,
        isLoading: false,
        error: "ログインIDまたはパスワードが正しくありません",
      });
      return false;
    }

    let authenticatedUser: AuthenticatedStaff;

    // 管理者の場合は仮想ユーザーを作成
    if (credentials.isAdmin) {
      authenticatedUser = {
        id: credentials.staffId,
        loginId: credentials.loginId,
        name: credentials.loginId === "admin" ? "システム管理者" : "マネージャー",
        nameKana: credentials.loginId === "admin" ? "システムカンリシャ" : "マネージャー",
        role: "manager",
        avatarColor: "var(--ai)",
        isAdmin: true,
      };
    } else if (credentials.isGuest) {
      // ゲストの場合は仮想ユーザーを作成
      authenticatedUser = {
        id: credentials.staffId,
        loginId: credentials.loginId,
        name: "ゲスト",
        nameKana: "ゲスト",
        role: "guest",
        avatarColor: "#10b981",
        isGuest: true,
      };
    } else {
      // スタッフの場合は既存の処理
      const staff = getStaffById(credentials.staffId);
      if (!staff) {
        setAuthState({
          isAuthenticated: false,
          currentUser: null,
          isLoading: false,
          error: "スタッフ情報が見つかりません",
        });
        return false;
      }

      authenticatedUser = {
        id: staff.id,
        loginId: credentials.loginId,
        name: staff.name,
        nameKana: staff.nameKana,
        role: staff.role,
        avatarColor: staff.avatarColor,
        isAdmin: false,
      };
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));

    setAuthState({
      isAuthenticated: true,
      currentUser: authenticatedUser,
      isLoading: false,
      error: null,
    });

    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      if (!authState.currentUser) return false;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const success = mockUpdatePassword(authState.currentUser.id, currentPassword, newPassword);
      return success;
    },
    [authState.currentUser],
  );

  const updateLoginIdFn = useCallback(
    async (newLoginId: string): Promise<boolean> => {
      if (!authState.currentUser) return false;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const success = mockUpdateLoginId(authState.currentUser.id, newLoginId);
      if (success) {
        // Update local state
        const updatedUser = {
          ...authState.currentUser,
          loginId: getLoginIdByStaffId(authState.currentUser.id) || newLoginId,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        setAuthState((prev) => ({
          ...prev,
          currentUser: updatedUser,
        }));
      }
      return success;
    },
    [authState.currentUser],
  );

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updatePassword,
        updateLoginId: updateLoginIdFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
