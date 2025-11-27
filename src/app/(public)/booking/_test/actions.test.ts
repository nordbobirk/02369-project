import { getAvailability, getBookings } from "../actions";

// Mock the server client module used by actions.ts
jest.mock("../../../../lib/supabase/server", () => ({
  initServerClient: jest.fn(),
}));

const { initServerClient } = require("../../../../lib/supabase/server");

describe("Booking Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvailability", () => {
    it("should fetch availability entries from supabase with is_open=true filter", async () => {
      const availabilityMock = [
        { date: new Date("2025-01-01"), is_open: true },
        { date: new Date("2025-01-02"), is_open: true },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: availabilityMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getAvailability();

      expect(res).toEqual(availabilityMock);
    });

    it("should return empty array when no availability data exists", async () => {
      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getAvailability();

      expect(res).toEqual([]);
    });

    it("should call supabase with correct table and filters", async () => {
      const mockFrom = jest.fn();
      const mockSelect = jest.fn();
      const mockEq = jest.fn().mockResolvedValue({ data: [], error: null });

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq,
        }),
      });

      initServerClient.mockResolvedValue({ from: mockFrom });

      await getAvailability();

      expect(mockFrom).toHaveBeenCalledWith("Tilgængelighed");
      expect(mockSelect).toHaveBeenCalledWith("date, is_open");
      expect(mockEq).toHaveBeenCalledWith("is_open", true);
    });
  });

  describe("getBookings", () => {
    it("should fetch bookings with pending or confirmed status", async () => {
      const bookingsMock = [
        {
          id: "1",
          date_and_time: new Date("2025-01-02"),
          tattoos: [
            { estimated_duration: 30 },
            { estimated_duration: 45 },
          ],
        },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: bookingsMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(1);
      expect(res[0].id).toBe("1");
    });

    it("should calculate total_duration by summing tattoo estimated_duration", async () => {
      const bookingsMock = [
        {
          id: "1",
          date_and_time: new Date("2025-01-02"),
          tattoos: [
            { estimated_duration: 30 },
            { estimated_duration: 45 },
          ],
        },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: bookingsMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(res[0].total_duration).toBe(75);
    });

    it("should handle booking with empty tattoos array", async () => {
      const bookingsMock = [
        {
          id: "2",
          date_and_time: new Date("2025-01-03"),
          tattoos: [],
        },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: bookingsMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(res[0].total_duration).toBe(0);
    });

    it("should handle booking with null tattoos", async () => {
      const bookingsMock = [
        {
          id: "3",
          date_and_time: new Date("2025-01-04"),
          tattoos: null,
        },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: bookingsMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(res[0].total_duration).toBe(0);
    });

    it("should handle tattoos with missing estimated_duration", async () => {
      const bookingsMock = [
        {
          id: "4",
          date_and_time: new Date("2025-01-05"),
          tattoos: [
            { estimated_duration: 30 },
            { estimated_duration: undefined },
            { estimated_duration: 20 },
          ],
        },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: bookingsMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      // 30 + 0 (undefined) + 20 = 50
      expect(res[0].total_duration).toBe(50);
    });

    it("should return empty array when no bookings exist", async () => {
      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(res).toEqual([]);
    });

    it("should handle null data response", async () => {
      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(res).toBeUndefined();
    });

    it("should handle multiple bookings with different durations", async () => {
      const bookingsMock = [
        {
          id: "1",
          date_and_time: new Date("2025-01-02"),
          tattoos: [{ estimated_duration: 60 }],
        },
        {
          id: "2",
          date_and_time: new Date("2025-01-03"),
          tattoos: [
            { estimated_duration: 30 },
            { estimated_duration: 30 },
          ],
        },
        {
          id: "3",
          date_and_time: new Date("2025-01-04"),
          tattoos: [],
        },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: bookingsMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(res).toHaveLength(3);
      expect(res[0].total_duration).toBe(60);
      expect(res[1].total_duration).toBe(60);
      expect(res[2].total_duration).toBe(0);
    });

    it("should call supabase with correct table and filters", async () => {
      const mockFrom = jest.fn();
      const mockSelect = jest.fn();
      const mockIn = jest.fn().mockResolvedValue({ data: [], error: null });

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          in: mockIn,
        }),
      });

      initServerClient.mockResolvedValue({ from: mockFrom });

      await getBookings();

      expect(mockFrom).toHaveBeenCalledWith("bookings");
      expect(mockSelect).toHaveBeenCalledWith("id, date_and_time, tattoos(estimated_duration)");
      expect(mockIn).toHaveBeenCalledWith("status", ["pending", "confirmed"]);
    });

    it("should preserve booking id and date_and_time in response", async () => {
      const bookingsMock = [
        {
          id: "booking-123",
          date_and_time: new Date("2025-01-02T10:30:00"),
          tattoos: [{ estimated_duration: 45 }],
        },
      ];

      const makeMockSupabase = () => ({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: bookingsMock, error: null }),
          }),
        }),
      });

      initServerClient.mockResolvedValue(makeMockSupabase());

      const res = await getBookings();

      expect(res[0].id).toBe("booking-123");
      expect(res[0].date_and_time).toEqual(new Date("2025-01-02T10:30:00"));
      expect(res[0].total_duration).toBe(45);
    });
  });
});

