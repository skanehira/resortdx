import { useState } from "react";
import { mockTaskTemplates } from "../../data/mock";
import {
	TASK_CATEGORY_LABELS,
	ROOM_TYPE_LABELS,
	type TaskTemplate,
	type TaskCategory,
	type RoomType,
} from "../../types";
import {
	TemplateIcon,
	PlusIcon,
	EditIcon,
	CleaningIcon,
	MealIcon,
	BathIcon,
	CarIcon,
	CelebrationIcon,
	TimelineIcon,
	InspectionIcon,
} from "../ui/Icons";

// Category Icon Mapping
const CategoryIcon = ({ category }: { category: TaskCategory }) => {
	const icons: Record<TaskCategory, React.ReactNode> = {
		cleaning: <CleaningIcon size={16} />,
		meal_service: <MealIcon size={16} />,
		bath: <BathIcon size={16} />,
		pickup: <CarIcon size={16} />,
		celebration: <CelebrationIcon size={16} />,
		turndown: <TimelineIcon size={16} />,
		inspection: <InspectionIcon size={16} />,
		other: <TemplateIcon size={16} />,
	};
	return <>{icons[category]}</>;
};

// Format offset minutes to readable time
const formatOffset = (minutes: number): string => {
	const absMinutes = Math.abs(minutes);
	const hours = Math.floor(absMinutes / 60);
	const mins = absMinutes % 60;
	const sign = minutes < 0 ? "-" : "+";

	if (hours === 0) {
		return `${sign}${mins}分`;
	}
	if (mins === 0) {
		return `${sign}${hours}時間`;
	}
	return `${sign}${hours}時間${mins}分`;
};

// Reference label mapping
const referenceLabels: Record<string, string> = {
	check_in: "チェックイン",
	check_out: "チェックアウト",
	previous_task: "前タスク完了後",
};

// Trigger condition labels
const triggerLabels: Record<string, string> = {
	check_in: "チェックイン時",
	check_out: "チェックアウト時",
	anniversary: "記念日あり",
	guest_count: "人数条件",
	room_type: "部屋タイプ条件",
};

// Template Card Component
interface TemplateCardProps {
	template: TaskTemplate;
	onEdit: () => void;
}

const TemplateCard = ({ template, onEdit }: TemplateCardProps) => {
	const categoryColors: Record<TaskCategory, string> = {
		cleaning: "border-l-[var(--aotake)]",
		meal_service: "border-l-[var(--kincha)]",
		bath: "border-l-[var(--ai)]",
		pickup: "border-l-[var(--sumi-light)]",
		celebration: "border-l-[var(--kincha)]",
		turndown: "border-l-[var(--ai-light)]",
		inspection: "border-l-[var(--kincha)]",
		other: "border-l-[var(--nezumi)]",
	};

	return (
		<div
			className={`shoji-panel p-5 border-l-3 ${categoryColors[template.category]} card-hover animate-slide-up`}
		>
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-2">
					<div className="p-2 bg-[var(--shironeri-warm)] rounded">
						<CategoryIcon category={template.category} />
					</div>
					<div>
						<h3 className="font-display font-medium text-[var(--sumi)]">
							{template.name}
						</h3>
						<span className="text-xs text-[var(--nezumi)]">
							{TASK_CATEGORY_LABELS[template.category]}
						</span>
					</div>
				</div>
				<button
					onClick={onEdit}
					className="btn btn-ghost p-2"
					aria-label="編集"
				>
					<EditIcon size={16} />
				</button>
			</div>

			<p className="text-sm text-[var(--sumi-light)] mb-4">
				{template.description}
			</p>

			{/* Details */}
			<div className="space-y-3 text-sm">
				{/* Duration */}
				<div className="flex items-center justify-between py-2 border-t border-[rgba(45,41,38,0.06)]">
					<span className="text-[var(--nezumi)]">標準所要時間</span>
					<span className="font-medium">{template.defaultDuration}分</span>
				</div>

				{/* Applicable Room Types */}
				<div className="flex items-start justify-between py-2 border-t border-[rgba(45,41,38,0.06)]">
					<span className="text-[var(--nezumi)]">対象部屋</span>
					<div className="flex flex-wrap gap-1 justify-end">
						{template.applicableRoomTypes.map((type) => (
							<span
								key={type}
								className="text-xs px-2 py-0.5 bg-[var(--shironeri-warm)] rounded"
							>
								{ROOM_TYPE_LABELS[type]}
							</span>
						))}
					</div>
				</div>

				{/* Trigger Conditions */}
				<div className="flex items-start justify-between py-2 border-t border-[rgba(45,41,38,0.06)]">
					<span className="text-[var(--nezumi)]">トリガー</span>
					<div className="flex flex-wrap gap-1 justify-end">
						{template.triggerConditions.map((trigger, idx) => (
							<span
								key={idx}
								className="text-xs px-2 py-0.5 bg-[rgba(27,73,101,0.08)] text-[var(--ai)] rounded"
							>
								{triggerLabels[trigger.type]}
								{trigger.value && `: ${trigger.value}`}
							</span>
						))}
					</div>
				</div>

				{/* Timing */}
				<div className="flex items-center justify-between py-2 border-t border-[rgba(45,41,38,0.06)]">
					<span className="text-[var(--nezumi)]">実行タイミング</span>
					<span className="font-medium">
						{referenceLabels[template.relativeTime.reference]}{" "}
						{formatOffset(template.relativeTime.offsetMinutes)}
					</span>
				</div>
			</div>
		</div>
	);
};

