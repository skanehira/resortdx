import { useState, useEffect } from "react";
import type { MealTask, MealType } from "../../types";
import {
	MEAL_TYPE_LABELS,
	COURSE_TYPE_LABELS,
	DIETARY_RESTRICTION_LABELS,
} from "../../types";
import { getMealTaskById } from "../../data/mock";
import { DiningIcon, ClockIcon, CheckIcon, AllergyIcon } from "../ui/Icons";

// 食事タイプ別アイコン
const MealTypeIcon = ({ mealType }: { mealType: MealType }) => {
	const iconClass = "w-16 h-16";

	switch (mealType) {
		case "breakfast":
			return (
				<div className={`${iconClass} text-[var(--kincha)]`}>
					<svg viewBox="0 0 64 64" fill="currentColor">
						{/* 朝日アイコン */}
						<circle cx="32" cy="36" r="12" />
						<rect x="30" y="12" width="4" height="10" />
						<rect
							x="30"
							y="12"
							width="4"
							height="10"
							transform="rotate(45 32 36)"
						/>
						<rect
							x="30"
							y="12"
							width="4"
							height="10"
							transform="rotate(90 32 36)"
						/>
						<rect
							x="30"
							y="12"
							width="4"
							height="10"
							transform="rotate(135 32 36)"
						/>
						<rect x="10" y="48" width="44" height="4" rx="2" />
					</svg>
				</div>
			);
		case "dinner":
			return (
				<div className={`${iconClass} text-[var(--ai)]`}>
					<DiningIcon className="w-full h-full" />
				</div>
			);
		case "room_service":
			return (
				<div className={`${iconClass} text-[var(--aotake)]`}>
					<svg viewBox="0 0 64 64" fill="currentColor">
						{/* ルームサービスアイコン */}
						<ellipse cx="32" cy="48" rx="24" ry="6" />
						<path
							d="M8 48 C8 28 56 28 56 48"
							fill="none"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<circle cx="32" cy="24" r="4" />
						<rect x="30" y="28" width="4" height="12" />
					</svg>
				</div>
			);
		default:
			return (
				<div className={`${iconClass} text-[var(--kincha)]`}>
					<DiningIcon className="w-full h-full" />
				</div>
			);
	}
};

// 詳細情報カード
const DetailCard = ({
	icon,
	label,
	value,
	subValue,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	subValue?: string;
}) => (
	<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
		<div className="flex items-start gap-3">
			<div className="text-[var(--ai)] mt-0.5">{icon}</div>
			<div className="flex-1 min-w-0">
				<div className="text-xs text-gray-500 mb-1">{label}</div>
				<div className="font-bold text-gray-900">{value}</div>
				{subValue && (
					<div className="text-sm text-gray-600 mt-0.5">{subValue}</div>
				)}
			</div>
		</div>
	</div>
);

// 時刻選択モーダル
const TimeChangeModal = ({
	isOpen,
	currentTime,
	onClose,
	onSubmit,
}: {
	isOpen: boolean;
	currentTime: string;
	onClose: () => void;
	onSubmit: (newTime: string) => void;
}) => {
	const [selectedTime, setSelectedTime] = useState(currentTime);

	// 利用可能な時間帯を生成（17:30〜20:00、30分刻み）
	const availableTimes = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center">
			{/* 背景オーバーレイ */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* モーダル本体 */}
			<div className="relative bg-white rounded-t-3xl w-full max-w-lg p-6 pb-safe animate-slide-up">
				<div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

				<h3 className="text-xl font-bold text-gray-900 text-center mb-2">
					時刻変更のリクエスト
				</h3>
				<p className="text-sm text-gray-600 text-center mb-6">
					ご希望の時刻をお選びください
				</p>

				{/* 時刻選択グリッド */}
				<div className="grid grid-cols-3 gap-3 mb-6">
					{availableTimes.map((time) => (
						<button
							key={time}
							onClick={() => setSelectedTime(time)}
							className={`py-4 px-3 rounded-xl font-bold text-lg transition-all ${
								selectedTime === time
									? "bg-[var(--ai)] text-white shadow-lg"
									: time === currentTime
										? "bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300"
										: "bg-gray-50 text-gray-700 hover:bg-gray-100"
							}`}
						>
							{time}
							{time === currentTime && (
								<div className="text-xs font-normal mt-1">現在</div>
							)}
						</button>
					))}
				</div>

				{/* 注意事項 */}
				<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
					<p className="text-sm text-amber-700">
						※
						時刻変更はスタッフの確認後に確定します。ご希望に添えない場合もございます。
					</p>
				</div>

				{/* ボタン */}
				<div className="flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 py-4 px-6 rounded-xl font-bold text-gray-600 bg-gray-100"
					>
						キャンセル
					</button>
					<button
						onClick={() => onSubmit(selectedTime)}
						disabled={selectedTime === currentTime}
						className={`flex-1 py-4 px-6 rounded-xl font-bold text-white transition-all ${
							selectedTime === currentTime
								? "bg-gray-300 cursor-not-allowed"
								: "bg-[var(--ai)] shadow-lg active:scale-95"
						}`}
					>
						リクエスト送信
					</button>
				</div>
			</div>
		</div>
	);
};

