import { formatDateTime } from "../formatDateTime";

describe("formatDateTime", () => {
    test("returns em dash when no input is provided", () => {
        expect(formatDateTime()).toBe("—");
    });

    test("returns em dash for invalid date string", () => {
        expect(formatDateTime("not-a-date")).toBe("—");
    });

    test("formats a valid ISO string in Europe/Copenhagen timezone", () => {
        // 2024-01-15T13:45:00Z is 14:45 in Europe/Copenhagen during winter (UTC+1)
        const input = "2024-01-15T13:45:00Z";
        expect(formatDateTime(input)).toBe("15-01/2024, 14:45");
    });

    test("formats a Date object correctly", () => {
        // 2024-06-15T12:00:00Z is 14:00 in Europe/Copenhagen during summer (UTC+2)
        const date = new Date("2024-06-15T12:00:00Z");
        expect(formatDateTime(date)).toBe("15-06/2024, 14:00");
    });

    test("pads single-digit fields with leading zeros", () => {
        // 2024-03-05T07:05:00Z → 08:05 in Copenhagen (UTC+1)
        const date = "2024-03-05T07:05:00Z";
        expect(formatDateTime(date)).toBe("05-03/2024, 08:05");
    });

    test("handles edge case around midnight", () => {
        // 2024-02-01T22:30:00Z → 23:30 Copenhagen (UTC+1)
        const date = "2024-02-01T22:30:00Z";
        expect(formatDateTime(date)).toBe("01-02/2024, 23:30");
    });
});
