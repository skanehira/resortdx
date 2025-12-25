import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock data
vi.mock("../../data/mock", () => ({
  mockShuttleTasks: [
    {
      id: "SHT001",
      reservationId: "RES001",
      guestName: "テストゲスト",
      guestNameKana: "テストゲスト",
      numberOfGuests: 2,
      pickupLocation: "鳥羽駅",
      dropoffLocation: "旅館",
      direction: "pickup",
      scheduledTime: "14:00",
      estimatedDuration: 15,
      shuttleStatus: "not_departed",
      assignedVehicleId: "VEH001",
      assignedDriverId: "DRV001",
      priority: "normal",
      guestArrivalNotified: false,
      createdAt: "2025-12-23",
    },
  ],
  mockVehicles: [
    {
      id: "VEH001",
      name: "送迎車1",
      licensePlate: "三重 500 あ 1234",
      capacity: 8,
      status: "available",
      currentDriverId: "DRV001",
    },
  ],
  mockStaff: [
    {
      id: "DRV001",
      name: "田中太郎",
      role: "driver",
      avatarColor: "#4A90A4",
      status: "on_duty",
      shiftStart: "08:00",
      shiftEnd: "17:00",
      currentTaskId: null,
    },
    {
      id: "DRV002",
      name: "山田花子",
      role: "driver",
      avatarColor: "#7B68EE",
      status: "on_duty",
      shiftStart: "08:00",
      shiftEnd: "17:00",
      currentTaskId: null,
    },
  ],
  getVehicleById: (id: string) =>
    id === "VEH001"
      ? {
          id: "VEH001",
          name: "送迎車1",
          licensePlate: "三重 500 あ 1234",
          capacity: 8,
          status: "available",
          currentDriverId: "DRV001",
        }
      : null,
  getStaffById: (id: string) =>
    id === "DRV001"
      ? {
          id: "DRV001",
          name: "田中太郎",
          role: "driver",
          avatarColor: "#4A90A4",
          status: "on_duty",
          shiftStart: "08:00",
          shiftEnd: "17:00",
        }
      : id === "DRV002"
        ? {
            id: "DRV002",
            name: "山田花子",
            role: "driver",
            avatarColor: "#7B68EE",
            status: "on_duty",
            shiftStart: "08:00",
            shiftEnd: "17:00",
          }
        : null,
  getUnassignedShuttleTasks: () => [],
}));

// Import after mocking
import { ShuttleManagement } from "./ShuttleManagement";

describe("TaskDetailModalの共通Modal移行", () => {
  it("TaskDetailModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("TaskDetailModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでTaskDetailModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("AssignmentModalの共通Modal移行", () => {
  it("AssignmentModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    // タスクカードをクリックしてTaskDetailModalを開く
    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // 「変更」リンクをクリックしてAssignmentModalを開く
    const changeButton = screen.getByText("変更");
    await user.click(changeButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // AssignmentModalのタイトルが表示される
    expect(screen.getByText("割当変更")).toBeInTheDocument();
  });

  it("AssignmentModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    const changeButton = screen.getByText("変更");
    await user.click(changeButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("AssignmentModalにフッターが表示される", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    const changeButton = screen.getByText("変更");
    await user.click(changeButton);

    // 共通Modalを使用している場合、フッターがdata-testidで識別できる
    const footer = screen.getByTestId("modal-footer");
    expect(footer).toBeInTheDocument();
    expect(screen.getByText("キャンセル")).toBeInTheDocument();
    expect(screen.getByText("割当を保存")).toBeInTheDocument();
  });
});

describe("CreateShuttleModalの共通Modal移行", () => {
  it("CreateShuttleModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    // 「新規作成」ボタンをクリックしてCreateShuttleModalを開く
    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // CreateShuttleModalのタイトルが表示される（見出しとして）
    expect(screen.getByRole("heading", { name: "送迎を追加" })).toBeInTheDocument();
  });

  it("CreateShuttleModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでCreateShuttleModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("ShuttleManagement担当者変更", () => {
  it("タスク詳細モーダル内でStaffSelectorが表示される", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    // タスクカードをクリックしてモーダルを開く
    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // モーダルが開いたことを確認
    expect(screen.getByText("送迎詳細")).toBeInTheDocument();

    // StaffSelectorが表示されていることを確認（aria-labelで識別）
    expect(screen.getByLabelText("ドライバーを選択")).toBeInTheDocument();
  });

  it("StaffSelectorでドライバーを変更できる", async () => {
    const user = userEvent.setup();
    render(<ShuttleManagement />);

    // タスクカードをクリックしてモーダルを開く
    const taskCard = screen.getByText("テストゲスト様");
    await user.click(taskCard);

    // StaffSelectorを見つける
    const selector = screen.getByLabelText("ドライバーを選択");
    expect(selector).toHaveValue("DRV001");

    // 別のドライバーを選択
    await user.selectOptions(selector, "DRV002");

    // 選択が反映されていることを確認
    expect(selector).toHaveValue("DRV002");
  });
});
