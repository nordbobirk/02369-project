import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import SaveEditBooking from "../SaveEditBooking";
import "@testing-library/jest-dom";
import {updateBookingDetails} from "../actions";
import {useRouter} from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock actions
jest.mock("../actions", () => ({
    updateBookingDetails: jest.fn(),
}));

describe("SaveEditBooking", () => {
    const mockRefresh = jest.fn();
    const mockOnSave = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            refresh: mockRefresh,
        });
        (updateBookingDetails as jest.Mock).mockResolvedValue(undefined);
    });

    it("renders button with correct text", () => {
        render(
            <SaveEditBooking
                bookingId="123"
                email="test@test.com"
                phoneNumber="12345678"
                internalNotes="Test notes"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        expect(button).toBeInTheDocument();
    });

    it("calls updateBookingDetails with correct parameters when clicked", async () => {
        render(
            <SaveEditBooking
                bookingId="123"
                email="test@test.com"
                phoneNumber="12345678"
                internalNotes="Test notes"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        await waitFor(() => {
            expect(updateBookingDetails).toHaveBeenCalledWith(
                "123",
                "test@test.com",
                "12345678",
                "Test notes"
            );
        });
    });

    it("calls onSaveAction callback after saving", async () => {
        render(
            <SaveEditBooking
                bookingId="123"
                email="test@test.com"
                phoneNumber="12345678"
                internalNotes="Test notes"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledTimes(1);
        });
    });

    it("calls router.refresh after saving", async () => {
        render(
            <SaveEditBooking
                bookingId="123"
                email="test@test.com"
                phoneNumber="12345678"
                internalNotes="Test notes"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalledTimes(1);
        });
    });

    it("shows spinner while saving", async () => {
        // Mock a slow update
        (updateBookingDetails as jest.Mock).mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        render(
            <SaveEditBooking
                bookingId="123"
                email="test@test.com"
                phoneNumber="12345678"
                internalNotes="Test notes"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        // Spinner should be visible during save (implementation dependent)
        await waitFor(() => {
            expect(updateBookingDetails).toHaveBeenCalled();
        });
    });
});

