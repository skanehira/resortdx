import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock data
vi.mock("../../data/mock", () => ({
  mockRoomAmenities: [],
  mockRoomEquipments: [],
  mockReservations: [],
  mockRooms: [
    { id: "room-1", name: "客室101", type: "standard" },
    { id: "room-2", name: "客室102", type: "standard" },
  ],
  getRoomEquipmentStatus: () => ({ amenitiesLow: 0, equipmentIssues: 0 }),
  getStaffById: () => null,
  getRoomName: (id: string) => (id === "room-1" ? "客室101" : "客室102"),
}));

// Import after mocking
import { EquipmentManagement } from "./EquipmentManagement";

describe("CreateItemModalの共通Modal移行", () => {
  it("CreateItemModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<EquipmentManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "備品・設備を追加" })).toBeInTheDocument();
  });

  it("CreateItemModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<EquipmentManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでCreateItemModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<EquipmentManagement />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
