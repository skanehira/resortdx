import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "../ui/Icons";

const STORAGE_KEY = "resortdx_swipe_hint_dismissed";

export const SwipeHint = () => {
  const { t } = useTranslation("staff");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="shoji-panel p-4 mb-4 animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Swipe animation */}
        <div className="flex-shrink-0 w-16 h-12 bg-[var(--shironeri-warm)] rounded-lg relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center">
            <div className="w-8 h-8 bg-[var(--ai)]/20 rounded-lg animate-swipe-hint" />
          </div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--aotake)] text-xs font-medium">
            →
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--sumi)]">{t("swipeHint.title")}</p>
          <p className="text-xs text-[var(--nezumi)] mt-0.5">{t("swipeHint.description")}</p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-[var(--nezumi)] hover:text-[var(--sumi)] transition-colors"
          aria-label={t("swipeHint.dismiss")}
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
};
