import { submitBooking, submitFilePaths, BookingSubmissionInput } from "../submitBooking";
import { initServerClient } from "../../../../lib/supabase/server";
import { generateOTPData } from "../edit_booking/[id]/otp_utils";
import path from "path";
import fs from "fs/promises";

jest.mock("../../../../lib/supabase/server");
jest.mock("../edit_booking/[id]/otp_utils");
jest.mock("fs/promises");
jest.mock("path");

const mockInitServerClient = initServerClient as jest.MockedFunction<typeof initServerClient>;
const mockGenerateOTPData = generateOTPData as jest.MockedFunction<typeof generateOTPData>;

describe("submitBooking", () => {
  let mockSupabase: any;

  const mockBookingFormData: BookingSubmissionInput = {
    customerEmail: "test@example.com",
    customerPhone: "1234567890",
    customerName: "John Doe",
    dateTime: new Date("2025-02-01T10:00:00Z"),
    isFirstTattoo: true,
    tattoos: [
      {
        placement: "chest",
        size: "medium" as any,
        flashComments: "Nice design",
        tattooType: "flash",
        colorOption: "black",
        colorDescription: "solid black",
        detailLevel: "high",
        estimated_duration: 60,
        estimated_price: 1000,
        uploadId: "upload-1",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const bookingInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [{ id: "booking-123" }],
        error: null,
      }),
    });

    const tattooInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [{ id: 1, upload_id: "upload-1" }],
        error: null,
      }),
    });

    mockSupabase = {
      from: jest.fn().mockImplementation((table: string) => {
        if (table === "bookings") {
          return { insert: bookingInsert };
        } else if (table === "tattoos") {
          return { insert: tattooInsert };
        }
        return { insert: jest.fn() };
      }),
    };

    mockInitServerClient.mockResolvedValue(mockSupabase);
    mockGenerateOTPData.mockReturnValue({
      code: "123456",
      hash: "secure-hash",
    });
    (path.join as jest.Mock).mockReturnValue("/mock/path/temp_otps.txt");
    (fs.appendFile as jest.Mock).mockResolvedValue(undefined);
  });

  describe("submitBooking - Booking Creation", () => {
    it("should create a booking with correct customer data", async () => {
      await submitBooking(mockBookingFormData);

      expect(mockSupabase.from).toHaveBeenCalledWith("bookings");
      const bookingFrom = mockSupabase.from("bookings");
      const bookingInsert = bookingFrom.insert;
      expect(bookingInsert).toHaveBeenCalledWith({
        email: "test@example.com",
        phone_number: "1234567890",
        name: "John Doe",
        date_and_time: mockBookingFormData.dateTime,
        is_FirstTattoo: true,
        otp_hash: "secure-hash",
      });
    });

    it("should throw error if booking creation fails", async () => {
      mockSupabase.from = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: "Database error",
          }),
        }),
      });

      mockInitServerClient.mockResolvedValue(mockSupabase);

      await expect(submitBooking(mockBookingFormData)).rejects.toThrow(
        "Failed to create booking"
      );
    });

    it("should call generateOTPData to create OTP code and hash", async () => {
      await submitBooking(mockBookingFormData);

      expect(mockGenerateOTPData).toHaveBeenCalled();
    });

    it("should pass otp_hash to booking insert", async () => {
      await submitBooking(mockBookingFormData);

      const bookingFrom = mockSupabase.from("bookings");
      const bookingInsert = bookingFrom.insert;
      const insertCall = bookingInsert.mock.calls[0][0];

      expect(insertCall.otp_hash).toBe("secure-hash");
    });
  });

  describe("submitBooking - Tattoo Creation", () => {
    it("should create tattoo with correct data and size conversions", async () => {
      await submitBooking(mockBookingFormData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;

      expect(tattooInsert).toHaveBeenCalled();
    });

    it("should use flashComments for flash tattoos", async () => {
      await submitBooking(mockBookingFormData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData.notes).toBe("Nice design");
    });

    it("should use customDescription for custom tattoos", async () => {
      const customTattooData: BookingSubmissionInput = {
        ...mockBookingFormData,
        tattoos: [
          {
            ...mockBookingFormData.tattoos[0],
            tattooType: "custom",
            customDescription: "Custom design description",
          },
        ],
      };

      await submitBooking(customTattooData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData.notes).toBe("Custom design description");
    });

    it("should convert size small correctly", async () => {
      const smallTattooData: BookingSubmissionInput = {
        ...mockBookingFormData,
        tattoos: [
          {
            ...mockBookingFormData.tattoos[0],
            size: "small" as any,
          },
        ],
      };

      await submitBooking(smallTattooData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData.height).toBe(5);
      expect(tattooData.width).toBe(5);
    });

    it("should convert size medium correctly", async () => {
      const mediumTattooData: BookingSubmissionInput = {
        ...mockBookingFormData,
        tattoos: [
          {
            ...mockBookingFormData.tattoos[0],
            size: "medium" as any,
          },
        ],
      };

      await submitBooking(mediumTattooData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData.height).toBe(10);
      expect(tattooData.width).toBe(10);
    });

    it("should convert size large correctly", async () => {
      const largeTattooData: BookingSubmissionInput = {
        ...mockBookingFormData,
        tattoos: [
          {
            ...mockBookingFormData.tattoos[0],
            size: "large" as any,
          },
        ],
      };

      await submitBooking(largeTattooData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData.height).toBe(15);
      expect(tattooData.width).toBe(15);
    });

    it("should set estimated_price to 0 for new tattoos", async () => {
      await submitBooking(mockBookingFormData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData.estimated_price).toBe(0);
    });

    it("should associate tattoos with booking_id", async () => {
      await submitBooking(mockBookingFormData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData.booking_id).toBe("booking-123");
    });

    it("should include all tattoo details in insert", async () => {
      await submitBooking(mockBookingFormData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      const tattooData = tattooInsert.mock.calls[0][0][0];

      expect(tattooData).toMatchObject({
        tattoo_type: "flash",
        colored_option: "black",
        color_description: "solid black",
        detail_level: "high",
        estimated_duration: 60,
        upload_id: "upload-1",
      });
      expect(tattooData.placement).toBeTruthy();
      expect(tattooData.booking_id).toBe("booking-123");
      expect(tattooData.estimated_price).toBe(0);
    });

    it("should throw error if tattoo creation fails", async () => {
      const tattooInsertFail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: "Database error",
        }),
      });

      mockSupabase.from = jest.fn().mockImplementation((table: string) => {
        if (table === "bookings") {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [{ id: "booking-123" }],
                error: null,
              }),
            }),
          };
        } else if (table === "tattoos") {
          return { insert: tattooInsertFail };
        }
        return { insert: jest.fn() };
      });

      mockInitServerClient.mockResolvedValue(mockSupabase);

      await expect(submitBooking(mockBookingFormData)).rejects.toThrow(
        "Failed to create tattoos"
      );
    });

    it("should handle multiple tattoos", async () => {
      const multiTattooData: BookingSubmissionInput = {
        ...mockBookingFormData,
        tattoos: [
          mockBookingFormData.tattoos[0],
          {
            ...mockBookingFormData.tattoos[0],
            placement: "chest",
            uploadId: "upload-2",
          },
        ],
      };

      await submitBooking(multiTattooData);

      const tattooFrom = mockSupabase.from("tattoos");
      const tattooInsert = tattooFrom.insert;
      expect(tattooInsert.mock.calls[0][0].length).toBe(2);
    });

    it("should return tattoo data with id and upload_id", async () => {
      const result = await submitBooking(mockBookingFormData);

      expect(result).toEqual([{ id: 1, upload_id: "upload-1" }]);
    });
  });

  describe("submitBooking - Development Logging", () => {
    it("should log magic link in development mode", async () => {
      const originalEnv = process.env.NODE_ENV;
        (process.env as any).NODE_ENV = "development";

      await submitBooking(mockBookingFormData);

      expect(fs.appendFile).toHaveBeenCalled();
      const callArgs = (fs.appendFile as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe("/mock/path/temp_otps.txt");
      expect(callArgs[1]).toContain("John Doe");
      expect(callArgs[1]).toContain("booking/edit_booking/booking-123?code=123456");

      (process.env as any).NODE_ENV = originalEnv;
    });

    it("should not log magic link in production mode", async () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = "production";

      await submitBooking(mockBookingFormData);

      expect(fs.appendFile).not.toHaveBeenCalled();

      (process.env as any).NODE_ENV = originalEnv;
    });

    it("should handle file logging errors gracefully", async () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV ="development";

      (fs.appendFile as jest.Mock).mockRejectedValueOnce(
        new Error("File error")
      );

      await expect(submitBooking(mockBookingFormData)).resolves.not.toThrow();

      (process.env as any).NODE_ENV =originalEnv;
    });

    it("should construct correct magic link format", async () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV ="development";

      await submitBooking(mockBookingFormData);

      const logEntry = (fs.appendFile as jest.Mock).mock.calls[0][1];
      expect(logEntry).toMatch(
        /\[NEW\] Name: .+ \| Link: http:\/\/localhost:3000\/booking\/edit_booking\/.+\?code=.+/
      );

      (process.env as any).NODE_ENV =originalEnv;
    });
  });

  describe("submitFilePaths", () => {
    beforeEach(() => {
      mockSupabase = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      };

      mockInitServerClient.mockResolvedValue(mockSupabase);
    });

    it("should insert file paths with correct image URLs", async () => {
      await submitFilePaths(["image1.jpg", "image2.jpg"], 1);

      const imageInsert = mockSupabase.from().insert;
      const insertData = imageInsert.mock.calls[0][0];

      expect(insertData).toHaveLength(2);
      expect(insertData[0].tattoo_id).toBe(1);
      expect(insertData[0].image_url).toContain("image1.jpg");
      expect(insertData[1].tattoo_id).toBe(1);
      expect(insertData[1].image_url).toContain("image2.jpg");
    });

    it("should construct correct Supabase image URL", async () => {
      await submitFilePaths(["test.jpg"], 5);

      const imageInsert = mockSupabase.from().insert;
      const imageUrl = imageInsert.mock.calls[0][0][0].image_url;

      expect(imageUrl).toBe(
        "https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/authenticated/booking_images/test.jpg"
      );
    });

    it("should handle empty file paths array", async () => {
      await submitFilePaths([], 1);

      const imageInsert = mockSupabase.from().insert;
      expect(imageInsert).toHaveBeenCalledWith([]);
    });

    it("should call supabase from tattoo_images table", async () => {
      await submitFilePaths(["test.jpg"], 1);

      expect(mockSupabase.from).toHaveBeenCalledWith("tattoo_images");
    });

    it("should handle multiple file paths with correct URLs", async () => {
      await submitFilePaths(
        ["design1.jpg", "design2.png", "design3.webp"],
        42
      );

      const imageInsert = mockSupabase.from().insert;
      const insertData = imageInsert.mock.calls[0][0];

      expect(insertData).toHaveLength(3);
      expect(insertData[0].image_url).toContain("design1.jpg");
      expect(insertData[1].image_url).toContain("design2.png");
      expect(insertData[2].image_url).toContain("design3.webp");
      insertData.forEach((item: any) => {
        expect(item.tattoo_id).toBe(42);
      });
    });

    it("should preserve file names in image URLs", async () => {
      const fileName = "my-custom-tattoo-design.png";
      await submitFilePaths([fileName], 10);

      const imageInsert = mockSupabase.from().insert;
      const imageUrl = imageInsert.mock.calls[0][0][0].image_url;

      expect(imageUrl).toContain(fileName);
      expect(imageUrl).toContain("booking_images");
    });
  });
});

