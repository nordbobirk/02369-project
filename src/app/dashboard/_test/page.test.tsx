import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";
import {
    getLimitedBookingsAfterDate,
    getLimitedOldBookings,
} from "../actions";

jest.mock("../actions", () => ({
    getLimitedBookingsAfterDate: jest.fn(),
    getLimitedOldBookings: jest.fn(),
}));

beforeAll(() => {
    class IntersectionObserverMock {
        callback: any;
        constructor(cb: any) {
            this.callback = cb;
        }
        observe() {
            this.callback([{ isIntersecting: true }]); // immediately trigger
        }
        unobserve() { }
        disconnect() { }
    }
    // @ts-ignore
    global.IntersectionObserver = IntersectionObserverMock;
});

describe("Home bookings page", () => {
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);

    beforeEach(() => {
        (getLimitedBookingsAfterDate as jest.Mock).mockReset();
        (getLimitedOldBookings as jest.Mock).mockReset();
    });

    test("always renders the 'I dag' section", async () => {
        (getLimitedBookingsAfterDate as jest.Mock).mockResolvedValue([]);

        render(<Home />);

        expect(await screen.findByText("I dag")).toBeInTheDocument();
    });

    test("shows 'Ingen bookinger i dag.' when there are none today", async () => {
        (getLimitedBookingsAfterDate as jest.Mock).mockResolvedValue([]);

        render(<Home />);

        expect(
            await screen.findByText("Ingen bookinger i dag.")
        ).toBeInTheDocument();
    });

    test("renders bookings returned from getLimitedBookingsAfterDate", async () => {
        (getLimitedBookingsAfterDate as jest.Mock).mockResolvedValue([
            {
                id: 1,
                date_and_time: new Date().toISOString(),
                name: "Test User",
            },
        ]);

        render(<Home />);

        // Wait for BookingCard to render. Using regex to look for "Test User" substring
        expect(await screen.findByText(/Test User/)).toBeInTheDocument();

        // Confirm "Ingen bookinger i dag." is gone
        expect(screen.queryByText("Ingen bookinger i dag.")).not.toBeInTheDocument();
    });

    test("shows 'Ikke flere bookinger.' when no more bookings are available", async () => {
        (getLimitedBookingsAfterDate as jest.Mock)
            .mockResolvedValueOnce([
                {
                    id: 1,
                    date_and_time: new Date().toISOString(),
                    name: "Some booking",
                },
            ])
            .mockResolvedValueOnce([]); // no more

        render(<Home />);

        // wait for the NO MORE response to be processed
        await waitFor(() =>
            expect(screen.getByText("Ikke flere bookinger.")).toBeInTheDocument()
        );
    });

    test("renders today's and future bookings under correct date headings", async () => {
        (getLimitedBookingsAfterDate as jest.Mock).mockResolvedValue([
            { id: 1, name: "Today Booking", date_and_time: today.toISOString() },
            { id: 2, name: "Tomorrow Booking", date_and_time: tomorrow.toISOString() },
        ]);

        render(<Home />);

        // Today heading is "I dag"
        expect(await screen.findByText("I dag")).toBeInTheDocument();

        // Future date heading
        const tomorrowKey = tomorrow.toLocaleDateString("da-DK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        expect(await screen.findByText(tomorrowKey)).toBeInTheDocument();

        // Booking names
        expect(await screen.findByText(/Today Booking/)).toBeInTheDocument();
        expect(await screen.findByText(/Tomorrow Booking/)).toBeInTheDocument();

        // "Ingen bookinger i dag." is gone
        expect(screen.queryByText("Ingen bookinger i dag.")).not.toBeInTheDocument();
    });

    test("loads and displays old bookings when clicking 'Vis gamle bookinger'", async () => {
        (getLimitedBookingsAfterDate as jest.Mock).mockResolvedValue([]);
        (getLimitedOldBookings as jest.Mock).mockResolvedValue([
            {
                id: 10,
                name: "Old Booking",
                date_and_time: new Date("2020-01-01").toISOString(),
            },
        ]);

        render(<Home />);

        const button = await screen.findByRole("button", {
            name: /vis gamle bookinger/i,
        });

        await userEvent.click(button);

        expect(await screen.findByText(/Old Booking/)).toBeInTheDocument();
    });
});

