import {render, screen, fireEvent} from "@testing-library/react";
import EditTattoo from "./EditTattoo";
import "@testing-library/jest-dom";

describe("EditTattoo", () => {
    it("renders button", () => {
        const mockOnEdit = jest.fn();
        render(<EditTattoo onEditAction={mockOnEdit}/>);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("calls onEditAction when clicked", () => {
        const mockOnEdit = jest.fn();
        render(<EditTattoo onEditAction={mockOnEdit}/>);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
});

