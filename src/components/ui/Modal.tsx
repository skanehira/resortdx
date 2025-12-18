import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg";
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	size = "md",
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
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				ref={modalRef}
				className={`relative w-full ${sizeClasses[size]} mx-4 bg-white rounded-lg shadow-xl animate-slide-up`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-[rgba(45,41,38,0.08)]">
					<h2 className="text-lg font-display font-semibold text-[var(--sumi)]">
						{title}
					</h2>
					<button
						onClick={onClose}
						className="p-1 text-[var(--nezumi)] hover:text-[var(--sumi)] transition-colors"
					>
						<CloseIcon size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
};
