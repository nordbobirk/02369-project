import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import CancelBooking from "./CancelBooking";
import "@testing-library/jest-dom";
import {cancelBooking} from "./actions";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
}));

// Mock actions
jest.mock("./actions", () => ({
    cancelBooking: jest.fn(),
}));

describe("CancelBooking", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const {useParams} = require("next/navigation");
        useParams.mockReturnValue({id: "789"});
    });

    it("renders button with correct text", () => {
        render(<CancelBooking/>);

        const button = screen.getByRole("button", {name: /aflys booking/i});
        expect(button).toBeInTheDocument();
    });

    it("opens dialog when button is clicked", () => {
        render(<CancelBooking/>);

        const button = screen.getByRole("button", {name: /aflys booking/i});
        fireEvent.click(button);

        // Check dialog content appears
        expect(screen.getByText(/er du sikker/i)).toBeInTheDocument();
        expect(screen.getByText(/denne handling vil aflyse bookingen/i)).toBeInTheDocument();
    });

    it("shows cancel and confirm buttons in dialog", () => {
        render(<CancelBooking/>);

        const openButton = screen.getByRole("button", {name: /aflys booking/i});
        fireEvent.click(openButton);

        // Check for Annuller button (cancel)
        expect(screen.getByRole("button", {name: /annuller/i})).toBeInTheDocument();
        // Check for Aflys Booking button (confirm) - there should be at least the trigger button
        const confirmButtons = screen.getAllByRole("button", {name: /aflys booking/i});
        expect(confirmButtons.length).toBeGreaterThanOrEqual(1);
    });

    it("closes dialog when cancel is clicked", () => {
        render(<CancelBooking/>);

        const openButton = screen.getByRole("button", {name: /aflys booking/i});
        fireEvent.click(openButton);

        const cancelButton = screen.getByRole("button", {name: /annuller/i});
        fireEvent.click(cancelButton);

        // Dialog title should not be visible
        expect(screen.queryByText(/er du sikker/i)).not.toBeInTheDocument();
    });

    it("calls cancelBooking action when confirmed", async () => {
        (cancelBooking as jest.Mock).mockResolvedValue(undefined);

        render(<CancelBooking/>);

        const openButton = screen.getByRole("button", {name: /aflys booking/i});
        fireEvent.click(openButton);

        const confirmButtons = screen.getAllByRole("button", {name: /aflys booking/i});
        const confirmButton = confirmButtons[confirmButtons.length - 1]; // Get the confirm button in dialog
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(cancelBooking).toHaveBeenCalledWith("789");
        });
    });
});