// Category Filter Component
interface CategoryFilterProps {
	selected: TaskCategory | "all";
	onChange: (category: TaskCategory | "all") => void;
}

const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
	const categories: (TaskCategory | "all")[] = [
		"all",
		"cleaning",
		"meal_service",
		"bath",
		"pickup",
		"celebration",
		"turndown",
	];

	return (
		<div className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<button
					key={category}
					onClick={() => onChange(category)}
					className={`px-4 py-2 text-sm font-display rounded transition-all ${
						selected === category
							? "bg-[var(--ai)] text-white"
							: "bg-[var(--shironeri-warm)] text-[var(--sumi-light)] hover:bg-[rgba(45,41,38,0.08)]"
					}`}
				>
					{category === "all" ? "すべて" : TASK_CATEGORY_LABELS[category]}
				</button>
			))}
		</div>
	);
};

// Template Form Modal Component
interface TemplateFormProps {
	template?: TaskTemplate;
	onClose: () => void;
	onSave: (template: TaskTemplate) => void;
}

const TemplateForm = ({ template, onClose, onSave }: TemplateFormProps) => {
	const isEdit = !!template;
	const [formData, setFormData] = useState<Partial<TaskTemplate>>(
		template || {
			name: "",
			category: "cleaning",
			description: "",
			defaultDuration: 30,
			applicableRoomTypes: ["standard", "deluxe", "suite", "premium_suite"],
			triggerConditions: [{ type: "check_in" }],
			relativeTime: { reference: "check_in", offsetMinutes: -120 },
		},
	);

	const roomTypes: RoomType[] = [
		"standard",
		"deluxe",
		"suite",
		"premium_suite",
	];

	const handleRoomTypeToggle = (type: RoomType) => {
		const current = formData.applicableRoomTypes || [];
		const updated = current.includes(type)
			? current.filter((t) => t !== type)
			: [...current, type];
		setFormData({ ...formData, applicableRoomTypes: updated });
	};

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="shoji-panel w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
				<div className="p-5 border-b border-[rgba(45,41,38,0.08)]">
					<h2 className="text-lg font-display font-medium text-[var(--sumi)]">
						{isEdit ? "テンプレート編集" : "新規テンプレート作成"}
					</h2>
				</div>

				<div className="p-5 space-y-5">
					{/* Name */}
					<div>
						<label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
							テンプレート名
						</label>
						<input
							type="text"
							className="input"
							value={formData.name || ""}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="例: 客室清掃（スタンダード）"
						/>
					</div>

					{/* Category */}
					<div>
						<label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
							カテゴリ
						</label>
						<select
							className="input select"
							value={formData.category}
							onChange={(e) =>
								setFormData({
									...formData,
									category: e.target.value as TaskCategory,
								})
							}
						>
							{Object.entries(TASK_CATEGORY_LABELS).map(([key, label]) => (
								<option key={key} value={key}>
									{label}
								</option>
							))}
						</select>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
							説明
						</label>
						<textarea
							className="input min-h-[80px] resize-none"
							value={formData.description || ""}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="タスクの詳細説明"
						/>
					</div>

					{/* Duration */}
					<div>
						<label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
							標準所要時間（分）
						</label>
						<input
							type="number"
							className="input w-32"
							value={formData.defaultDuration || 30}
							onChange={(e) =>
								setFormData({
									...formData,
									defaultDuration: parseInt(e.target.value) || 30,
								})
							}
							min="5"
							step="5"
						/>
					</div>

					{/* Applicable Room Types */}
					<div>
						<label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
							対象部屋タイプ
						</label>
						<div className="flex flex-wrap gap-2">
							{roomTypes.map((type) => (
								<button
									key={type}
									type="button"
									onClick={() => handleRoomTypeToggle(type)}
									className={`px-3 py-1.5 text-sm rounded transition-all ${
										formData.applicableRoomTypes?.includes(type)
											? "bg-[var(--ai)] text-white"
											: "bg-[var(--shironeri-warm)] text-[var(--sumi-light)]"
									}`}
								>
									{ROOM_TYPE_LABELS[type]}
								</button>
							))}
						</div>
					</div>

					{/* Timing Reference */}
					<div>
						<label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
							基準タイミング
						</label>
						<select
							className="input select"
							value={formData.relativeTime?.reference}
							onChange={(e) =>
								setFormData({
									...formData,
									relativeTime: {
										...formData.relativeTime!,
										reference: e.target.value as "check_in" | "check_out",
									},
								})
							}
						>
							<option value="check_in">チェックイン</option>
							<option value="check_out">チェックアウト</option>
						</select>
					</div>

					{/* Offset Minutes */}
					<div>
						<label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
							オフセット（分） - 負の値は事前、正の値は事後
						</label>
						<input
							type="number"
							className="input w-40"
							value={formData.relativeTime?.offsetMinutes || 0}
							onChange={(e) =>
								setFormData({
									...formData,
									relativeTime: {
										...formData.relativeTime!,
										offsetMinutes: parseInt(e.target.value) || 0,
									},
								})
							}
							step="30"
						/>
						<p className="text-xs text-[var(--nezumi)] mt-1">
							例: -120 = 2時間前、180 = 3時間後
						</p>
					</div>
				</div>

				<div className="p-5 border-t border-[rgba(45,41,38,0.08)] flex justify-end gap-3">
					<button onClick={onClose} className="btn btn-secondary">
						キャンセル
					</button>
					<button
						onClick={() =>
							onSave({
								id: template?.id || `TPL${Date.now()}`,
								...formData,
							} as TaskTemplate)
						}
						className="btn btn-primary"
					>
						{isEdit ? "更新" : "作成"}
					</button>
				</div>
			</div>
		</div>
	);
};