// リクエスト送信完了メッセージ
const RequestConfirmation = ({ requestedTime }: { requestedTime: string }) => (
	<div className="bg-[var(--aotake)]/10 border-2 border-[var(--aotake)] rounded-2xl p-6 text-center">
		<div className="flex items-center justify-center gap-3 mb-2">
			<CheckIcon className="w-8 h-8 text-[var(--aotake)]" />
			<span className="text-xl font-bold text-[var(--aotake)]">
				リクエストを受け付けました
			</span>
		</div>
		<p className="text-sm text-gray-600">
			{requestedTime}へのお時間変更をリクエストしました。
			<br />
			確定後にスタッフよりご連絡いたします。
		</p>
	</div>
);

// メインコンポーネント
interface GuestMealStatusProps {
	taskId?: string; // URLパラメータから取得
}

export const GuestMealStatus = ({ taskId }: GuestMealStatusProps) => {
	const [task, setTask] = useState<MealTask | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showTimeModal, setShowTimeModal] = useState(false);
	const [requestedTime, setRequestedTime] = useState<string | null>(null);

	// タスクデータの取得（実際はAPIから取得）
	useEffect(() => {
		const loadTask = () => {
			setIsLoading(true);
			// モックデータから取得（実際はAPI呼び出し）
			const mealTask = taskId
				? getMealTaskById(taskId)
				: getMealTaskById("MEAL001"); // デモ用デフォルト

			if (mealTask) {
				setTask(mealTask);
			}
			setIsLoading(false);
		};

		loadTask();

		// 定期更新（実際はWebSocketなど）
		const interval = setInterval(loadTask, 30000);
		return () => clearInterval(interval);
	}, [taskId]);

	// 時刻変更リクエストを送信
	const handleTimeChangeRequest = (newTime: string) => {
		// 実際はAPIを呼び出してスタッフに通知
		setRequestedTime(newTime);
		setShowTimeModal(false);
	};

	// ローディング表示
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-[var(--ai)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600">読み込み中...</p>
				</div>
			</div>
		);
	}

	// タスクが見つからない場合
	if (!task) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
				<div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<DiningIcon className="w-8 h-8 text-gray-400" />
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">
						お食事情報が見つかりません
					</h2>
					<p className="text-gray-600">
						URLをご確認いただくか、
						<br />
						旅館スタッフにお問い合わせください。
					</p>
				</div>
			</div>
		);
	}

	// 完了状態
	const isCompleted = task.mealStatus === "completed";

	// 背景グラデーション
	const getBackground = () => {
		if (isCompleted) return "from-green-50 to-emerald-100";
		if (task.mealType === "breakfast") return "from-amber-50 to-yellow-100";
		if (task.mealType === "dinner") return "from-indigo-50 to-blue-100";
		return "from-gray-50 to-gray-100";
	};

	return (
		<div className={`min-h-screen bg-gradient-to-b ${getBackground()} pb-safe`}>
			{/* ヘッダー */}
			<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-lg mx-auto px-4 py-4">
					<div className="text-center">
						<div className="text-xs text-gray-500 mb-1">お食事のご案内</div>
						<h1 className="text-lg font-bold text-gray-900">○○旅館</h1>
					</div>
				</div>
			</header>

			<main className="max-w-lg mx-auto px-4 py-6 space-y-6">
				{/* メイン表示 */}
				<div className="bg-white rounded-2xl p-8 shadow-lg text-center">
					<div className="mb-4 flex justify-center">
						<MealTypeIcon mealType={task.mealType} />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{MEAL_TYPE_LABELS[task.mealType]}
					</h2>
					<p className="text-lg text-gray-600">
						{COURSE_TYPE_LABELS[task.courseType]}コース
					</p>
					{task.isAnniversaryRelated && (
						<div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[var(--kincha)]/10 text-[var(--kincha)] rounded-full">
							<span className="text-lg">🎉</span>
							<span className="font-medium">記念日メニュー</span>
						</div>
					)}
				</div>

				{/* 詳細情報 */}
				{!isCompleted && (
					<div className="space-y-3">
						<DetailCard
							icon={<ClockIcon className="w-5 h-5" />}
							label="お食事開始時刻"
							value={task.scheduledTime}
							subValue={`${task.roomNumber}号室へご準備いたします`}
						/>

						<DetailCard
							icon={<DiningIcon className="w-5 h-5" />}
							label="ご予約内容"
							value={`${task.guestName}様`}
							subValue={`${task.guestCount}名様`}
						/>
					</div>
				)}

				{/* アレルギー・食事制限 */}
				{task.dietaryRestrictions.length > 0 && !isCompleted && (
					<div className="bg-white rounded-2xl p-5 shadow-lg">
						<div className="flex items-center gap-2 text-[var(--shu)] mb-3">
							<AllergyIcon className="w-5 h-5" />
							<span className="font-bold">食事制限・アレルギー対応</span>
						</div>
						<div className="flex flex-wrap gap-2 mb-2">
							{task.dietaryRestrictions.map((restriction) => (
								<span
									key={restriction}
									className="px-3 py-1.5 bg-[var(--shu)]/10 text-[var(--shu)] rounded-full text-sm font-medium"
								>
									{DIETARY_RESTRICTION_LABELS[restriction]}
								</span>
							))}
						</div>
						{task.dietaryNotes && (
							<p className="text-sm text-gray-600 mt-2">{task.dietaryNotes}</p>
						)}
						<p className="text-xs text-gray-500 mt-3">
							上記の食材を除いたお料理をご用意いたします
						</p>
					</div>
				)}

				{/* 時刻変更リクエスト */}
				{!isCompleted && !requestedTime && (
					<div className="pt-4">
						<button
							onClick={() => setShowTimeModal(true)}
							className="w-full py-5 px-6 rounded-2xl font-bold text-lg bg-white border-2 border-[var(--ai)] text-[var(--ai)] shadow-sm hover:bg-[var(--ai)]/5 active:scale-[0.98] transition-all"
						>
							<div className="flex items-center justify-center gap-3">
								<ClockIcon className="w-6 h-6" />
								<span>時刻変更をリクエスト</span>
							</div>
							<div className="text-sm font-normal text-gray-500 mt-1">
								変更可能時間: 17:30〜20:00
							</div>
						</button>
					</div>
				)}

				{/* リクエスト送信完了 */}
				{requestedTime && !isCompleted && (
					<RequestConfirmation requestedTime={requestedTime} />
				)}

				{/* 完了メッセージ */}
				{isCompleted && (
					<div className="bg-white rounded-2xl p-6 shadow-lg text-center">
						<div className="w-16 h-16 bg-[var(--aotake)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<CheckIcon className="w-8 h-8 text-[var(--aotake)]" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">
							お食事のご準備が整いました
						</h3>
						<p className="text-gray-600">
							ごゆっくりお召し上がりください。
							<br />
							ご不明な点がございましたら
							<br />
							スタッフまでお声がけください。
						</p>
					</div>
				)}

				{/* 注意事項 */}
				{!isCompleted && (
					<div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
						<h4 className="font-bold text-amber-800 mb-2 text-sm">ご案内</h4>
						<ul className="text-sm text-amber-700 space-y-1">
							<li>・ お食事のお時間になりましたらスタッフがご案内いたします</li>
							<li>
								・ アレルギーや食事制限の変更はスタッフまでお申し付けください
							</li>
							<li>・ 追加のご注文は客室内のQRコードからどうぞ</li>
						</ul>
					</div>
				)}
			</main>

			{/* フッター */}
			<footer className="max-w-lg mx-auto px-4 py-6 text-center">
				<p className="text-xs text-gray-500">お問い合わせ: 0599-XX-XXXX</p>
			</footer>

			{/* 時刻変更モーダル */}
			<TimeChangeModal
				isOpen={showTimeModal}
				currentTime={task.scheduledTime}
				onClose={() => setShowTimeModal(false)}
				onSubmit={handleTimeChangeRequest}
			/>
		</div>
	);
};

export default GuestMealStatus;
