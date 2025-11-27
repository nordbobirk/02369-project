import { formatPhoneNumber } from "../formatPhoneNumber";

describe("formatPhoneNumber", () => {
    test("formats a valid phone number without spaces", () => {
        expect(formatPhoneNumber("+4512345678")).toBe("+45 12 34 56 78");
    });

    test("formats a valid phone number with an existing space after country code", () => {
        expect(formatPhoneNumber("+45 12345678")).toBe("+45 12 34 56 78");
    });

    test("returns the same string if input is already formatted", () => {
        expect(formatPhoneNumber("+45 12 34 56 78")).toBe("+45 12 34 56 78");
    });

    test("returns original input if it does not match expected pattern", () => {
        expect(formatPhoneNumber("12345678")).toBe("12345678");        // no country code
        expect(formatPhoneNumber("+451234567")).toBe("+451234567");    // too short
        expect(formatPhoneNumber("+45123456789")).toBe("+45123456789");// too long
        expect(formatPhoneNumber("+AB12345678")).toBe("+AB12345678");  // non-numeric
        expect(formatPhoneNumber("+45-12-34-56-78")).toBe("+45-12-34-56-78");
    });

    test("handles weird but technically matching inputs", () => {
        expect(formatPhoneNumber("+9912345678")).toBe("+99 12 34 56 78");
    });

    test("does not modify country codes with more than 2 digits", () => {
        // Regex explicitly requires exactly 2 digits after "+"
        expect(formatPhoneNumber("+12312345678")).toBe("+12312345678");
    });
});
