import { render, screen } from "@testing-library/react";
import BookingRequestReceived from "../BookingRequestReceived";

describe("BookingRequestReceived", () => {
  const mockManageBookingLink = "https://example.com/manage/booking123";

  it("renders the email with correct title", () => {
    render(<BookingRequestReceived manageBookingLink={mockManageBookingLink} />);
    
    const title = screen.getAllByText("Din bookinganmodning er modtaget");
    expect(title[0]).toBeInTheDocument();
  });

  it("displays confirmation message about payment", () => {
    render(<BookingRequestReceived manageBookingLink={mockManageBookingLink} />);
    
    const confirmationText = screen.getByText(/Jeg har modtaget din bookinganmodning/i);
    expect(confirmationText).toBeInTheDocument();
    expect(confirmationText).toHaveTextContent("ordrenummer #12345");
  });
});