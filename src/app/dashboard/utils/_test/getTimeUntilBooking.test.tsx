import { getTimeUntilBooking } from "../getTimeUntilBooking";

// Helper to freeze time in tests
const mockNow = (isoString: string) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(isoString));
};

describe("getTimeUntilBooking", () => {

    afterEach(() => {
        jest.useRealTimers();
    });

    test("returns 'Bookingen er startet' when booking time is in the past", () => {
        mockNow("2024-01-01T12:00:00Z");

        expect(getTimeUntilBooking("2024-01-01T11:00:00Z"))
            .toBe("Bookingen er startet");
    });

    test("returns 'Bookingen er startet' when booking time is exactly now", () => {
        mockNow("2024-01-01T12:00:00Z");

        expect(getTimeUntilBooking("2024-01-01T12:00:00Z"))
            .toBe("Bookingen er startet");
    });

    test("correctly calculates minutes until booking", () => {
        mockNow("2024-01-01T12:00:00Z");

        // 30 minutes later
        expect(getTimeUntilBooking("2024-01-01T12:30:00Z"))
            .toBe("0 Dage, 0 Timer, 30 Minuter indtil bookingen");
    });

    test("correctly calculates hours until booking", () => {
        mockNow("2024-01-01T12:00:00Z");

        // 2 hours later
        expect(getTimeUntilBooking("2024-01-01T14:00:00Z"))
            .toBe("0 Dage, 2 Timer, 0 Minuter indtil bookingen");
    });

    test("correctly calculates days, hours and minutes", () => {
        mockNow("2024-01-01T00:00:00Z");

        // 1 day, 3 hours, 15 minutes later
        expect(getTimeUntilBooking("2024-01-02T03:15:00Z"))
            .toBe("1 Dage, 3 Timer, 15 Minuter indtil bookingen");
    });

    test("handles multi-day difference", () => {
        mockNow("2024-01-01T00:00:00Z");

        // 3 days + 10 hours + 5 minutes
        expect(getTimeUntilBooking("2024-01-04T10:05:00Z"))
            .toBe("3 Dage, 10 Timer, 5 Minuter indtil bookingen");
    });

    test("handles minute rounding (flooring)", () => {
        mockNow("2024-01-01T00:00:00.000Z");

        // 1 minute and 40 seconds later → floor to 1 minute
        expect(getTimeUntilBooking("2024-01-01T00:01:40.000Z"))
            .toBe("0 Dage, 0 Timer, 1 Minuter indtil bookingen");
    });
});