// Main Task Templates Component
export const TaskTemplates = () => {
	const [templates, setTemplates] = useState<TaskTemplate[]>(mockTaskTemplates);
	const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">(
		"all",
	);
	const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(
		null,
	);
	const [showCreateForm, setShowCreateForm] = useState(false);

	const filteredTemplates =
		categoryFilter === "all"
			? templates
			: templates.filter((t) => t.category === categoryFilter);

	const handleSave = (template: TaskTemplate) => {
		if (editingTemplate) {
			// Update existing template
			setTemplates((prev) =>
				prev.map((t) => (t.id === template.id ? template : t)),
			);
		} else {
			// Add new template
			setTemplates((prev) => [...prev, template]);
		}
		setEditingTemplate(null);
		setShowCreateForm(false);
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
						タスクテンプレート
					</h1>
					<p className="text-sm text-[var(--nezumi)] mt-2">
						予約登録時に自動生成されるタスクのテンプレートを管理します
					</p>
				</div>
				<button
					onClick={() => setShowCreateForm(true)}
					className="btn btn-primary"
				>
					<PlusIcon size={18} />
					新規作成
				</button>
			</div>

			{/* Category Filter */}
			<div className="shoji-panel p-4">
				<CategoryFilter
					selected={categoryFilter}
					onChange={setCategoryFilter}
				/>
			</div>

			{/* Templates Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{filteredTemplates.map((template, index) => (
					<div key={template.id} className={`stagger-${(index % 5) + 1}`}>
						<TemplateCard
							template={template}
							onEdit={() => setEditingTemplate(template)}
						/>
					</div>
				))}
			</div>

			{filteredTemplates.length === 0 && (
				<div className="shoji-panel p-12 text-center">
					<TemplateIcon
						size={48}
						className="mx-auto text-[var(--nezumi-light)] mb-4"
					/>
					<p className="text-[var(--nezumi)]">
						該当するテンプレートがありません
					</p>
				</div>
			)}

			{/* Summary Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="shoji-panel p-4 text-center">
					<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
						{templates.length}
					</p>
					<p className="text-xs text-[var(--nezumi)]">総テンプレート数</p>
				</div>
				<div className="shoji-panel p-4 text-center">
					<p className="text-2xl font-display font-semibold text-[var(--aotake)]">
						{templates.filter((t) => t.category === "cleaning").length}
					</p>
					<p className="text-xs text-[var(--nezumi)]">清掃タスク</p>
				</div>
				<div className="shoji-panel p-4 text-center">
					<p className="text-2xl font-display font-semibold text-[var(--kincha)]">
						{templates.filter((t) => t.category === "meal_service").length}
					</p>
					<p className="text-xs text-[var(--nezumi)]">配膳タスク</p>
				</div>
				<div className="shoji-panel p-4 text-center">
					<p className="text-2xl font-display font-semibold text-[var(--ai)]">
						{templates.filter((t) => t.category === "celebration").length}
					</p>
					<p className="text-xs text-[var(--nezumi)]">記念日タスク</p>
				</div>
			</div>

			{/* Edit Modal */}
			{editingTemplate && (
				<TemplateForm
					template={editingTemplate}
					onClose={() => setEditingTemplate(null)}
					onSave={handleSave}
				/>
			)}

			{/* Create Modal */}
			{showCreateForm && (
				<TemplateForm
					onClose={() => setShowCreateForm(false)}
					onSave={handleSave}
				/>
			)}
		</div>
	);
};
