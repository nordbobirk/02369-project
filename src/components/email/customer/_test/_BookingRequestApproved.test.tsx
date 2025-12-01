import { render, screen } from "@testing-library/react";
import BookingRequestApproved from "../BookingRequestApproved";

describe("BookingRequestApproved", () => {
  it("renders the email with correct title", () => {
    render(<BookingRequestApproved />);

    const title = screen.getAllByText(
      "Din bookinganmodning er blevet godkendt"
    );
    expect(title[0]).toBeInTheDocument();
  });
});
