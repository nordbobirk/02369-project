import {render, screen, fireEvent} from "@testing-library/react";
import EditBooking from "./EditBooking";
import "@testing-library/jest-dom";

describe("EditBooking", () => {
    it("renders button", () => {
        const mockOnEdit = jest.fn();
        render(<EditBooking onEditAction={mockOnEdit}/>);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("calls onEditAction when clicked", () => {
        const mockOnEdit = jest.fn();
        render(<EditBooking onEditAction={mockOnEdit}/>);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
});

