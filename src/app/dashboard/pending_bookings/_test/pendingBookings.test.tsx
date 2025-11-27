import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookingTable, { columns } from "../BookingTable";
import { Booking } from "../../actions";

// Mock ViewBooking - avoids needing the full implementation
jest.mock("../../ViewBooking", () => {
    return function MockViewBooking({ bookingId }: any) {
        return <button data-testid={`view-${bookingId}`}>View</button>;
    };
});

// Mock duration formatter
jest.mock("../../utils/formatMinutes", () => ({
    formatMinutesHrsMins: (min: number) => `${min} min`,
}));

const mockData = [
    {
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        date_and_time: new Date(Date.now() + 100000).toISOString(), // future
        tattoos: [
            { estimated_duration: 90, estimated_price: 1000 },
            { estimated_duration: 30, estimated_price: 500 },
        ],
    },
    {
        id: "2",
        name: "Bob",
        email: "bob@example.com",
        date_and_time: new Date(Date.now() - 100000).toISOString(), // past
        tattoos: [
            { estimated_duration: 60, estimated_price: 700 },
        ],
    },
];

describe("BookingTable", () => {
    test("renders table with headers", () => {
        render(<BookingTable data={mockData as Booking[]} />);

        const headers = [
            "Dato",
            "Navn",
            "Email",
            "Samlet varighed",
            "Samlet pris",
            "Flere detaljer",
        ];

        headers.forEach(h =>
            expect(screen.getByText(h)).toBeInTheDocument()
        );
    });

    test("renders rows with calculated duration & price", () => {
        render(<BookingTable data={mockData as Booking[]} />);

        // Alice has 90 + 30 = 120 min
        expect(screen.getByText("120 min")).toBeInTheDocument();
        // Bob has 60 min
        expect(screen.getByText("60 min")).toBeInTheDocument();

        // Price totals
        expect(screen.getByText("1500kr")).toBeInTheDocument(); // Alice
        expect(screen.getByText("700kr")).toBeInTheDocument();  // Bob
    });

    test("shows 'Over dato' badge for past dates", () => {
        render(<BookingTable data={mockData as Booking[]} />);
        expect(screen.getByText("Over dato")).toBeInTheDocument();
    });

    test("renders ViewBooking buttons", () => {
        render(<BookingTable data={mockData as Booking[]} />);

        expect(screen.getByTestId("view-1")).toBeInTheDocument();
        expect(screen.getByTestId("view-2")).toBeInTheDocument();
    });

    test("filters rows by global filter", () => {
        render(<BookingTable data={mockData as Booking[]} />);

        const input = screen.getByPlaceholderText("Filter emails/navn...");

        // Search for "Alice"
        fireEvent.change(input, { target: { value: "Alice" } });

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });

    test("shows 'No results' when filter excludes all rows", () => {
        render(<BookingTable data={mockData as Booking[]} />);

        const input = screen.getByPlaceholderText("Filter emails/navn...");
        fireEvent.change(input, { target: { value: "ZZZ" } });

        expect(screen.getByText("No results.")).toBeInTheDocument();
    });

    test("sorts by date_and_time (future first, then past)", () => {
        render(<BookingTable data={mockData as Booking[]} />);

        // First row should be Alice (future)
        const firstRowName = screen.getAllByRole("cell")[1]; // name column in first row
        expect(firstRowName).toHaveTextContent("Alice");
    });
});
