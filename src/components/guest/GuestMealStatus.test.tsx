import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { GuestMealStatus } from "./GuestMealStatus";

// モックデータを返すようにモック
vi.mock("../../data/mock", () => ({
  getMealTaskById: () => ({
    id: "MEAL001",
    reservationId: "RES001",
    category: "meal",
    title: "夕食",
    description: "夕食の配膳",
    roomId: "ROOM-001",
    scheduledTime: "18:00",
    estimatedDuration: 30,
    status: "pending",
    assignedStaffId: null,
    priority: "normal",
    isAnniversaryRelated: false,
    mealType: "dinner",
    courseType: "kaiseki",
    mealStatus: "preparing",
    guestName: "山田太郎",
    guestCount: 2,
    dietaryRestrictions: [],
    dietaryNotes: null,
    specialRequests: null,
  }),
  getRoomName: () => "スタイリッシュスイート",
}));

describe("TimeChangeModalの共通Modal移行", () => {
  it("TimeChangeModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<GuestMealStatus taskId="MEAL001" />);

    // 時刻変更ボタンをクリック
    const changeButton = screen.getByRole("button", {
      name: /時刻変更をリクエスト/,
    });
    await user.click(changeButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("TimeChangeModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<GuestMealStatus taskId="MEAL001" />);

    const changeButton = screen.getByRole("button", {
      name: /時刻変更をリクエスト/,
    });
    await user.click(changeButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでTimeChangeModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<GuestMealStatus taskId="MEAL001" />);

    const changeButton = screen.getByRole("button", {
      name: /時刻変更をリクエスト/,
    });
    await user.click(changeButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("TimeChangeModalにフッターが表示される", async () => {
    const user = userEvent.setup();
    render(<GuestMealStatus taskId="MEAL001" />);

    const changeButton = screen.getByRole("button", {
      name: /時刻変更をリクエスト/,
    });
    await user.click(changeButton);

    // 共通Modalを使用している場合、modal-footerが存在する
    const footer = screen.getByTestId("modal-footer");
    expect(footer).toBeInTheDocument();

    // フッター内にボタンがある
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "リクエスト送信" })).toBeInTheDocument();
  });
});
