import { render, screen } from "@testing-library/react";
import BookingRequestRejected from "../BookingRequestRejected";

describe("BookingRequestRejected", () => {

  it("renders the email with correct title", () => {
    render(<BookingRequestRejected rejectionReason=""/>);
    
    const title = screen.getAllByText("Din bookinganmodning er blevet afvist");
    expect(title[0]).toBeInTheDocument();
  });

});