import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock data
vi.mock("../../data/mock", () => ({
  mockMealTasks: [
    {
      id: "MEAL001",
      reservationId: "RES001",
      guestName: "テストゲスト",
      guestNameKana: "テストゲスト",
      roomId: "room-1",
      mealType: "dinner",
      courseType: "kaiseki",
      servingTime: "18:00",
      numberOfGuests: 2,
      status: "preparing",
      assignedStaffId: "STF001",
      priority: "normal",
      dietaryRestrictions: [],
      specialRequests: null,
      notes: null,
      completedAt: null,
      createdAt: "2025-12-25",
    },
  ],
  mockMealOrderNotifications: [],
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
import { MealManagement } from "./MealManagement";

describe("TaskDetailModalの共通Modal移行", () => {
  it("TaskDetailModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<MealManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("TaskDetailModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<MealManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでTaskDetailModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<MealManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("CreateMealModalの共通Modal移行", () => {
  it("CreateMealModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<MealManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "配膳を追加" })).toBeInTheDocument();
  });

  it("CreateMealModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<MealManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでCreateMealModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<MealManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
