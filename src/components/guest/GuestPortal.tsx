import { useState } from "react";

// Types
type GuestView =
	| "home"
	| "shuttle"
	| "dining"
	| "activities"
	| "requests"
	| "celebration";

interface ShuttleInfo {
	type: "pickup" | "dropoff";
	time: string;
	location: string;
	status: "scheduled" | "departing" | "arriving" | "arrived" | "completed";
	vehicleNumber?: string;
}

interface MealInfo {
	id: string;
	type: "breakfast" | "dinner";
	date: string;
	time: string;
	location: string;
	course: string;
	allergies: string[];
	notes: string;
}

interface Activity {
	id: string;
	name: string;
	description: string;
	duration: string;
	price: number;
	image: string;
	availableTimes: string[];
	category: "nature" | "culture" | "wellness" | "adventure";
}

interface Celebration {
	type: string;
	date: string;
	details: string;
	requests: string[];
}

// Mock Data
const mockShuttle: ShuttleInfo = {
	type: "pickup",
	time: "14:30",
	location: "熱海駅 東口ロータリー",
	status: "scheduled",
	vehicleNumber: "品川 300 あ 1234",
};

const mockMeals: MealInfo[] = [
	{
		id: "meal-1",
		type: "dinner",
		date: "本日",
		time: "18:30",
		location: "個室ダイニング「月見」",
		course: "季節の懐石コース",
		allergies: ["甲殻類"],
		notes: "お子様用取り分け皿をご用意",
	},
	{
		id: "meal-2",
		type: "breakfast",
		date: "明日",
		time: "08:00",
		location: "お部屋食",
		course: "和朝食",
		allergies: ["甲殻類"],
		notes: "",
	},
];

const mockActivities: Activity[] = [
	{
		id: "act-1",
		name: "熱海梅園 早朝散策ツアー",
		description:
			"専属ガイドと巡る、静寂の梅園。朝露に輝く梅の花をお楽しみください。",
		duration: "2時間",
		price: 5500,
		image: "🌸",
		availableTimes: ["06:30", "07:00", "07:30"],
		category: "nature",
	},
	{
		id: "act-2",
		name: "来宮神社 参拝と御朱印",
		description: "樹齢2000年の大楠を擁する来宮神社へ。送迎付きでご案内。",
		duration: "1.5時間",
		price: 3300,
		image: "⛩️",
		availableTimes: ["09:00", "10:00", "14:00", "15:00"],
		category: "culture",
	},
	{
		id: "act-3",
		name: "プライベートヨガセッション",
		description: "海を望むテラスで、心身を整える特別なひととき。",
		duration: "1時間",
		price: 8800,
		image: "🧘",
		availableTimes: ["06:00", "07:00", "16:00", "17:00"],
		category: "wellness",
	},
	{
		id: "act-4",
		name: "初島クルーズ＆ランチ",
		description: "熱海港から初島へ。島内散策と海鮮ランチをお楽しみに。",
		duration: "4時間",
		price: 15400,
		image: "🚢",
		availableTimes: ["10:00"],
		category: "adventure",
	},
];

const mockCelebration: Celebration = {
	type: "結婚記念日",
	date: "本日",
	details: "ご結婚5周年おめでとうございます",
	requests: ["シャンパン（モエ・エ・シャンドン）", "花束（白バラ中心）"],
};

