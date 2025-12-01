/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";

// Import component
import FastSkema from "../page";

// ---- Correct Supabase mock path ----
jest.mock("../../../../../lib/supabase/client", () => ({
  initBrowserClient: jest.fn(),
}));

// ---- Correct availability mock path ----
jest.mock("../../availability/availabilityClient", () => ({
  getAvailability: jest.fn(),
}));

const { initBrowserClient } = require("../../../../../lib/supabase/client");
const { getAvailability } = require("../../availability/availabilityClient");

// Helper to mock supabase
function mockSupabase(bookingResult: any[]) {
  const mockClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  };

  // simulate supabase return object structure
  mockClient.select.mockReturnValue({
    eq: jest.fn().mockReturnValue({ data: bookingResult }),
  });

  (initBrowserClient as jest.Mock).mockReturnValue(mockClient);
}

describe("FastSkema component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders header 'Fast skema' after loading", async () => {
    mockSupabase([]);
    (getAvailability as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<FastSkema />);
    });

    expect(await screen.findByText("Fast skema")).toBeInTheDocument();
  });

  test("shows at least one 'Lukket' when a day is closed", async () => {
    const today = new Date().toISOString().split("T")[0];

    mockSupabase([]);
    (getAvailability as jest.Mock).mockResolvedValue([
      { date: today, is_open: false },
    ]);

    await act(async () => {
      render(<FastSkema />);
    });

    // Many cells may say "Lukket" — that's fine.
    const closedCells = await screen.findAllByText("Lukket");
    expect(closedCells.length).toBeGreaterThan(0);
  });

  test("shows booking name when day is open and booking exists", async () => {
    const today = new Date().toISOString().split("T")[0];

    mockSupabase([
      {
        id: 1,
        name: "Marcus",
        date_and_time: new Date().setHours(8),
        status: "confirmed",
      },
    ]);

    (getAvailability as jest.Mock).mockResolvedValue([
      { date: today, is_open: true },
    ]);

    await act(async () => {
      render(<FastSkema />);
    });

    expect(await screen.findByText("Marcus")).toBeInTheDocument();
  });
});
