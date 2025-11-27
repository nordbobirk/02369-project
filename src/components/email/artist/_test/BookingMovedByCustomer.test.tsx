import { render, screen } from "@testing-library/react";
import BookingMovedByCustomer from "../BookingMovedByCustomer";

describe("BookingMovedByCustomer", () => {

  it("renders the email with correct title", () => {
    render(<BookingMovedByCustomer bookingRequestId="123" customerName="John Test" bookingTime="10:00"/>);
    
    const title = screen.getAllByText("Booking flyttet");
    expect(title[0]).toBeInTheDocument();
  });

});