// Styles
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700&family=Noto+Sans+JP:wght@300;400;500;600&display=swap');

  .guest-portal {
    --kon: #1a2744;
    --kon-light: #2d3f5e;
    --suna: #f5f0e8;
    --suna-dark: #e8e0d4;
    --kinscha: #c4a35a;
    --kinscha-light: #d4b86a;
    --matcha: #7d8c6e;
    --matcha-light: #9aaa8a;
    --sumi: #2d2d2d;
    --washi: #faf8f5;

    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 400;
    background: var(--suna);
    min-height: 100vh;
    max-width: 430px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
  }

  /* Washi paper texture overlay */
  .guest-portal::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 1;
  }

  .portal-content {
    position: relative;
    z-index: 2;
    padding-bottom: 100px;
  }

  /* Header */
  .portal-header {
    background: linear-gradient(180deg, var(--kon) 0%, var(--kon-light) 100%);
    padding: 48px 24px 32px;
    position: relative;
    overflow: hidden;
  }

  .portal-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(196, 163, 90, 0.15) 0%, transparent 50%);
  }

  .portal-header::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    height: 40px;
    background: var(--suna);
    border-radius: 50% 50% 0 0;
  }

  .header-content {
    position: relative;
    z-index: 2;
  }

  .brand-mark {
    font-family: 'Zen Old Mincho', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--washi);
    letter-spacing: 0.15em;
    margin-bottom: 4px;
  }

  .room-info {
    font-size: 13px;
    color: var(--kinscha);
    letter-spacing: 0.1em;
  }

  .guest-name {
    font-family: 'Zen Old Mincho', serif;
    font-size: 18px;
    color: var(--washi);
    margin-top: 16px;
    opacity: 0.95;
  }

  /* Navigation */
  .portal-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: var(--washi);
    border-top: 1px solid var(--suna-dark);
    padding: 8px 16px 24px;
    z-index: 100;
    display: flex;
    justify-content: space-around;
    box-shadow: 0 -4px 20px rgba(26, 39, 68, 0.08);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
  }

  .nav-item:hover {
    background: var(--suna);
  }

  .nav-item.active {
    background: var(--kon);
  }

  .nav-item.active .nav-icon {
    color: var(--kinscha);
  }

  .nav-item.active .nav-label {
    color: var(--washi);
  }

  .nav-icon {
    font-size: 20px;
    color: var(--kon);
    transition: color 0.3s ease;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    color: var(--kon);
    letter-spacing: 0.05em;
    transition: color 0.3s ease;
  }

  /* Section Headers */
  .section-header {
    padding: 24px 24px 16px;
  }

  .section-title {
    font-family: 'Zen Old Mincho', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--kon);
    letter-spacing: 0.08em;
    position: relative;
    display: inline-block;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, var(--kinscha), transparent);
  }

  .section-subtitle {
    font-size: 12px;
    color: var(--kon-light);
    margin-top: 8px;
    letter-spacing: 0.05em;
  }

  /* Cards */
  .card {
    background: var(--washi);
    border-radius: 16px;
    margin: 0 16px 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(26, 39, 68, 0.06);
    border: 1px solid rgba(26, 39, 68, 0.04);
    transition: all 0.3s ease;
  }

  .card:hover {
    box-shadow: 0 4px 20px rgba(26, 39, 68, 0.1);
    transform: translateY(-2px);
  }

  .card-accent {
    border-left: 3px solid var(--kinscha);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .card-title {
    font-family: 'Zen Old Mincho', serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--kon);
    letter-spacing: 0.05em;
  }

  .card-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.05em;
  }

  .badge-gold {
    background: linear-gradient(135deg, var(--kinscha), var(--kinscha-light));
    color: var(--washi);
  }

  .badge-matcha {
    background: var(--matcha);
    color: var(--washi);
  }

  .badge-kon {
    background: var(--kon);
    color: var(--washi);
  }

  .card-body {
    font-size: 14px;
    color: var(--sumi);
    line-height: 1.7;
  }

  .card-detail {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    font-size: 13px;
    color: var(--kon-light);
  }

  .card-detail-icon {
    font-size: 14px;
    opacity: 0.7;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    width: 100%;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--kon) 0%, var(--kon-light) 100%);
    color: var(--washi);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(26, 39, 68, 0.25);
  }

  .btn-gold {
    background: linear-gradient(135deg, var(--kinscha) 0%, var(--kinscha-light) 100%);
    color: var(--washi);
  }

  .btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(196, 163, 90, 0.35);
  }

  .btn-outline {
    background: transparent;
    border: 1.5px solid var(--kon);
    color: var(--kon);
  }

  .btn-outline:hover {
    background: var(--kon);
    color: var(--washi);
  }

  .btn-sm {
    padding: 10px 16px;
    font-size: 12px;
  }

  /* Status Indicator */
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--suna);
    border-radius: 10px;
    margin-top: 12px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .status-dot.scheduled {
    background: var(--kon);
  }

  .status-dot.active {
    background: var(--matcha);
  }

  .status-dot.arriving {
    background: var(--kinscha);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .status-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--kon);
  }

  /* Timeline */
  .timeline {
    position: relative;
    padding-left: 24px;
    margin: 16px 0;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: linear-gradient(180deg, var(--kinscha), var(--suna-dark));
  }

  .timeline-item {
    position: relative;
    padding: 12px 0;
  }

  .timeline-item::before {
    content: '';
    position: absolute;
    left: -21px;
    top: 18px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--kinscha);
    border: 2px solid var(--washi);
  }

  .timeline-time {
    font-size: 12px;
    font-weight: 600;
    color: var(--kinscha);
    letter-spacing: 0.1em;
  }

  .timeline-content {
    font-size: 14px;
    color: var(--sumi);
    margin-top: 4px;
  }

  /* Activity Grid */
  .activity-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 16px;
  }

  .activity-card {
    background: var(--washi);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(26, 39, 68, 0.06);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .activity-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(26, 39, 68, 0.12);
  }

  .activity-image {
    height: 100px;
    background: linear-gradient(135deg, var(--kon) 0%, var(--kon-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
  }

  .activity-info {
    padding: 14px;
  }

  .activity-name {
    font-family: 'Zen Old Mincho', serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--kon);
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .activity-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .activity-duration {
    font-size: 11px;
    color: var(--kon-light);
  }

  .activity-price {
    font-size: 12px;
    font-weight: 600;
    color: var(--kinscha);
  }

  /* Request Form */
  .request-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 16px;
  }

  .request-card {
    background: var(--washi);
    border-radius: 14px;
    padding: 20px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1.5px solid transparent;
  }

  .request-card:hover {
    border-color: var(--kinscha);
    transform: translateY(-2px);
  }

  .request-card.selected {
    border-color: var(--kinscha);
    background: linear-gradient(180deg, var(--washi) 0%, rgba(196, 163, 90, 0.08) 100%);
  }

  .request-icon {
    font-size: 28px;
    margin-bottom: 10px;
  }

  .request-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--kon);
    letter-spacing: 0.03em;
  }

  /* Celebration Section */
  .celebration-header {
    background: linear-gradient(135deg, var(--kinscha) 0%, var(--kinscha-light) 100%);
    border-radius: 16px;
    margin: 24px 16px 16px;
    padding: 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .celebration-header::before {
    content: '✦';
    position: absolute;
    top: 12px;
    left: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  .celebration-header::after {
    content: '✦';
    position: absolute;
    bottom: 12px;
    right: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  .celebration-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .celebration-type {
    font-family: 'Zen Old Mincho', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--washi);
    letter-spacing: 0.1em;
  }

  .celebration-message {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 8px;
  }

  /* Form Elements */
  .form-group {
    margin: 16px;
  }

  .form-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--kon);
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    display: block;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    border: 1.5px solid var(--suna-dark);
    border-radius: 12px;
    font-size: 14px;
    font-family: 'Noto Sans JP', sans-serif;
    background: var(--washi);
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--kinscha);
    box-shadow: 0 0 0 3px rgba(196, 163, 90, 0.15);
  }

  .form-textarea {
    min-height: 100px;
    resize: vertical;
  }

  /* Time Picker */
  .time-picker {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding: 0 16px;
  }

  .time-option {
    padding: 10px 16px;
    border: 1.5px solid var(--suna-dark);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--kon);
    background: var(--washi);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .time-option:hover {
    border-color: var(--kinscha);
  }

  .time-option.selected {
    background: var(--kon);
    border-color: var(--kon);
    color: var(--washi);
  }

  /* Quick Actions */
  .quick-actions {
    display: flex;
    gap: 12px;
    padding: 0 16px;
    margin-top: 16px;
  }

  .quick-action {
    flex: 1;
    background: var(--washi);
    border-radius: 14px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .quick-action:hover {
    border-color: var(--kinscha);
    transform: translateY(-2px);
  }

  .quick-action-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .quick-action-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--kon);
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 80px;
    background: rgba(26, 39, 68, 0.6);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: var(--washi);
    border-radius: 24px;
    width: calc(100% - 16px);
    max-width: 414px;
    max-height: calc(85vh - 80px);
    overflow-y: auto;
    animation: slideUp 0.3s ease;
    margin: 8px;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .modal-header {
    padding: 24px;
    border-bottom: 1px solid var(--suna-dark);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: var(--washi);
    z-index: 10;
  }

  .modal-title {
    font-family: 'Zen Old Mincho', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--kon);
  }

  .modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--suna);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--kon);
    transition: all 0.3s ease;
  }

  .modal-close:hover {
    background: var(--kon);
    color: var(--washi);
  }

  .modal-body {
    padding: 24px;
  }

  .modal-footer {
    padding: 16px 24px 32px;
  }

  /* Success State */
  .success-state {
    text-align: center;
    padding: 48px 24px;
  }

  .success-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  .success-title {
    font-family: 'Zen Old Mincho', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--kon);
    margin-bottom: 12px;
  }

  .success-message {
    font-size: 14px;
    color: var(--kon-light);
    line-height: 1.7;
  }

  /* Animations */
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }

  .slide-up {
    animation: slideUp 0.5s ease forwards;
  }

  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
