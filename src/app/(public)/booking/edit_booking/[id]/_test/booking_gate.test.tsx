import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingGate from "../BookingGate";
import { validateBookingOtp } from "../actions";

// --- MOCK THE SERVER ACTION ---
jest.mock("../actions", () => ({
  validateBookingOtp: jest.fn(),
}));

describe("BookingGate Component", () => {
  const mockBookingId = "booking-123";
  const SensitiveContent = () => <div data-testid="secret-content">Secret Booking Data</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the lock screen initially and hides children", () => {
    render(
      <BookingGate bookingId={mockBookingId}>
        <SensitiveContent />
      </BookingGate>
    );

    // Check that lock screen elements are present
    expect(screen.getByText("Sikkerhedsbekræftelse")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123456")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lås booking op/i })).toBeInTheDocument();

    // CRITICAL: Ensure the children are NOT rendered
    expect(screen.queryByTestId("secret-content")).not.toBeInTheDocument();
  });

  it("allows user to type into the input field", () => {
    render(
      <BookingGate bookingId={mockBookingId}>
        <SensitiveContent />
      </BookingGate>
    );

    const input = screen.getByPlaceholderText("123456") as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "654321" } });
    
    expect(input.value).toBe("654321");
  });

  it("reveals the children upon successful validation", async () => {
    // 1. Mock success response
    (validateBookingOtp as jest.Mock).mockResolvedValue({ success: true });

    render(
      <BookingGate bookingId={mockBookingId}>
        <SensitiveContent />
      </BookingGate>
    );

    // 2. Enter code
    const input = screen.getByPlaceholderText("123456");
    fireEvent.change(input, { target: { value: "111111" } });

    // 3. Submit
    const button = screen.getByRole("button", { name: /Lås booking op/i });
    fireEvent.click(button);

    // 4. Verify loading state (optional, but good practice)
    expect(screen.getByText("Bekræfter...")).toBeInTheDocument();

    // 5. Wait for the secret content to appear
    await waitFor(() => {
      expect(screen.getByTestId("secret-content")).toBeInTheDocument();
    });

    // 6. Verify the lock screen is gone
    expect(screen.queryByText("Sikkerhedsbekræftelse")).not.toBeInTheDocument();

    // 7. Verify correct args sent to backend
    expect(validateBookingOtp).toHaveBeenCalledWith(mockBookingId, "111111");
  });

  it("shows an error message and keeps children hidden on failure", async () => {
    // 1. Mock failure response
    (validateBookingOtp as jest.Mock).mockResolvedValue({ 
      success: false, 
      message: "Ugyldig kode" // Custom backend message
    });

    render(
      <BookingGate bookingId={mockBookingId}>
        <SensitiveContent />
      </BookingGate>
    );

    // 2. Enter code and submit
    fireEvent.change(screen.getByPlaceholderText("123456"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /Lås booking op/i }));

    // 3. Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Ugyldig kode")).toBeInTheDocument();
    });

    // 4. Ensure secret content is STILL hidden
    expect(screen.queryByTestId("secret-content")).not.toBeInTheDocument();
  });

  it("shows default fallback error if backend returns no message", async () => {
    (validateBookingOtp as jest.Mock).mockResolvedValue({ 
      success: false, 
      message: null 
    });

    render(
      <BookingGate bookingId={mockBookingId}>
        <SensitiveContent />
      </BookingGate>
    );

    fireEvent.change(screen.getByPlaceholderText("123456"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /Lås booking op/i }));

    await waitFor(() => {
      // Expecting the hardcoded fallback in your component
      expect(screen.getByText("Forkert kode")).toBeInTheDocument();
    });
  });

  it("disables the button while loading", async () => {
    // Create a promise that doesn't resolve immediately to simulate network delay
    (validateBookingOtp as jest.Mock).mockImplementation(() => new Promise(() => {})); 

    render(
      <BookingGate bookingId={mockBookingId}>
        <SensitiveContent />
      </BookingGate>
    );

    fireEvent.change(screen.getByPlaceholderText("123456"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /Lås booking op/i }));

    // Check button state immediately after click
    const button = screen.getByRole("button", { name: /Bekræfter.../i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });
});