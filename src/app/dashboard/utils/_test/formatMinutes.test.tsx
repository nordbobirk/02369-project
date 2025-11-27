import { formatMinutesHrsMins } from "../formatMinutes";

describe("formatMinutesHrsMins", () => {
    test("returns '0 minutter' for undefined or null", () => {
        expect(formatMinutesHrsMins()).toBe("0 minutter");
        expect(formatMinutesHrsMins(null as any)).toBe("0 minutter");
    });

    test("returns '0 minutter' for empty string", () => {
        expect(formatMinutesHrsMins("")).toBe("0 minutter");
        expect(formatMinutesHrsMins("   ")).toBe("0 minutter");
    });

    test("returns '0 minutter' for invalid strings", () => {
        expect(formatMinutesHrsMins("abc")).toBe("0 minutter");
        expect(formatMinutesHrsMins("!@#")).toBe("0 minutter");
        expect(formatMinutesHrsMins("-5")).toBe("0 minutter");
    });

    test("parses comma-separated string numbers", () => {
        expect(formatMinutesHrsMins("90,0")).toBe("1 time, 30 minutter");
        expect(formatMinutesHrsMins("1,0")).toBe("1 minut");
    });

    test("returns '0 minutter' for non-positive numbers", () => {
        expect(formatMinutesHrsMins(0)).toBe("0 minutter");
        expect(formatMinutesHrsMins(-10)).toBe("0 minutter");
        expect(formatMinutesHrsMins(NaN)).toBe("0 minutter");
    });

    test("formats minutes < 60 correctly", () => {
        expect(formatMinutesHrsMins(1)).toBe("1 minut");
        expect(formatMinutesHrsMins(5)).toBe("5 minutter");
        expect(formatMinutesHrsMins(59)).toBe("59 minutter");
    });

    test("formats exactly 1 hour", () => {
        expect(formatMinutesHrsMins(60)).toBe("1 time");
    });

    test("formats hours + minutes correctly", () => {
        expect(formatMinutesHrsMins(61)).toBe("1 time, 1 minut");
        expect(formatMinutesHrsMins(75)).toBe("1 time, 15 minutter");
        expect(formatMinutesHrsMins(135)).toBe("2 timer, 15 minutter");
    });

    test("handles float-like strings by flooring the value", () => {
        expect(formatMinutesHrsMins("90.9")).toBe("1 time, 30 minutter");
        expect(formatMinutesHrsMins("60.5")).toBe("1 time");
    });

    test("handles float numbers by flooring the value", () => {
        expect(formatMinutesHrsMins(90.9)).toBe("1 time, 30 minutter");
    });
});
