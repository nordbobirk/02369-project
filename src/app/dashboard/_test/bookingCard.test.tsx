import { render, screen } from "@testing-library/react";
import BookingCard from "../bookingCard";

// Mock utils so the test is stable
jest.mock("../utils/getTimeUntilBooking", () => ({
    getTimeUntilBooking: () => "2 dage tilbage",
}));
jest.mock("../utils/formatMinutes", () => ({
    formatMinutesHrsMins: (mins: number) => `formatted(${mins})`,
}));

// mocking viewBooking, since we have tests for internals elsewhere
jest.mock("../ViewBooking", () => () => <div data-testid="mock-viewbooking" />);


const mockBooking = {
    id: "booking-1",
    name: "Jonas",
    date_and_time: "2025-03-01T10:00:00Z",
    tattoos: [
        { estimated_duration: 60 },
        { estimated_duration: 45 },
    ],
};

describe("<BookingCard />", () => {
    it("renders booking name", () => {
        render(<BookingCard booking={mockBooking as any} />);
        expect(screen.getByText("Booking til Jonas")).toBeInTheDocument();
    });

    it("renders total duration", () => {
        render(<BookingCard booking={mockBooking as any} />);
        expect(screen.getByText("Samlet varighed: formatted(105)")).toBeInTheDocument();
    });

    it("shows relative time until booking", () => {
        render(<BookingCard booking={mockBooking as any} />);
        expect(screen.getByText("2 dage tilbage")).toBeInTheDocument();
    });

    it("renders fallback when no tattoos exist", () => {
        render(<BookingCard booking={{ ...mockBooking, tattoos: [] } as any} />);
        expect(screen.getByText("Ingen tatovering med booking")).toBeInTheDocument();
    });

    it("renders the ViewBooking component", () => {
        render(<BookingCard booking={mockBooking as any} />);
        expect(screen.getByTestId("mock-viewbooking")).toBeInTheDocument();
    })

});