`;

// Components
const HomeView = ({
	onNavigate,
}: {
	onNavigate: (view: GuestView) => void;
}) => (
	<div className="fade-in">
		<div className="quick-actions">
			<div className="quick-action" onClick={() => onNavigate("shuttle")}>
				<div className="quick-action-icon">🚐</div>
				<div className="quick-action-label">送迎</div>
			</div>
			<div className="quick-action" onClick={() => onNavigate("dining")}>
				<div className="quick-action-icon">🍽️</div>
				<div className="quick-action-label">お食事</div>
			</div>
			<div className="quick-action" onClick={() => onNavigate("activities")}>
				<div className="quick-action-icon">🌸</div>
				<div className="quick-action-label">体験</div>
			</div>
			<div className="quick-action" onClick={() => onNavigate("requests")}>
				<div className="quick-action-icon">🛎️</div>
				<div className="quick-action-label">ご依頼</div>
			</div>
		</div>

		{mockCelebration && (
			<div className="celebration-header">
				<div className="celebration-icon">💐</div>
				<div className="celebration-type">{mockCelebration.type}</div>
				<div className="celebration-message">{mockCelebration.details}</div>
			</div>
		)}

		<div className="section-header">
			<h2 className="section-title">本日の送迎</h2>
		</div>
		<div className="card card-accent">
			<div className="card-header">
				<div className="card-title">お迎え</div>
				<span className="card-badge badge-kon">予定</span>
			</div>
			<div className="card-body">
				<div className="card-detail">
					<span className="card-detail-icon">🕐</span>
					{mockShuttle.time}
				</div>
				<div className="card-detail">
					<span className="card-detail-icon">📍</span>
					{mockShuttle.location}
				</div>
			</div>
		</div>

		<div className="section-header">
			<h2 className="section-title">本日のお食事</h2>
		</div>
		{mockMeals
			.filter((m) => m.date === "本日")
			.map((meal) => (
				<div
					key={meal.id}
					className="card"
					onClick={() => onNavigate("dining")}
				>
					<div className="card-header">
						<div className="card-title">
							{meal.type === "dinner" ? "ご夕食" : "ご朝食"}
						</div>
						<span className="card-badge badge-gold">{meal.course}</span>
					</div>
					<div className="card-body">
						<div className="card-detail">
							<span className="card-detail-icon">🕐</span>
							{meal.time}
						</div>
						<div className="card-detail">
							<span className="card-detail-icon">📍</span>
							{meal.location}
						</div>
					</div>
				</div>
			))}
	</div>
);

const ShuttleView = () => {
	const [showArrivalModal, setShowArrivalModal] = useState(false);
	const [arrivalSent, setArrivalSent] = useState(false);

	const handleArrivalNotify = () => {
		setArrivalSent(true);
	};

	const getStatusText = (status: ShuttleInfo["status"]) => {
		const statusMap = {
			scheduled: "ご予約済み",
			departing: "出発しました",
			arriving: "まもなく到着",
			arrived: "到着しました",
			completed: "完了",
		};
		return statusMap[status];
	};

	return (
		<div className="fade-in">
			<div className="section-header">
				<h2 className="section-title">送迎予定</h2>
				<p className="section-subtitle">本日のお迎え・お送りの予定</p>
			</div>

			<div className="card card-accent">
				<div className="card-header">
					<div className="card-title">
						{mockShuttle.type === "pickup" ? "お迎え" : "お送り"}
					</div>
					<span className="card-badge badge-kon">
						{getStatusText(mockShuttle.status)}
					</span>
				</div>
				<div className="card-body">
					<div className="card-detail">
						<span className="card-detail-icon">🕐</span>
						<strong>{mockShuttle.time}</strong>
					</div>
					<div className="card-detail">
						<span className="card-detail-icon">📍</span>
						{mockShuttle.location}
					</div>
					{mockShuttle.vehicleNumber && (
						<div className="card-detail">
							<span className="card-detail-icon">🚐</span>
							車両: {mockShuttle.vehicleNumber}
						</div>
					)}
					<div className="status-indicator">
						<span className={`status-dot ${mockShuttle.status}`}></span>
						<span className="status-text">
							{getStatusText(mockShuttle.status)}
						</span>
					</div>
				</div>
			</div>

			<div style={{ padding: "0 16px", marginTop: "24px" }}>
				<button
					className="btn btn-gold"
					onClick={() => setShowArrivalModal(true)}
				>
					🏁 到着を連絡する
				</button>
			</div>

			<div className="section-header" style={{ marginTop: "32px" }}>
				<h2 className="section-title">送迎の流れ</h2>
			</div>
			<div className="card">
				<div className="timeline">
					<div className="timeline-item">
						<div className="timeline-time">14:30</div>
						<div className="timeline-content">
							熱海駅東口ロータリーでお待ちください
						</div>
					</div>
					<div className="timeline-item">
						<div className="timeline-time">14:35</div>
						<div className="timeline-content">車両到着・お名前確認</div>
					</div>
					<div className="timeline-item">
						<div className="timeline-time">14:50</div>
						<div className="timeline-content">ふふ熱海 到着予定</div>
					</div>
				</div>
			</div>

			{showArrivalModal && (
				<div
					className="modal-overlay"
					onClick={() => setShowArrivalModal(false)}
				>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3 className="modal-title">到着連絡</h3>
							<button
								className="modal-close"
								onClick={() => setShowArrivalModal(false)}
							>
								×
							</button>
						</div>
						{arrivalSent ? (
							<div className="success-state">
								<div className="success-icon">✓</div>
								<div className="success-title">ご連絡ありがとうございます</div>
								<div className="success-message">
									ドライバーに到着をお伝えしました。
									<br />
									まもなくお迎えに参ります。
								</div>
							</div>
						) : (
							<>
								<div className="modal-body">
									<p
										style={{
											fontSize: "14px",
											color: "#2d2d2d",
											lineHeight: 1.7,
										}}
									>
										熱海駅東口ロータリーに到着されましたら、
										下のボタンでお知らせください。ドライバーがお迎えに参ります。
									</p>
								</div>
								<div className="modal-footer">
									<button
										className="btn btn-gold"
										onClick={handleArrivalNotify}
									>
										🏁 今到着しました
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const DiningView = () => {
	const [selectedMeal, setSelectedMeal] = useState<MealInfo | null>(null);
	const [showTimeChange, setShowTimeChange] = useState(false);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [changeSubmitted, setChangeSubmitted] = useState(false);

	const availableTimes = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

	const handleTimeChangeSubmit = () => {
		setChangeSubmitted(true);
	};

	return (
		<div className="fade-in">
			<div className="section-header">
				<h2 className="section-title">お食事</h2>
				<p className="section-subtitle">ご滞在中のお食事予定</p>
			</div>

			{mockMeals.map((meal) => (
				<div
					key={meal.id}
					className="card card-accent"
					onClick={() => setSelectedMeal(meal)}
				>
					<div className="card-header">
						<div className="card-title">
							{meal.type === "dinner" ? "ご夕食" : "ご朝食"}
						</div>
						<span className="card-badge badge-gold">{meal.date}</span>
					</div>
					<div className="card-body">
						<div className="card-detail">
							<span className="card-detail-icon">🕐</span>
							<strong>{meal.time}</strong>
						</div>
						<div className="card-detail">
							<span className="card-detail-icon">📍</span>
							{meal.location}
						</div>
						<div className="card-detail">
							<span className="card-detail-icon">🍱</span>
							{meal.course}
						</div>
						{meal.allergies.length > 0 && (
							<div className="card-detail">
								<span className="card-detail-icon">⚠️</span>
								アレルギー対応: {meal.allergies.join("、")}
							</div>
						)}
					</div>
				</div>
			))}

			{selectedMeal && (
				<div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3 className="modal-title">
								{selectedMeal.type === "dinner" ? "ご夕食" : "ご朝食"}詳細
							</h3>
							<button
								className="modal-close"
								onClick={() => setSelectedMeal(null)}
							>
								×
							</button>
						</div>
						<div className="modal-body">
							<div className="card">
								<div className="card-body">
									<div className="card-detail">
										<span className="card-detail-icon">📅</span>
										{selectedMeal.date}
									</div>
									<div className="card-detail">
										<span className="card-detail-icon">🕐</span>
										<strong>{selectedMeal.time}</strong>
									</div>
									<div className="card-detail">
										<span className="card-detail-icon">📍</span>
										{selectedMeal.location}
									</div>
									<div className="card-detail">
										<span className="card-detail-icon">🍱</span>
										{selectedMeal.course}
									</div>
									{selectedMeal.allergies.length > 0 && (
										<div className="card-detail">
											<span className="card-detail-icon">⚠️</span>
											アレルギー対応: {selectedMeal.allergies.join("、")}
										</div>
									)}
									{selectedMeal.notes && (
										<div className="card-detail">
											<span className="card-detail-icon">📝</span>
											{selectedMeal.notes}
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								className="btn btn-outline"
								onClick={() => {
									setShowTimeChange(true);
									setSelectedMeal(null);
								}}
							>
								⏰ お時間の変更をリクエスト
							</button>
						</div>
					</div>
				</div>
			)}

			{showTimeChange && (
				<div className="modal-overlay" onClick={() => setShowTimeChange(false)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3 className="modal-title">お時間変更リクエスト</h3>
							<button
								className="modal-close"
								onClick={() => {
									setShowTimeChange(false);
									setChangeSubmitted(false);
									setSelectedTime(null);
								}}
							>
								×
							</button>
						</div>
						{changeSubmitted ? (
							<div className="success-state">
								<div className="success-icon">✓</div>
								<div className="success-title">リクエストを承りました</div>
								<div className="success-message">
									ご希望のお時間で調整いたします。
									<br />
									確定次第、お部屋にご連絡いたします。
								</div>
							</div>
						) : (
							<>
								<div className="modal-body">
									<p
										style={{
											fontSize: "14px",
											color: "#2d2d2d",
											marginBottom: "16px",
										}}
									>
										ご希望のお時間をお選びください
									</p>
									<div className="time-picker">
										{availableTimes.map((time) => (
											<button
												key={time}
												className={`time-option ${selectedTime === time ? "selected" : ""}`}
												onClick={() => setSelectedTime(time)}
											>
												{time}
											</button>
										))}
									</div>
								</div>
								<div className="modal-footer">
									<button
										className="btn btn-primary"
										onClick={handleTimeChangeSubmit}
										disabled={!selectedTime}
										style={{ opacity: selectedTime ? 1 : 0.5 }}
									>
										変更をリクエスト
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const ActivitiesView = () => {
	const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
		null,
	);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [bookingSubmitted, setBookingSubmitted] = useState(false);

	const categoryLabels = {
		nature: "自然",
		culture: "文化",
		wellness: "癒し",
		adventure: "冒険",
	};

	const handleBookingSubmit = () => {
		setBookingSubmitted(true);
	};

	return (
		<div className="fade-in">
			<div className="section-header">
				<h2 className="section-title">体験・アクティビティ</h2>
				<p className="section-subtitle">熱海ならではの特別な体験を</p>
			</div>

			<div className="activity-grid">
				{mockActivities.map((activity) => (
					<div
						key={activity.id}
						className="activity-card"
						onClick={() => setSelectedActivity(activity)}
					>
						<div className="activity-image">{activity.image}</div>
						<div className="activity-info">
							<div className="activity-name">{activity.name}</div>
							<div className="activity-meta">
								<span className="activity-duration">{activity.duration}</span>
								<span className="activity-price">
									¥{activity.price.toLocaleString()}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{selectedActivity && (
				<div
					className="modal-overlay"
					onClick={() => {
						setSelectedActivity(null);
						setBookingSubmitted(false);
						setSelectedTime(null);
					}}
				>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3 className="modal-title">{selectedActivity.name}</h3>
							<button
								className="modal-close"
								onClick={() => {
									setSelectedActivity(null);
									setBookingSubmitted(false);
									setSelectedTime(null);
								}}
							>
								×
							</button>
						</div>
						{bookingSubmitted ? (
							<div className="success-state">
								<div className="success-icon">✓</div>
								<div className="success-title">ご予約を承りました</div>
								<div className="success-message">
									{selectedActivity.name}
									<br />
									{selectedTime} ～<br />
									<br />
									詳細はお部屋にご連絡いたします。
								</div>
							</div>
						) : (
							<>
								<div className="modal-body">
									<div
										style={{
											fontSize: "48px",
											textAlign: "center",
											marginBottom: "16px",
										}}
									>
										{selectedActivity.image}
									</div>
									<div style={{ marginBottom: "16px" }}>
										<span
											className="card-badge badge-matcha"
											style={{ marginRight: "8px" }}
										>
											{categoryLabels[selectedActivity.category]}
										</span>
										<span className="card-badge badge-kon">
											{selectedActivity.duration}
										</span>
									</div>
									<p
										style={{
											fontSize: "14px",
											color: "#2d2d2d",
											lineHeight: 1.7,
											marginBottom: "20px",
										}}
									>
										{selectedActivity.description}
									</p>
									<div
										style={{
											fontSize: "20px",
											fontWeight: "600",
											color: "#c4a35a",
											marginBottom: "20px",
										}}
									>
										¥{selectedActivity.price.toLocaleString()}
										<span
											style={{
												fontSize: "12px",
												color: "#666",
												marginLeft: "4px",
											}}
										>
											/お一人様
										</span>
									</div>
									<p
										style={{
											fontSize: "13px",
											fontWeight: "500",
											color: "#1a2744",
											marginBottom: "12px",
										}}
									>
										ご希望のお時間
									</p>
									<div className="time-picker">
										{selectedActivity.availableTimes.map((time) => (
											<button
												key={time}
												className={`time-option ${selectedTime === time ? "selected" : ""}`}
												onClick={() => setSelectedTime(time)}
											>
												{time}
											</button>
										))}
									</div>
								</div>
								<div className="modal-footer">
									<button
										className="btn btn-gold"
										onClick={handleBookingSubmit}
										disabled={!selectedTime}
										style={{ opacity: selectedTime ? 1 : 0.5 }}
									>
										予約する
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const RequestsView = () => {
	const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
	const [showRequestForm, setShowRequestForm] = useState(false);
	const [requestSubmitted, setRequestSubmitted] = useState(false);
	const [requestNote, setRequestNote] = useState("");

	const requestTypes = [
		{ id: "checkout", icon: "🕐", label: "チェックアウト\n時間変更" },
		{ id: "no-cleaning", icon: "🚫", label: "清掃不要" },
		{ id: "amenity", icon: "🧴", label: "アメニティ\n追加" },
		{ id: "towel", icon: "🛁", label: "タオル\n追加" },
		{ id: "meal", icon: "🍽️", label: "お食事\nリクエスト" },
		{ id: "other", icon: "💬", label: "その他\nご要望" },
	];

	const handleRequestSubmit = () => {
		setRequestSubmitted(true);
	};

	return (
		<div className="fade-in">
			<div className="section-header">
				<h2 className="section-title">ご依頼</h2>
				<p className="section-subtitle">お気軽にお申し付けください</p>
			</div>

			<div className="request-grid">
				{requestTypes.map((request) => (
					<div
						key={request.id}
						className={`request-card ${selectedRequest === request.id ? "selected" : ""}`}
						onClick={() => {
							setSelectedRequest(request.id);
							setShowRequestForm(true);
						}}
					>
						<div className="request-icon">{request.icon}</div>
						<div className="request-label" style={{ whiteSpace: "pre-line" }}>
							{request.label}
						</div>
					</div>
				))}
			</div>

			{showRequestForm && (
				<div
					className="modal-overlay"
					onClick={() => {
						setShowRequestForm(false);
						setRequestSubmitted(false);
						setRequestNote("");
					}}
				>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3 className="modal-title">
								{requestTypes
									.find((r) => r.id === selectedRequest)
									?.label.replace("\n", "")}
							</h3>
							<button
								className="modal-close"
								onClick={() => {
									setShowRequestForm(false);
									setRequestSubmitted(false);
									setRequestNote("");
								}}
							>
								×
							</button>
						</div>
						{requestSubmitted ? (
							<div className="success-state">
								<div className="success-icon">✓</div>
								<div className="success-title">ご依頼を承りました</div>
								<div className="success-message">
									担当スタッフが対応いたします。
									<br />
									しばらくお待ちくださいませ。
								</div>
							</div>
						) : (
							<>
								<div className="modal-body">
									<div
										style={{
											fontSize: "48px",
											textAlign: "center",
											marginBottom: "24px",
										}}
									>
										{requestTypes.find((r) => r.id === selectedRequest)?.icon}
									</div>
									<div className="form-group" style={{ margin: 0 }}>
										<label className="form-label">ご要望・備考</label>
										<textarea
											className="form-input form-textarea"
											placeholder="詳細をご記入ください（任意）"
											value={requestNote}
											onChange={(e) => setRequestNote(e.target.value)}
										/>
									</div>
								</div>
								<div className="modal-footer">
									<button
										className="btn btn-primary"
										onClick={handleRequestSubmit}
									>
										送信する
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const CelebrationView = () => {
	const [showAddRequest, setShowAddRequest] = useState(false);
	const [additionalRequest, setAdditionalRequest] = useState("");
	const [requestSubmitted, setRequestSubmitted] = useState(false);

	const handleRequestSubmit = () => {
		setRequestSubmitted(true);
	};

	return (
		<div className="fade-in">
			<div className="celebration-header">
				<div className="celebration-icon">💐</div>
				<div className="celebration-type">{mockCelebration.type}</div>
				<div className="celebration-message">{mockCelebration.details}</div>
			</div>

			<div className="section-header">
				<h2 className="section-title">ご準備内容</h2>
				<p className="section-subtitle">当日ご用意させていただきます</p>
			</div>

			<div className="card">
				<div className="card-body">
					{mockCelebration.requests.map((request, index) => (
						<div
							key={index}
							className="card-detail"
							style={{ marginTop: index === 0 ? 0 : 12 }}
						>
							<span className="card-detail-icon">✦</span>
							{request}
						</div>
					))}
				</div>
			</div>

			<div style={{ padding: "0 16px", marginTop: "24px" }}>
				<button
					className="btn btn-outline"
					onClick={() => setShowAddRequest(true)}
				>
					✨ 追加のご要望
				</button>
			</div>

			{showAddRequest && (
				<div
					className="modal-overlay"
					onClick={() => {
						setShowAddRequest(false);
						setRequestSubmitted(false);
						setAdditionalRequest("");
					}}
				>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3 className="modal-title">追加のご要望</h3>
							<button
								className="modal-close"
								onClick={() => {
									setShowAddRequest(false);
									setRequestSubmitted(false);
									setAdditionalRequest("");
								}}
							>
								×
							</button>
						</div>
						{requestSubmitted ? (
							<div className="success-state">
								<div className="success-icon">✓</div>
								<div className="success-title">ご要望を承りました</div>
								<div className="success-message">
									特別な一日になりますよう
									<br />
									心を込めてご準備いたします。
								</div>
							</div>
						) : (
							<>
								<div className="modal-body">
									<p
										style={{
											fontSize: "14px",
											color: "#2d2d2d",
											marginBottom: "16px",
											lineHeight: 1.7,
										}}
									>
										お祝いに関する追加のご要望がございましたら、お気軽にお申し付けください。
									</p>
									<div className="form-group" style={{ margin: 0 }}>
										<label className="form-label">ご要望内容</label>
										<textarea
											className="form-input form-textarea"
											placeholder="例：サプライズ演出のタイミング、追加のお花など"
											value={additionalRequest}
											onChange={(e) => setAdditionalRequest(e.target.value)}
										/>
									</div>
								</div>
								<div className="modal-footer">
									<button
										className="btn btn-gold"
										onClick={handleRequestSubmit}
										disabled={!additionalRequest.trim()}
										style={{ opacity: additionalRequest.trim() ? 1 : 0.5 }}
									>
										送信する
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

// Main Component
export const GuestPortal = () => {
	const [currentView, setCurrentView] = useState<GuestView>("home");

	const renderView = () => {
		switch (currentView) {
			case "home":
				return <HomeView onNavigate={setCurrentView} />;
			case "shuttle":
				return <ShuttleView />;
			case "dining":
				return <DiningView />;
			case "activities":
				return <ActivitiesView />;
			case "requests":
				return <RequestsView />;
			case "celebration":
				return <CelebrationView />;
			default:
				return <HomeView onNavigate={setCurrentView} />;
		}
	};

	return (
		<>
			<style>{styles}</style>
			<div className="guest-portal">
				<div className="portal-content">
					<header className="portal-header">
						<div className="header-content">
							<div className="brand-mark">ふふ熱海</div>
							<div className="room-info">離れ 月見 ・ ROOM 201</div>
							<div className="guest-name">山田様</div>
						</div>
					</header>

					{renderView()}
				</div>

				<nav className="portal-nav">
					<button
						className={`nav-item ${currentView === "home" ? "active" : ""}`}
						onClick={() => setCurrentView("home")}
					>
						<span className="nav-icon">🏠</span>
						<span className="nav-label">ホーム</span>
					</button>
					<button
						className={`nav-item ${currentView === "shuttle" ? "active" : ""}`}
						onClick={() => setCurrentView("shuttle")}
					>
						<span className="nav-icon">🚐</span>
						<span className="nav-label">送迎</span>
					</button>
					<button
						className={`nav-item ${currentView === "dining" ? "active" : ""}`}
						onClick={() => setCurrentView("dining")}
					>
						<span className="nav-icon">🍽️</span>
						<span className="nav-label">お食事</span>
					</button>
					<button
						className={`nav-item ${currentView === "activities" ? "active" : ""}`}
						onClick={() => setCurrentView("activities")}
					>
						<span className="nav-icon">🌸</span>
						<span className="nav-label">体験</span>
					</button>
					<button
						className={`nav-item ${currentView === "celebration" ? "active" : ""}`}
						onClick={() => setCurrentView("celebration")}
					>
						<span className="nav-icon">🎉</span>
						<span className="nav-label">お祝い</span>
					</button>
				</nav>
			</div>
		</>
	);
};

export default GuestPortal;
