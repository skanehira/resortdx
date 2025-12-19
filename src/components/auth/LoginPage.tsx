import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

// デモ用ログイン情報
const DEMO_CREDENTIALS = [
  {
    id: "admin",
    label: "Admin",
    description: "管理者画面へアクセス",
    loginId: "admin",
    password: "admin123",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    id: "staff",
    label: "Staff",
    description: "スタッフ画面へアクセス",
    loginId: "nakamura",
    password: "pass001",
    bgColor: "bg-slate-50 hover:bg-slate-100",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
  },
  {
    id: "guest",
    label: "Guest",
    description: "ゲスト画面へアクセス",
    loginId: "guest",
    password: "guest123",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
  },
] as const;

export const LoginPage = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const from = (location.state as { from?: Location })?.from?.pathname || "/staff";

  const performLogin = async (id: string, pass: string) => {
    setLocalError(null);
    const success = await login(id, pass);
    if (success) {
      const isAdminLogin = id === "admin" || id === "manager";
      const isGuestLogin = id === "guest";
      let redirectPath: string;
      if (isAdminLogin) {
        redirectPath = "/admin/dashboard";
      } else if (isGuestLogin) {
        redirectPath = "/guest/portal";
      } else {
        redirectPath = from;
      }
      navigate(redirectPath, { replace: true });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!loginId || !password) {
      setLocalError(t("login.error.required"));
      return;
    }

    await performLogin(loginId, password);
  };

  const handleDemoLogin = async (credential: (typeof DEMO_CREDENTIALS)[number]) => {
    if (isLoading) return;
    setLoginId(credential.loginId);
    setPassword(credential.password);
    await performLogin(credential.loginId, credential.password);
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

            {/* Demo credentials - clickable cards */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center mb-3">
                Demo credentials - クリックでログイン
              </p>
              <div className="space-y-2">
                {DEMO_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.id}
                    type="button"
                    onClick={() => handleDemoLogin(cred)}
                    disabled={isLoading}
                    className={`w-full ${cred.bgColor} rounded-lg p-3 text-left transition-all border ${cred.borderColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${cred.textColor} font-medium text-sm`}>{cred.label}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{cred.description}</p>
                      </div>
                      <div className="text-right text-xs text-slate-400 font-mono">
                        <div>{cred.loginId}</div>
                        <div>{cred.password}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
