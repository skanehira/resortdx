import { useState, useEffect } from "react";
import type { ShuttleTask, ShuttleStatus } from "../../types";
import { SHUTTLE_STATUS_GUEST_LABELS } from "../../types";
import { getShuttleTaskById, getVehicleById } from "../../data/mockData";
import {
	ShuttleIcon,
	LocationIcon,
	ClockIcon,
	PassengerIcon,
	BellIcon,
	CheckIcon,
} from "../ui/Icons";

// ステータスアイコン
const StatusIcon = ({ status }: { status: ShuttleStatus }) => {
	const iconClass = "w-16 h-16";

	switch (status) {
		case "not_departed":
			return (
				<div className={`${iconClass} text-[var(--nezumi)]`}>
					<svg viewBox="0 0 64 64" fill="currentColor">
						<circle
							cx="32"
							cy="32"
							r="28"
							fill="none"
							stroke="currentColor"
							strokeWidth="4"
							strokeDasharray="8 4"
						/>
						<circle cx="32" cy="32" r="8" />
					</svg>
				</div>
			);
		case "heading":
			return (
				<div className={`${iconClass} text-[var(--ai)] animate-pulse`}>
					<ShuttleIcon className="w-full h-full" />
				</div>
			);
		case "arrived":
			return (
				<div className={`${iconClass} text-[var(--aotake)]`}>
					<LocationIcon className="w-full h-full" />
				</div>
			);
		case "boarded":
			return (
				<div className={`${iconClass} text-[var(--kincha)]`}>
					<PassengerIcon className="w-full h-full" />
				</div>
			);
		case "completed":
			return (
				<div className={`${iconClass} text-[var(--aotake)]`}>
					<CheckIcon className="w-full h-full" />
				</div>
			);
	}
};

// ステータスに応じた背景グラデーション
const getStatusBackground = (status: ShuttleStatus): string => {
	switch (status) {
		case "not_departed":
			return "from-gray-50 to-gray-100";
		case "heading":
			return "from-blue-50 to-indigo-100";
		case "arrived":
			return "from-green-50 to-teal-100";
		case "boarded":
			return "from-amber-50 to-yellow-100";
		case "completed":
			return "from-green-50 to-emerald-100";
	}
};

