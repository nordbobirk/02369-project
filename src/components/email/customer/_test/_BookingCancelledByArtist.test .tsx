import { render, screen } from "@testing-library/react";
import BookingCancelledByArtist from "../BookingCancelledByArtist";

describe("BookingCancelledByArtist", () => {
  

  it("renders the email with correct title", () => {
    render(<BookingCancelledByArtist  bookingTime={""} />);
    
    const title = screen.getAllByText("Din booking er blevet aflyst");
    expect(title[0]).toBeInTheDocument();
  });

  
});