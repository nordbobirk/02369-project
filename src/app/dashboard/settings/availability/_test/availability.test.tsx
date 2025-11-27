/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AvailabilityPage from "../page";

// ----  mock paths ----
jest.mock("../availabilityClient", () => ({
  getAvailability: jest.fn(),
  toggleAvailability: jest.fn(),
}));

const { getAvailability, toggleAvailability } = require("../availabilityClient");

function mockAvailability(data: any[]) {
  (getAvailability as jest.Mock).mockResolvedValue(data);
}

describe("AvailabilityPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders calendar days after loading", async () => {
    mockAvailability([]);

    await act(async () => {
      render(<AvailabilityPage />);
    });

    expect(await screen.findByText("Vælg din tilgængelighed")).toBeInTheDocument();

    const days = await screen.findAllByRole("button", { name: /\d+/ });
    expect(days.length).toBeGreaterThanOrEqual(28);
  });

  test("clicking a day toggles it and shows 'Gem ændringer'", async () => {
    mockAvailability([]);

    await act(async () => {
      render(<AvailabilityPage />);
    });

    await screen.findByText("Vælg din tilgængelighed");

    const day1 = await screen.findByRole("button", { name: "1" });
    fireEvent.mouseDown(day1);

    expect(await screen.findByText("Gem ændringer")).toBeInTheDocument();
  });

  test("swiping toggles multiple days", async () => {
    mockAvailability([]);

    await act(async () => {
      render(<AvailabilityPage />);
    });

    await screen.findByText("Vælg din tilgængelighed");

    const day1 = await screen.findByRole("button", { name: "1" });
    const day2 = await screen.findByRole("button", { name: "2" });

    // Mock elementFromPoint to return day2 during swipe
    document.elementFromPoint = jest.fn(() => day2);

    // start swipe
    fireEvent.mouseDown(day1);

    // swipe over day2
    fireEvent.mouseMove(day2);

    expect(await screen.findByText("Gem ændringer")).toBeInTheDocument();
  });

  test("saving sends toggleAvailability requests", async () => {
    mockAvailability([{ date: "2025-01-01", is_open: false }]);

    await act(async () => {
      render(<AvailabilityPage />);
    });

    await screen.findByText("Vælg din tilgængelighed");

    const day1 = await screen.findByRole("button", { name: "1" });
    fireEvent.mouseDown(day1);

    const saveButton = await screen.findByText("Gem ændringer");
    fireEvent.click(saveButton);

    expect(toggleAvailability).toHaveBeenCalledTimes(1);

    expect(await screen.findByText("Ændringerne er nu gemt!")).toBeInTheDocument();
  });
});
