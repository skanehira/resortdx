import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supportedLanguages, type SupportedLanguage } from "../../i18n";
import { UserIcon, GlobeIcon, ChevronDownIcon } from "./Icons";

interface UserMenuProps {
  variant?: "admin" | "staff";
  className?: string;
}

export const UserMenu = ({ variant = "staff", className = "" }: UserMenuProps) => {
  const { t: tAuth } = useTranslation("auth");
  const { i18n } = useTranslation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language as SupportedLanguage;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const displayName = currentUser?.name || (variant === "admin" ? "管理者" : "ゲスト");
  const avatarColor =
    currentUser?.avatarColor || (variant === "admin" ? "var(--ai)" : "var(--nezumi)");
  const avatarInitial =
    isAuthenticated && currentUser ? currentUser.name.charAt(0) : variant === "admin" ? "管" : "G";

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: avatarColor }}
        >
          {avatarInitial}
        </div>
        <span className="text-sm text-[var(--sumi)] hidden sm:block max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDownIcon
          size={16}
          className={`text-[var(--nezumi)] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          {isAuthenticated && currentUser && (
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: avatarColor }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--sumi)] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-[var(--nezumi)]">{currentUser.loginId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Language Switcher */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-xs text-[var(--nezumi)] mb-2">
              <GlobeIcon size={14} />
              <span>Language / 言語</span>
            </div>
            <div className="flex gap-1">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    currentLang === lang.code
                      ? "bg-[var(--ai)] text-white"
                      : "bg-gray-100 text-[var(--sumi)] hover:bg-gray-200"
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            {isAuthenticated && variant === "staff" && (
              <button
                type="button"
                onClick={() => {
                  navigate("/staff/mypage");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[var(--sumi)] hover:bg-gray-50 flex items-center gap-2"
              >
                <UserIcon size={16} />
                {tAuth("mypage.title")}
              </button>
            )}
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-[var(--shu)] hover:bg-red-50 flex items-center gap-2"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {tAuth("logout.button")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
