import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type UserRole = "admin" | "staff" | "guest";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole; // 必要なロール
  requireAdmin?: boolean; // 後方互換性のため残す（非推奨）
}

// ユーザーの実際のロールを判定
const getUserRole = (user: { isAdmin?: boolean; isGuest?: boolean } | null): UserRole | null => {
  if (!user) return null;
  if (user.isAdmin) return "admin";
  if (user.isGuest) return "guest";
  return "staff";
};

// ロールに応じたデフォルトのリダイレクト先
const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "guest":
      return "/guest/portal";
    case "staff":
    default:
      return "/staff/tasks";
  }
};

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading spinner while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = getUserRole(currentUser);

  // 後方互換性: requireAdmin が true の場合は requiredRole='admin' として扱う
  const effectiveRequiredRole = requiredRole || (requireAdmin ? "admin" : undefined);

  // 特定のロールが必要な場合、ロールが一致しなければリダイレクト
  if (effectiveRequiredRole && userRole !== effectiveRequiredRole) {
    // ユーザーのロールに応じた適切なページにリダイレクト
    const redirectTo = getDefaultRoute(userRole!);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
