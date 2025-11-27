import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../DatePicker";
import { estimateTime } from "../Form";

// Mock Calendar20
jest.mock("../../../../../components/ui/calendar-time-slots", () => ({
  Calendar20: ({ onDateTimeChange, onAvailabilityChange, desiredDuration }: any) => (
    <div data-testid="calendar20">
      <button onClick={() => onDateTimeChange(new Date("2025-01-01T10:00:00Z"))}>
        trigger-date
      </button>
      <button onClick={() => onAvailabilityChange(true)}>trigger-availability</button>
      <span data-testid="duration">{desiredDuration}</span>
    </div>
  ),
}));

// Mock estimateTime so we don't depend on implementation
jest.mock("../Form", () => ({
  ...jest.requireActual("../Form"),
  estimateTime: jest.fn(() => 120),
}));

describe("DatePicker", () => {
  const mockHandleChange = jest.fn();
  const mockAvailability = jest.fn();

  const formData = {
    dateTime: new Date(),
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    isFirstTattoo: false,
    tattoos: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders heading and info button", () => {
    render(
      <DatePicker
        formData={formData}
        handleInputChange={mockHandleChange}
        onAvailabilityChange={mockAvailability}
      />
    );

    expect(
      screen.getByRole("heading", { name: /vælg dato for booking/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /calendar info/i })).toBeInTheDocument();
  });

  it("renders Calendar20 and passes duration from estimateTime", () => {
    render(
      <DatePicker
        formData={formData}
        handleInputChange={mockHandleChange}
        onAvailabilityChange={mockAvailability}
      />
    );

    expect(screen.getByTestId("calendar20")).toBeInTheDocument();
    expect(screen.getByTestId("duration")).toHaveTextContent("120"); // mocked returned value
    expect(estimateTime).toHaveBeenCalledWith(formData);
  });

  it("calls handleInputChange when Calendar20 triggers onDateTimeChange", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        formData={formData}
        handleInputChange={mockHandleChange}
        onAvailabilityChange={mockAvailability}
      />
    );

    await user.click(screen.getByText("trigger-date"));

    expect(mockHandleChange).toHaveBeenCalledTimes(1);

    const callArg = mockHandleChange.mock.calls[0][0];
    expect(callArg.target.name).toBe("dateTime");
    expect(callArg.target.value instanceof Date).toBe(true);
  });

  it("calls onAvailabilityChange when Calendar20 triggers onAvailabilityChange", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        formData={formData}
        handleInputChange={mockHandleChange}
        onAvailabilityChange={mockAvailability}
      />
    );

    await user.click(screen.getByText("trigger-availability"));

    expect(mockAvailability).toHaveBeenCalledWith(true);
    expect(mockAvailability).toHaveBeenCalledTimes(1);
  });
});
