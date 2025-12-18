// Custom SVG Icons for the task management system
// Using a traditional Japanese aesthetic with clean, minimal strokes

interface IconProps {
	size?: number;
	className?: string;
}

export const DashboardIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<rect x="3" y="3" width="7" height="7" rx="1" />
		<rect x="14" y="3" width="7" height="7" rx="1" />
		<rect x="3" y="14" width="7" height="7" rx="1" />
		<rect x="14" y="14" width="7" height="7" rx="1" />
	</svg>
);

export const ReservationIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M8 2v4" />
		<path d="M16 2v4" />
		<rect x="3" y="4" width="18" height="18" rx="2" />
		<path d="M3 10h18" />
		<path d="M8 14h.01" />
		<path d="M12 14h.01" />
		<path d="M16 14h.01" />
		<path d="M8 18h.01" />
		<path d="M12 18h.01" />
	</svg>
);

export const TemplateIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<rect x="3" y="3" width="18" height="18" rx="2" />
		<path d="M3 9h18" />
		<path d="M9 21V9" />
	</svg>
);

export const StaffIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<circle cx="12" cy="8" r="4" />
		<path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
	</svg>
);

export const TimelineIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 6v6l4 2" />
	</svg>
);

export const TaskIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M9 11l3 3L22 4" />
		<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
	</svg>
);

export const RoomIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M3 21h18" />
		<path d="M5 21V7l8-4v18" />
		<path d="M19 21V11l-6-4" />
		<path d="M9 9v.01" />
		<path d="M9 12v.01" />
		<path d="M9 15v.01" />
		<path d="M9 18v.01" />
	</svg>
);

export const GuestIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" />
	</svg>
);

export const CelebrationIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

export const CleaningIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M12 2v4" />
		<path d="M12 18v4" />
		<path d="M4.93 4.93l2.83 2.83" />
		<path d="M16.24 16.24l2.83 2.83" />
		<path d="M2 12h4" />
		<path d="M18 12h4" />
		<path d="M4.93 19.07l2.83-2.83" />
		<path d="M16.24 7.76l2.83-2.83" />
	</svg>
);

export const MealIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
		<path d="M7 2v20" />
		<path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
	</svg>
);

export const CarIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
		<circle cx="7" cy="17" r="2" />
		<path d="M9 17h6" />
		<circle cx="17" cy="17" r="2" />
	</svg>
);

export const BathIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M9 6c0-1.7 1.3-3 3-3s3 1.3 3 3" />
		<path d="M5 12h14" />
		<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
		<path d="M7 4v2" />
		<path d="M17 4v2" />
		<circle cx="7" cy="16" r="1" />
		<circle cx="17" cy="16" r="1" />
	</svg>
);

export const CheckIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M20 6L9 17l-5-5" />
	</svg>
);

export const ChevronRightIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M9 18l6-6-6-6" />
	</svg>
);

export const ChevronDownIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M6 9l6 6 6-6" />
	</svg>
);

export const MenuIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M3 12h18" />
		<path d="M3 6h18" />
		<path d="M3 18h18" />
	</svg>
);

export const CloseIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M18 6L6 18" />
		<path d="M6 6l12 12" />
	</svg>
);

export const AlertIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
		<line x1="12" y1="9" x2="12" y2="13" />
		<line x1="12" y1="17" x2="12.01" y2="17" />
	</svg>
);

export const PlusIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M12 5v14" />
		<path d="M5 12h14" />
	</svg>
);

export const EditIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
		<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
	</svg>
);

export const RefreshIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M21 2v6h-6" />
		<path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
		<path d="M3 22v-6h6" />
		<path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
	</svg>
);

export const PhoneIcon = ({ size = 20, className = "" }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
		<path d="M12 18h.01" />
	</svg>
);
