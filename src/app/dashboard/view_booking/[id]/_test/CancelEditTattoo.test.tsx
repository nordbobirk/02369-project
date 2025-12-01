import {render, screen, fireEvent} from "@testing-library/react";
import CancelEditTattoo from "../CancelEditTattoo";
import "@testing-library/jest-dom";

describe("CancelEditTattoo", () => {
    it("renders button with correct text", () => {
        const mockOnCancel = jest.fn();
        render(<CancelEditTattoo onCancelAction={mockOnCancel}/>);

        const button = screen.getByRole("button", {name: /fortryd/i});
        expect(button).toBeInTheDocument();
    });

    it("calls onCancelAction when clicked", () => {
        const mockOnCancel = jest.fn();
        render(<CancelEditTattoo onCancelAction={mockOnCancel}/>);

        const button = screen.getByRole("button", {name: /fortryd/i});
        fireEvent.click(button);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});

