import { render, screen } from "@testing-library/react";
import BookingRequestApproved from "../BookingRequestApproved";

describe("BookingRequestApproved", () => {
  const mockManageBookingLink = "https://example.com/manage/booking123";

  it("renders the email with correct title", () => {
    render(<BookingRequestApproved manageBookingLink={mockManageBookingLink} />);
    
    const title = screen.getAllByText("Din bookinganmodning er blevet godkendt");
    expect(title[0]).toBeInTheDocument();
  });

});