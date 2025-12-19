import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export const LoginPage = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const from = (location.state as { from?: Location })?.from?.pathname || "/staff";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!loginId || !password) {
      setLocalError(t("login.error.required"));
      return;
    }

    const success = await login(loginId, password);
    if (success) {
      // ログイン後のリダイレクト先をユーザータイプに基づいて決定
      // currentUserはまだ更新されていないので、loginIdで判断する
      // 管理者アカウントかどうかをloginIdで判断（admin, manager）
      const isAdminLogin = loginId === "admin" || loginId === "manager";
      const redirectPath = isAdminLogin ? "/admin/dashboard" : from;
      navigate(redirectPath, { replace: true });
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header with language switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="compact" />
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ResortDX</h1>
            <p className="text-slate-500 text-sm mt-1">{t("login.title")}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {displayError && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-100">
                  {displayError}
                </div>
              )}

              {/* Login ID */}
              <div>
                <label htmlFor="loginId" className="block text-sm font-medium text-slate-700 mb-2">
                  {t("login.loginId")}
                </label>
                <input
                  id="loginId"
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all outline-none text-slate-800"
                  placeholder="nakamura"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  {t("login.password")}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all outline-none text-slate-800"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Loading...</span>
                  </span>
                ) : (
                  t("login.loginButton")
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center mb-2">Demo credentials</p>
              {/* Admin credentials */}
              <div className="bg-blue-50 rounded-lg p-3 text-xs text-slate-500 font-mono mb-2">
                <p className="text-blue-600 font-medium mb-1">Admin</p>
                <div className="flex justify-between">
                  <span>Login ID:</span>
                  <span className="text-slate-700">admin</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Password:</span>
                  <span className="text-slate-700">admin123</span>
                </div>
              </div>
              {/* Staff credentials */}
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 font-mono">
                <p className="text-slate-600 font-medium mb-1">Staff</p>
                <div className="flex justify-between">
                  <span>Login ID:</span>
                  <span className="text-slate-700">nakamura</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Password:</span>
                  <span className="text-slate-700">pass001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
