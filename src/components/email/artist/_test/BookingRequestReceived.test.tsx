import { render, screen } from "@testing-library/react";
import BookingRequestReceived from "../BookingRequestReceived";

describe("BookingRequestReceived", () => {
  

  it("renders the email with correct title", () => {
    render(<BookingRequestReceived bookingRequestId="123" customerName="John Test" bookingTime="10:00" />);
    
    const title = screen.getAllByText("Ny bookinganmodning");
    expect(title[0]).toBeInTheDocument();
  });

});