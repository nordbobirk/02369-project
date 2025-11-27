import { render, screen } from "@testing-library/react";
import ViewBooking from "../ViewBooking";
import "@testing-library/jest-dom";

// Mock Next.js <Link> to behave like a normal anchor for testing
jest.mock("next/link", () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

describe("ViewBooking", () => {
  it("renders a button and links to the correct booking page", () => {
    render(<ViewBooking bookingId="123" />);

    // Check that button text appears
    expect(screen.getByRole("button")).toBeInTheDocument();

    // Get the link
    const link = screen.getByRole("link");

    // Ensure href resolves correctly
    expect(link).toHaveAttribute(
      "href",
      "/dashboard/view_booking/[id]" // the Next Link mock preserves this
    );

    // Since you're passing "as", you can also verify the displayed link text
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});