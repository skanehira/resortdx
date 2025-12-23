import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock data
vi.mock("../../data/mock", () => ({
  mockCelebrationTasks: [
    {
      id: "CELEB001",
      reservationId: "RES001",
      guestName: "テストゲスト",
      guestNameKana: "テストゲスト",
      roomId: "room-1",
      celebrationType: "birthday",
      celebrationDescription: "誕生日のお祝い",
      items: [{ item: "cake", isChecked: false }],
      executionTime: "18:00",
      status: "pending",
      assignedStaffId: "STF001",
      priority: "normal",
      notes: null,
      completionReport: null,
      completedAt: null,
      createdAt: "2025-12-23",
    },
  ],
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
  mockRooms: [{ id: "room-1", name: "客室101", type: "standard" }],
  getStaffById: (id: string) =>
    id === "STF001"
      ? {
          id: "STF001",
          name: "田中太郎",
          role: "スタッフ",
          avatarColor: "#4A90A4",
        }
      : id === "STF002"
        ? {
            id: "STF002",
            name: "山田花子",
            role: "スタッフ",
            avatarColor: "#7B68EE",
          }
        : null,
  getRoomName: () => "客室101",
}));

// Import after mocking
import { CelebrationManagement } from "./CelebrationManagement";

describe("CelebrationManagement担当者変更", () => {
  it("タスク詳細モーダル内でStaffSelectorが表示される", async () => {
    const user = userEvent.setup();
    render(<CelebrationManagement />);

    // タスクカードをクリックしてモーダルを開く
    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // モーダルが開いたことを確認
    expect(screen.getByText("お祝い詳細")).toBeInTheDocument();

    // StaffSelectorが表示されていることを確認（aria-labelで識別）
    expect(screen.getByLabelText("担当者を選択")).toBeInTheDocument();
  });

  it("StaffSelectorで担当者を変更できる", async () => {
    const user = userEvent.setup();
    render(<CelebrationManagement />);

    // タスクカードをクリックしてモーダルを開く
    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // StaffSelectorを見つける
    const selector = screen.getByLabelText("担当者を選択");
    expect(selector).toHaveValue("STF001");

    // 別のスタッフを選択
    await user.selectOptions(selector, "STF002");

    // 選択が反映されていることを確認
    expect(selector).toHaveValue("STF002");
  });
});
