import { useTranslation } from "react-i18next";
import { supportedLanguages, type SupportedLanguage } from "../../i18n";
import { GlobeIcon } from "./Icons";

interface LanguageSwitcherProps {
  variant?: "dropdown" | "toggle" | "compact";
  className?: string;
}

export const LanguageSwitcher = ({ variant = "toggle", className = "" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as SupportedLanguage;

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => handleLanguageChange(currentLang === "ja" ? "en" : "ja")}
        className={`flex items-center gap-1 px-2 py-1 text-sm rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        title={currentLang === "ja" ? "Switch to English" : "日本語に切替"}
      >
        <GlobeIcon className="w-4 h-4" />
        <span className="font-medium">{currentLang === "ja" ? "EN" : "JP"}</span>
      </button>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <select
          value={currentLang}
          onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
        <GlobeIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    );
  }

  // Default: toggle variant
  return (
    <div className={`flex items-center gap-1 bg-gray-100 rounded-lg p-1 ${className}`}>
      {supportedLanguages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            currentLang === lang.code
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {lang.nativeName}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
