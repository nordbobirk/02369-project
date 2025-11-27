import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddTattooControls } from "../AddTattoo";

describe("AddTattooControls", () => {
  it("renders the add tattoo button", () => {
    const mockAddTattoo = jest.fn();
    render(<AddTattooControls addTattoo={mockAddTattoo} />);

    const button = screen.getByRole("button", {
      name: /Tilføj endnu en tatovering/i,
    });

    expect(button).toBeInTheDocument();
  });

  it("renders the description text", () => {
    const mockAddTattoo = jest.fn();
    render(<AddTattooControls addTattoo={mockAddTattoo} />);

    expect(
      screen.getByText(/Du kan tilføje andre tatoveringer til samme booking/i)
    ).toBeInTheDocument();
  });

  it("calls addTattoo when the button is clicked", () => {
    const mockAddTattoo = jest.fn();
    render(<AddTattooControls addTattoo={mockAddTattoo} />);

    const button = screen.getByRole("button", {
      name: /Tilføj endnu en tatovering/i,
    });

    fireEvent.click(button);

    expect(mockAddTattoo).toHaveBeenCalledTimes(1);
  });
});