// 進捗インジケーター（ゲスト用シンプル版）
const GuestProgressIndicator = ({ status }: { status: ShuttleStatus }) => {
	const stages: ShuttleStatus[] = [
		"not_departed",
		"heading",
		"arrived",
		"boarded",
		"completed",
	];
	const currentIndex = stages.indexOf(status);

	const stageLabels = ["準備中", "向かい中", "到着", "乗車", "完了"];

	return (
		<div className="flex items-center justify-center gap-2 px-4">
			{stages.map((stage, index) => {
				const isCompleted = index < currentIndex;
				const isCurrent = index === currentIndex;

				return (
					<div key={stage} className="flex items-center">
						<div className="flex flex-col items-center">
							<div
								className={`
									w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
									transition-all duration-300
									${
										isCompleted
											? "bg-[var(--aotake)] text-white"
											: isCurrent
												? "bg-[var(--ai)] text-white ring-4 ring-[var(--ai)]/30"
												: "bg-gray-200 text-gray-400"
									}
								`}
							>
								{isCompleted ? <CheckIcon className="w-4 h-4" /> : index + 1}
							</div>
							<span
								className={`
									text-xs mt-1
									${isCurrent ? "text-[var(--ai)] font-bold" : "text-gray-500"}
								`}
							>
								{stageLabels[index]}
							</span>
						</div>
						{index < stages.length - 1 && (
							<div
								className={`
									w-6 h-0.5 mx-1 mb-5
									${isCompleted ? "bg-[var(--aotake)]" : "bg-gray-200"}
								`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
};

// 到着通知ボタン
const ArrivalNotificationButton = ({
	onNotify,
	isNotified,
	isDisabled,
}: {
	onNotify: () => void;
	isNotified: boolean;
	isDisabled: boolean;
}) => {
	if (isNotified) {
		return (
			<div className="bg-[var(--aotake)]/10 border-2 border-[var(--aotake)] rounded-2xl p-6 text-center">
				<div className="flex items-center justify-center gap-3 mb-2">
					<CheckIcon className="w-8 h-8 text-[var(--aotake)]" />
					<span className="text-xl font-bold text-[var(--aotake)]">
						到着をお知らせしました
					</span>
				</div>
				<p className="text-sm text-gray-600">
					ドライバーがお迎えに参ります。
					<br />
					今しばらくお待ちください。
				</p>
			</div>
		);
	}

	return (
		<button
			onClick={onNotify}
			disabled={isDisabled}
			className={`
				w-full py-6 px-8 rounded-2xl text-xl font-bold
				transition-all duration-200 active:scale-95
				flex items-center justify-center gap-4
				${
					isDisabled
						? "bg-gray-200 text-gray-400 cursor-not-allowed"
						: "bg-[var(--ai)] text-white shadow-lg hover:bg-[var(--ai)]/90 active:shadow-md"
				}
			`}
		>
			<BellIcon className="w-8 h-8" />
			<div className="text-left">
				<div>今、到着しました</div>
				<div className="text-sm font-normal opacity-80">
					タップしてドライバーにお知らせ
				</div>
			</div>
		</button>
	);
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

// メインコンポーネント
interface GuestShuttleStatusProps {
	taskId?: string; // URLパラメータから取得
}

export const GuestShuttleStatus = ({ taskId }: GuestShuttleStatusProps) => {
	const [task, setTask] = useState<ShuttleTask | null>(null);
	const [isNotified, setIsNotified] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// タスクデータの取得（実際はAPIから取得）
	useEffect(() => {
		const loadTask = () => {
			setIsLoading(true);
			// モックデータから取得（実際はAPI呼び出し）
			const shuttleTask = taskId
				? getShuttleTaskById(taskId)
				: getShuttleTaskById("SHT001"); // デモ用デフォルト

			if (shuttleTask) {
				setTask(shuttleTask);
				setIsNotified(shuttleTask.guestArrivalNotified);
			}
			setIsLoading(false);
		};

		loadTask();

		// 定期更新（実際はWebSocketなど）
		const interval = setInterval(loadTask, 10000);
		return () => clearInterval(interval);
	}, [taskId]);

	// 到着通知
	const handleNotify = () => {
		if (!task) return;

		// 実際はAPIを呼び出してドライバーに通知
		setIsNotified(true);
		setTask({
			...task,
			guestArrivalNotified: true,
			guestNotifiedAt: new Date().toISOString(),
		});
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
						<ShuttleIcon className="w-8 h-8 text-gray-400" />
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">
						送迎情報が見つかりません
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

	const vehicle = task.assignedVehicleId
		? getVehicleById(task.assignedVehicleId)
		: null;

	// 到着通知ボタンを表示する条件
	// heading（向かい中）またはarrived（到着済）の時のみ
	const canNotify =
		task.shuttleStatus === "heading" || task.shuttleStatus === "arrived";

	// 完了状態
	const isCompleted = task.shuttleStatus === "completed";

	return (
		<div
			className={`min-h-screen bg-gradient-to-b ${getStatusBackground(task.shuttleStatus)} pb-safe`}
		>
			{/* ヘッダー */}
			<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-lg mx-auto px-4 py-4">
					<div className="text-center">
						<div className="text-xs text-gray-500 mb-1">送迎サービス</div>
						<h1 className="text-lg font-bold text-gray-900">○○旅館</h1>
					</div>
				</div>
			</header>

			<main className="max-w-lg mx-auto px-4 py-6 space-y-6">
				{/* メインステータス表示 */}
				<div className="bg-white rounded-2xl p-8 shadow-lg text-center">
					<div className="mb-4">
						<StatusIcon status={task.shuttleStatus} />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{SHUTTLE_STATUS_GUEST_LABELS[task.shuttleStatus]}
					</h2>
					{task.shuttleStatus === "heading" && (
						<p className="text-gray-600">まもなく到着予定です</p>
					)}
					{task.shuttleStatus === "arrived" && !isNotified && (
						<p className="text-gray-600">下のボタンで到着をお知らせください</p>
					)}
					{isCompleted && (
						<p className="text-gray-600">ご利用ありがとうございました</p>
					)}
				</div>

				{/* 進捗インジケーター */}
				<div className="bg-white rounded-2xl p-4 shadow-lg">
					<GuestProgressIndicator status={task.shuttleStatus} />
				</div>

				{/* 詳細情報 */}
				{!isCompleted && (
					<div className="space-y-3">
						<DetailCard
							icon={<LocationIcon className="w-5 h-5" />}
							label={task.direction === "pickup" ? "お迎え場所" : "送り先"}
							value={task.pickupLocation}
							subValue="改札出口付近でお待ちください"
						/>

						<DetailCard
							icon={<ClockIcon className="w-5 h-5" />}
							label="予定時刻"
							value={task.scheduledTime}
							subValue={`所要時間: 約${task.estimatedDuration}分`}
						/>

						{vehicle && (
							<DetailCard
								icon={<ShuttleIcon className="w-5 h-5" />}
								label="車両"
								value={vehicle.name}
								subValue={vehicle.licensePlate}
							/>
						)}

						<DetailCard
							icon={<PassengerIcon className="w-5 h-5" />}
							label="ご予約"
							value={`${task.guestName}様`}
							subValue={`${task.numberOfGuests}名様`}
						/>
					</div>
				)}

				{/* 到着通知ボタン */}
				{canNotify && (
					<div className="pt-4">
						<ArrivalNotificationButton
							onNotify={handleNotify}
							isNotified={isNotified}
							isDisabled={false}
						/>
					</div>
				)}

				{/* 完了メッセージ */}
				{isCompleted && (
					<div className="bg-white rounded-2xl p-6 shadow-lg text-center">
						<div className="w-16 h-16 bg-[var(--aotake)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<CheckIcon className="w-8 h-8 text-[var(--aotake)]" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">
							送迎が完了しました
						</h3>
						<p className="text-gray-600">
							○○旅館でのご滞在をお楽しみください。
							<br />
							お帰りの送迎もご予約いただけます。
						</p>
					</div>
				)}

				{/* 注意事項 */}
				{!isCompleted && (
					<div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
						<h4 className="font-bold text-amber-800 mb-2 text-sm">ご注意</h4>
						<ul className="text-sm text-amber-700 space-y-1">
							<li>
								・ 到着されましたら「到着しました」ボタンをタップしてください
							</li>
							<li>・ 車両が見つからない場合は旅館までお電話ください</li>
							<li>・ お時間に遅れる場合もお知らせください</li>
						</ul>
					</div>
				)}
			</main>

			{/* フッター */}
			<footer className="max-w-lg mx-auto px-4 py-6 text-center">
				<p className="text-xs text-gray-500">お問い合わせ: 0599-XX-XXXX</p>
			</footer>
		</div>
	);
};

export default GuestShuttleStatus;
