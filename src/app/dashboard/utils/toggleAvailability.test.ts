import { toggleAvailabilityLocal } from "./toggleAvailability";

describe("toggleAvailabilityLocal", () => {
  test("toggles from false to true", () => {
    const before = { "2025-01-03": false };
    const after = toggleAvailabilityLocal(before, "2025-01-03");

    expect(after["2025-01-03"]).toBe(true);
  });

  test("toggles from true to false", () => {
    const before = { "2025-01-03": true };
    const after = toggleAvailabilityLocal(before, "2025-01-03");

    expect(after["2025-01-03"]).toBe(false);
  });

  test("adds new date if missing", () => {
    const before = {};
    const after = toggleAvailabilityLocal(before, "2025-02-01");

    expect(after["2025-02-01"]).toBe(true);
  });

  test("does not change the original date", () => {
    const before = { "2025-01-03": false };
    toggleAvailabilityLocal(before, "2025-01-03");

    expect(before).toEqual({ "2025-01-03": false });
  });
});
