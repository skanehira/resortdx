import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock data
vi.mock("../../data/mock", () => ({
  mockTasks: [
    {
      id: "task-1",
      title: "Test Task",
      category: "cleaning",
      status: "pending",
      priority: "normal",
      scheduledTime: "10:00",
      estimatedDuration: 30,
      roomId: "room-1",
      assignedStaffId: "STF001",
      isAnniversaryRelated: false,
      reservationId: "res-1",
    },
  ],
  mockTaskTemplates: [],
  mockRooms: [
    { id: "room-1", name: "客室101" },
    { id: "room-2", name: "客室102" },
  ],
  mockReservations: [
    { id: "res-1", guestName: "山田太郎" },
    { id: "res-2", guestName: "佐藤花子" },
  ],
  getStaffById: (id: string) =>
    id === "STF001"
      ? {
          id: "STF001",
          name: "田中太郎",
          role: "スタッフ",
          avatarColor: "#4A90A4",
        }
      : null,
  getReservationById: () => null,
  getRoomName: () => "客室101",
  mockStaff: [
    {
      id: "STF001",
      name: "田中太郎",
      role: "スタッフ",
      avatarColor: "#4A90A4",
    },
    {
      id: "STF002",
      name: "山田花子",
      role: "スタッフ",
      avatarColor: "#7B68EE",
    },
  ],
}));

// Import after mocking
import { TaskHistory } from "./TaskHistory";

describe("TaskHistory担当者変更", () => {
  it("タスク詳細モーダル内でStaffSelectorが表示される", async () => {
    const user = userEvent.setup();
    render(<TaskHistory />);

    // タスク行をクリックしてモーダルを開く
    const taskRow = screen.getByText("Test Task");
    await user.click(taskRow);

    // モーダルが開いたことを確認
    expect(screen.getByText("taskDetail.title")).toBeInTheDocument();

    // StaffSelectorが表示されていることを確認（aria-labelで識別）
    expect(screen.getByLabelText("担当者を選択")).toBeInTheDocument();
  });

  it("StaffSelectorで担当者を変更できる", async () => {
    const user = userEvent.setup();
    render(<TaskHistory />);

    // タスク行をクリックしてモーダルを開く
    const taskRow = screen.getByText("Test Task");
    await user.click(taskRow);

    // StaffSelectorを見つける
    const selector = screen.getByLabelText("担当者を選択");
    expect(selector).toHaveValue("STF001");

    // 別のスタッフを選択
    await user.selectOptions(selector, "STF002");

    // 選択が反映されていることを確認
    expect(selector).toHaveValue("STF002");
  });
});
