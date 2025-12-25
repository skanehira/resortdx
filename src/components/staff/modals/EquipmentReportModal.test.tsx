import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EquipmentReportModal } from "./EquipmentReportModal";
import type { RoomAmenity, RoomEquipment } from "../../../types";

const mockAmenities: RoomAmenity[] = [
  {
    id: "am1",
    roomId: "R101",
    type: "toothbrush",
    stockLevel: "full",
    threshold: "low",
    lastCheckedAt: "2024-01-01",
    lastCheckedBy: null,
  },
];

const mockEquipment: RoomEquipment[] = [
  {
    id: "eq1",
    roomId: "R101",
    type: "air_conditioner",
    status: "working",
    lastMaintenanceAt: "2024-01-01",
    notes: null,
  },
];

describe("EquipmentReportModalの共通Modal移行", () => {
  it("EquipmentReportModalが共通Modalのrole=dialogを持つ", () => {
    render(
      <EquipmentReportModal
        roomId="R101"
        amenities={mockAmenities}
        equipment={mockEquipment}
        staffId="STF001"
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "設備・アメニティ確認" })).toBeInTheDocument();
  });

  it("EquipmentReportModalのコンテンツ領域がスクロール可能", () => {
    render(
      <EquipmentReportModal
        roomId="R101"
        amenities={mockAmenities}
        equipment={mockEquipment}
        staffId="STF001"
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでEquipmentReportModalが閉じる", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <EquipmentReportModal
        roomId="R101"
        amenities={mockAmenities}
        equipment={mockEquipment}
        staffId="STF001"
        onSubmit={vi.fn()}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("EquipmentReportModalにフッターが表示される", () => {
    render(
      <EquipmentReportModal
        roomId="R101"
        amenities={mockAmenities}
        equipment={mockEquipment}
        staffId="STF001"
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // 共通Modalを使用している場合、modal-footerが存在する
    const footer = screen.getByTestId("modal-footer");
    expect(footer).toBeInTheDocument();

    // フッター内にボタンがある
    expect(screen.getByRole("button", { name: "変更なし" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "報告" })).toBeInTheDocument();
  });
});
