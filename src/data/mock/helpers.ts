// Date helper functions

export const getToday = (): string => {
	const today = new Date();
	return today.toISOString().split("T")[0];
};

export const getTomorrow = (): string => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	return tomorrow.toISOString().split("T")[0];
};

export const formatTime = (time: string): string => {
	return time.replace(":", "時") + "分";
};

export const getTimeSlots = (): string[] => {
	const slots: string[] = [];
	for (let h = 6; h <= 22; h++) {
		slots.push(`${h.toString().padStart(2, "0")}:00`);
		slots.push(`${h.toString().padStart(2, "0")}:30`);
	}
	return slots;
};
