import { render, screen } from "@testing-library/react";
import BookingCancelledByCustomer from "../BookingCancelledByCustomer";

describe("BookingCancelledByCustomer", () => {
  const mockManageBookingLink = "https://example.com/manage/booking123";

  it("renders the email with correct title", () => {
    render(<BookingCancelledByCustomer bookingRequestId="123" customerName="John Test" bookingTime="10:00"/>);
    
    const title = screen.getAllByText("Booking aflyst");
    expect(title[0]).toBeInTheDocument();
  });


});