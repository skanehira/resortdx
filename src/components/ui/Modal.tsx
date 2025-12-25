import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  footer?: React.ReactNode;
  fullscreen?: boolean;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  leftAction?: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
  fullscreen = false,
  showCloseButton = true,
  closeOnOverlayClick = true,
  leftAction,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const modalClasses = fullscreen
    ? "relative w-full h-full m-0 rounded-none bg-white shadow-xl animate-slide-up flex flex-col"
    : `relative w-full ${sizeClasses[size]} mx-4 bg-white rounded-lg shadow-xl animate-slide-up max-h-[calc(100dvh-6rem)] flex flex-col`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pb-20">
      {/* Overlay */}
      <div
        data-testid="modal-overlay"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div ref={modalRef} role="dialog" className={modalClasses}>
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[rgba(45,41,38,0.08)]">
          <div className="flex items-center gap-2">
            {leftAction}
            <h2 className="text-lg font-display font-semibold text-[var(--sumi)]">{title}</h2>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="閉じる"
              className="p-1 text-[var(--nezumi)] hover:text-[var(--sumi)] transition-colors"
            >
              <CloseIcon size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div data-testid="modal-content" className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            data-testid="modal-footer"
            className="flex-shrink-0 border-t border-[rgba(45,41,38,0.08)] p-4"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
