import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { getStaffById } from "../../data/mock/staff";
import { STAFF_ROLE_LABELS } from "../../types";
import { ArrowLeftIcon, EditIcon, CheckIcon, CloseIcon } from "../ui/Icons";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export const MyPage = () => {
  const { t } = useTranslation(["auth", "types"]);
  const navigate = useNavigate();
  const { currentUser, logout, updatePassword, updateLoginId } = useAuth();

  const [activeSection, setActiveSection] = useState<"profile" | "loginId" | "password" | null>(
    null,
  );

  // Login ID change state
  const [newLoginId, setNewLoginId] = useState("");
  const [loginIdError, setLoginIdError] = useState<string | null>(null);
  const [loginIdSuccess, setLoginIdSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentUser) {
    return null;
  }

  const staff = getStaffById(currentUser.id);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLoginIdChange = async () => {
    setLoginIdError(null);
    setLoginIdSuccess(false);

    if (!newLoginId.trim()) {
      setLoginIdError(t("auth:changeLoginId.error.invalid"));
      return;
    }

    setIsProcessing(true);
    const success = await updateLoginId(newLoginId);
    setIsProcessing(false);

    if (success) {
      setLoginIdSuccess(true);
      setNewLoginId("");
      setTimeout(() => {
        setActiveSection(null);
        setLoginIdSuccess(false);
      }, 2000);
    } else {
      setLoginIdError(t("auth:changeLoginId.error.duplicate"));
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("auth:changePassword.error.required"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("auth:changePassword.error.mismatch"));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t("auth:changePassword.error.tooShort"));
      return;
    }

    setIsProcessing(true);
    const success = await updatePassword(currentPassword, newPassword);
    setIsProcessing(false);

    if (success) {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setActiveSection(null);
        setPasswordSuccess(false);
      }, 2000);
    } else {
      setPasswordError(t("auth:changePassword.error.incorrectCurrent"));
    }
  };

  const resetForms = () => {
    setActiveSection(null);
    setNewLoginId("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLoginIdError(null);
    setPasswordError(null);
    setLoginIdSuccess(false);
    setPasswordSuccess(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-800">{t("auth:mypage.title")}</h1>
          </div>
          <LanguageSwitcher variant="compact" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-medium text-slate-500 mb-4">{t("auth:mypage.profile")}</h2>

          {/* Avatar and Name */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{currentUser.name}</h3>
              <p className="text-sm text-slate-500">{currentUser.nameKana}</p>
            </div>
          </div>

          {/* Staff Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">{t("auth:mypage.role")}</span>
              <span className="text-sm font-medium text-slate-800">
                {STAFF_ROLE_LABELS[currentUser.role]}
              </span>
            </div>
            {staff && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">{t("auth:mypage.shiftTime")}</span>
                <span className="text-sm font-medium text-slate-800">
                  {staff.shiftStart} - {staff.shiftEnd}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">{t("auth:login.loginId")}</span>
              <span className="text-sm font-medium text-slate-800">{currentUser.loginId}</span>
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <h2 className="text-sm font-medium text-slate-500 p-6 pb-3">
            {t("auth:mypage.accountSettings")}
          </h2>

          {/* Change Login ID */}
          <div className="border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "loginId" ? null : "loginId")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-800 font-medium">{t("auth:changeLoginId.title")}</span>
              <EditIcon size={18} className="text-slate-400" />
            </button>

            {activeSection === "loginId" && (
              <div className="px-6 pb-4 space-y-3">
                {loginIdSuccess ? (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckIcon size={18} />
                    {t("auth:changeLoginId.success")}
                  </div>
                ) : (
                  <>
                    {loginIdError && (
                      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {loginIdError}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t("auth:changeLoginId.currentLoginId")}
                      </label>
                      <input
                        type="text"
                        value={currentUser.loginId}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t("auth:changeLoginId.newLoginId")}
                      </label>
                      <input
                        type="text"
                        value={newLoginId}
                        onChange={(e) => setNewLoginId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none"
                        placeholder="new_login_id"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={resetForms}
                        className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <CloseIcon size={16} className="inline mr-1" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleLoginIdChange}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                      >
                        {t("auth:changeLoginId.confirm")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Change Password */}
          <div>
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "password" ? null : "password")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-800 font-medium">{t("auth:changePassword.title")}</span>
              <EditIcon size={18} className="text-slate-400" />
            </button>

            {activeSection === "password" && (
              <div className="px-6 pb-4 space-y-3">
                {passwordSuccess ? (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckIcon size={18} />
                    {t("auth:changePassword.success")}
                  </div>
                ) : (
                  <>
                    {passwordError && (
                      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {passwordError}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t("auth:changePassword.currentPassword")}
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t("auth:changePassword.newPassword")}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t("auth:changePassword.confirmPassword")}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={resetForms}
                        className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <CloseIcon size={16} className="inline mr-1" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                      >
                        {t("auth:changePassword.confirm")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-4 bg-white border border-red-200 text-red-600 font-medium rounded-2xl hover:bg-red-50 transition-colors"
        >
          {t("auth:logout.button")}
        </button>
      </div>
    </div>
  );
};

export default MyPage;
