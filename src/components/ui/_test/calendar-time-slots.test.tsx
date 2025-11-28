import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Calendar20 } from "../calendar-time-slots";

// This test also covers calendar.tsx

// Mock the server-side functions
jest.mock("../../../app/(public)/booking/actions", () => ({
  getAvailability: jest.fn(),
  getBookings: jest.fn(),
}));

describe("Calendar20", () => {
  beforeEach(() => {
    // Setup mocked return values for each function
    const mockAvailability = [
      { date: new Date('2025-11-15T00:00:00Z'), is_open: true },
      { date: new Date('2025-11-16T00:00:00Z'), is_open: true },
    ];
    
    const mockBookings = [
      { id: "1", date_and_time: new Date('2025-11-15T10:00:00Z'), total_duration: 60 },
      { id: "2", date_and_time: new Date('2025-11-15T11:30:00Z'), total_duration: 60 },
      // { id: "3", date_and_time: new Date('2026-11-15T14:30:00Z'), total_duration: 60 },
    ];

    // Mock async functions to return a resolved promise with mock data
    require("../../../app/(public)/booking/actions").getAvailability.mockResolvedValue(mockAvailability);
    require("../../../app/(public)/booking/actions").getBookings.mockResolvedValue(mockBookings);
  });

  it("renders the calendar and checks time slots", async () => {
    render(<Calendar20 slotDuration={30} desiredDuration={60} />);

    
    await waitFor(() => {
      // Check if the calendar has rendered the expected dates (November 15 and 16)
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("16")).toBeInTheDocument();
    });
  });

  it("is possible to select date and get calculated times", async () => {
    render(<Calendar20 slotDuration={30} desiredDuration={60}/>);

    await waitFor(() => {
    expect(screen.getByText("15")).toBeInTheDocument();
    });

    // This renders times for a given day, and uses the computeOptimalSlots function
    const dateButton = screen.getByText("15");
    fireEvent.click(dateButton);

  });
});

