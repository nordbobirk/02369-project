import { revalidatePath } from "next/cache";

// Mock Supabase client - must be before importing actions
jest.mock("../../../../../lib/supabase/server", () => ({
    initServerClient: jest.fn(),
}));

// Mock Next.js revalidatePath
jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}));

// Import actions after mocking dependencies
import {
    getTattooImageSignedUrl,
    getPendingBookingById,
    acceptPendingBooking,
    rejectPendingBooking,
    updateBookingDetails,
    updateTattooDetails,
    cancelBooking
} from "../actions";

describe("Server Actions", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockSupabase: any;
    let initServerClient: jest.Mock;

    beforeEach(async () => {
        jest.clearAllMocks();
        
        // Import the mocked module
        const supabaseModule = await import("../../../../../lib/supabase/server");
        initServerClient = supabaseModule.initServerClient as jest.Mock;

        // Create mock Supabase client with chainable methods
        mockSupabase = {
            storage: {
                from: jest.fn().mockReturnThis(),
                createSignedUrl: jest.fn(),
            },
            from: jest.fn(),
            select: jest.fn(),
            update: jest.fn(),
            eq: jest.fn(),
            order: jest.fn(),
            single: jest.fn(),
        };

        // Make methods chainable
        mockSupabase.from.mockReturnValue(mockSupabase);
        mockSupabase.select.mockReturnValue(mockSupabase);
        mockSupabase.update.mockReturnValue(mockSupabase);
        mockSupabase.eq.mockReturnValue(mockSupabase);
        mockSupabase.order.mockReturnValue(mockSupabase);
        mockSupabase.single.mockResolvedValue({ data: null, error: null });

        initServerClient.mockResolvedValue(mockSupabase);
    });

    describe("getTattooImageSignedUrl", () => {
        it("should create signed URL for full storage URL", async () => {
            const imageUrl = "https://project.supabase.co/storage/v1/object/authenticated/tattoo-images/test/image.jpg";
            const mockSignedUrl = "https://signed-url.com/image.jpg";

            mockSupabase.storage.createSignedUrl.mockResolvedValue({
                data: { signedUrl: mockSignedUrl },
                error: null,
            });

            const result = await getTattooImageSignedUrl(imageUrl);

            expect(mockSupabase.storage.from).toHaveBeenCalledWith("tattoo-images");
            expect(mockSupabase.storage.createSignedUrl).toHaveBeenCalledWith("test/image.jpg", 3600);
            expect(result).toBe(mockSignedUrl);
        });

        it("should create signed URL for relative path", async () => {
            const imageUrl = "test/image.jpg";
            const mockSignedUrl = "https://signed-url.com/image.jpg";

            mockSupabase.storage.createSignedUrl.mockResolvedValue({
                data: { signedUrl: mockSignedUrl },
                error: null,
            });

            const result = await getTattooImageSignedUrl(imageUrl);

            expect(mockSupabase.storage.from).toHaveBeenCalledWith("tattoo-images");
            expect(mockSupabase.storage.createSignedUrl).toHaveBeenCalledWith("test/image.jpg", 3600);
            expect(result).toBe(mockSignedUrl);
        });

        it("should return original URL on error", async () => {
            const imageUrl = "test/image.jpg";
            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

            mockSupabase.storage.createSignedUrl.mockResolvedValue({
                data: null,
                error: { message: "Storage error" },
            });

            const result = await getTattooImageSignedUrl(imageUrl);

            expect(result).toBe(imageUrl);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error creating signed URL:", { message: "Storage error" });
            
            consoleErrorSpy.mockRestore();
        });

        it("should handle URL with public prefix", async () => {
            const imageUrl = "https://project.supabase.co/storage/v1/object/public/tattoo-images/test/image.jpg";
            const mockSignedUrl = "https://signed-url.com/image.jpg";

            mockSupabase.storage.createSignedUrl.mockResolvedValue({
                data: { signedUrl: mockSignedUrl },
                error: null,
            });

            const result = await getTattooImageSignedUrl(imageUrl);

            expect(mockSupabase.storage.from).toHaveBeenCalledWith("tattoo-images");
            expect(mockSupabase.storage.createSignedUrl).toHaveBeenCalledWith("test/image.jpg", 3600);
            expect(result).toBe(mockSignedUrl);
        });

        it("should handle invalid URL by treating it as relative path", async () => {
            const imageUrl = "invalid-url";
            const mockSignedUrl = "https://signed-url.com/invalid-url";

            // Invalid URLs are treated as relative paths with default bucket
            mockSupabase.storage.createSignedUrl.mockResolvedValue({
                data: { signedUrl: mockSignedUrl },
                error: null,
            });

            const result = await getTattooImageSignedUrl(imageUrl);

            // Should use default bucket 'tattoo-images' and the URL as path
            expect(mockSupabase.storage.from).toHaveBeenCalledWith("tattoo-images");
            expect(mockSupabase.storage.createSignedUrl).toHaveBeenCalledWith("invalid-url", 3600);
            expect(result).toBe(mockSignedUrl);
        });
    });

    describe("getPendingBookingById", () => {
        it("should fetch booking with tattoos and images", async () => {
            const mockBookingData = [
                {
                    id: "123",
                    email: "test@test.com",
                    tattoos: [
                        {
                            id: "tattoo1",
                            tattoo_images: [
                                { id: "img1", image_url: "test/image1.jpg" },
                                { id: "img2", image_url: "test/image2.jpg" },
                            ],
                        },
                    ],
                },
            ];

            mockSupabase.order.mockResolvedValue({
                data: mockBookingData,
                error: null,
            });

            mockSupabase.storage.createSignedUrl.mockResolvedValue({
                data: { signedUrl: "https://signed-url.com/image.jpg" },
                error: null,
            });

            const result = await getPendingBookingById("123");

            expect(mockSupabase.from).toHaveBeenCalledWith("bookings");
            expect(mockSupabase.select).toHaveBeenCalledWith(expect.stringContaining("tattoos"));
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", "123");
            expect(mockSupabase.order).toHaveBeenCalledWith("created_at", { ascending: false });
            expect(result).toBeDefined();
            expect(result[0].tattoos[0].tattoo_images[0].image_url).toBe("https://signed-url.com/image.jpg");
        });

        it("should throw error if fetching fails", async () => {
            mockSupabase.order.mockResolvedValue({
                data: null,
                error: { message: "Database error" },
            });

            await expect(getPendingBookingById("123")).rejects.toEqual({ message: "Database error" });
        });

        it("should handle booking without tattoos", async () => {
            const mockBookingData = [
                {
                    id: "123",
                    email: "test@test.com",
                    tattoos: null,
                },
            ];

            mockSupabase.order.mockResolvedValue({
                data: mockBookingData,
                error: null,
            });

            const result = await getPendingBookingById("123");

            expect(result).toEqual(mockBookingData);
        });
    });

    describe("acceptPendingBooking", () => {
        it("should update booking status to confirmed", async () => {
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: null,
            });

            await acceptPendingBooking("123");

            expect(mockSupabase.from).toHaveBeenCalledWith("bookings");
            expect(mockSupabase.update).toHaveBeenCalledWith({ status: "confirmed" });
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", "123");
            expect(revalidatePath).toHaveBeenCalledWith("/dashboard/view_booking123");
        });

        it("should throw error if update fails", async () => {
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: { message: "Update error" },
            });

            await expect(acceptPendingBooking("123")).rejects.toEqual({ message: "Update error" });
        });

        it("should handle array of ids", async () => {
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: null,
            });

            await acceptPendingBooking(["123", "456"]);

            expect(mockSupabase.eq).toHaveBeenCalledWith("id", ["123", "456"]);
        });
    });

    describe("rejectPendingBooking", () => {
        it("should update booking status to rejected", async () => {
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: null,
            });

            await rejectPendingBooking("123");

            expect(mockSupabase.from).toHaveBeenCalledWith("bookings");
            expect(mockSupabase.update).toHaveBeenCalledWith({ status: "rejected" });
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", "123");
            expect(revalidatePath).toHaveBeenCalledWith("/dashboard/view_booking/123");
        });

        it("should throw error if update fails", async () => {
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: { message: "Update error" },
            });

            await expect(rejectPendingBooking("123")).rejects.toEqual({ message: "Update error" });
        });
    });

    describe("updateBookingDetails", () => {
        it("should update booking details with all parameters", async () => {
            const bookingId = "123";
            const email = "newemail@test.com";
            const phoneNumber = "87654321";
            const internalNotes = "Updated notes";

            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: null,
            });

            await updateBookingDetails(bookingId, email, phoneNumber, internalNotes);

            expect(mockSupabase.from).toHaveBeenCalledWith("bookings");
            expect(mockSupabase.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    email,
                    phone_number: phoneNumber,
                    internal_notes: internalNotes,
                    edited_date_and_time: expect.any(String),
                })
            );
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", bookingId);
            expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/view_booking/${bookingId}`);
        });

        it("should throw error if update fails", async () => {
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: { message: "Update error" },
            });

            await expect(
                updateBookingDetails("123", "email@test.com", "12345678", "notes")
            ).rejects.toEqual({ message: "Update error" });
        });

        it("should set edited_date_and_time to current time", async () => {
            const beforeTime = new Date().toISOString();
            
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: null,
            });

            await updateBookingDetails("123", "email@test.com", "12345678", "notes");

            const updateCall = mockSupabase.update.mock.calls[0][0];
            const editedTime = new Date(updateCall.edited_date_and_time).getTime();
            const beforeTimeMs = new Date(beforeTime).getTime();
            
            expect(editedTime).toBeGreaterThanOrEqual(beforeTimeMs);
        });
    });

    describe("updateTattooDetails", () => {
        it("should update tattoo details with colored option", async () => {
            const tattooId = "tattoo123";
            const width = 10;
            const height = 15;
            const placement = "arm";
            const detailLevel = "high";
            const coloredOption = "colored";
            const colorDescription = "red and blue";

            mockSupabase.eq.mockResolvedValueOnce({
                data: null,
                error: null,
            });

            mockSupabase.single.mockResolvedValue({
                data: { booking_id: "booking123" },
                error: null,
            });

            await updateTattooDetails(
                tattooId,
                width,
                height,
                placement,
                detailLevel,
                coloredOption,
                colorDescription
            );

            expect(mockSupabase.from).toHaveBeenCalledWith("tattoos");
            expect(mockSupabase.update).toHaveBeenCalledWith({
                width,
                height,
                placement,
                detail_level: detailLevel,
                colored_option: coloredOption,
                color_description: colorDescription,
            });
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", tattooId);
            expect(revalidatePath).toHaveBeenCalledWith("/dashboard/view_booking/booking123");
        });

        it("should set color_description to null when not colored", async () => {
            const tattooId = "tattoo123";
            const coloredOption = "black_and_white";

            mockSupabase.eq.mockResolvedValueOnce({
                data: null,
                error: null,
            });

            mockSupabase.single.mockResolvedValue({
                data: { booking_id: "booking123" },
                error: null,
            });

            await updateTattooDetails(
                tattooId,
                10,
                15,
                "arm",
                "medium",
                coloredOption,
                "should be ignored"
            );

            expect(mockSupabase.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    color_description: null,
                })
            );
        });

        it("should throw error if update fails", async () => {
            mockSupabase.eq.mockResolvedValue({
                data: null,
                error: { message: "Update error" },
            });

            await expect(
                updateTattooDetails("tattoo123", 10, 15, "arm", "high", "colored", "red")
            ).rejects.toEqual({ message: "Update error" });
        });

        it("should handle undefined width and height", async () => {
            mockSupabase.eq.mockResolvedValueOnce({
                data: null,
                error: null,
            });

            mockSupabase.single.mockResolvedValue({
                data: { booking_id: "booking123" },
                error: null,
            });

            await updateTattooDetails(
                "tattoo123",
                undefined,
                undefined,
                "arm",
                null,
                "colored",
                "blue"
            );

            expect(mockSupabase.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    width: undefined,
                    height: undefined,
                })
            );
        });

        it("should not revalidate if booking_id is not found", async () => {
            mockSupabase.eq.mockResolvedValueOnce({
                data: null,
                error: null,
            });

            mockSupabase.single.mockResolvedValue({
                data: null,
                error: null,
            });

            await updateTattooDetails(
                "tattoo123",
                10,
                15,
                "arm",
                "high",
                "colored",
                "red"
            );

            // revalidatePath should not be called since booking_id is null
            expect(revalidatePath).not.toHaveBeenCalled();
        });
    });

    describe("cancelBooking", () => {
        it("should update booking status to artist_cancelled", async () => {
            const bookingId = "123";

            // Mock the final resolution of the chain
            mockSupabase.eq.mockReturnValueOnce(mockSupabase);
            mockSupabase.eq.mockResolvedValueOnce({
                data: null,
                error: null,
            });

            await cancelBooking(bookingId);

            expect(mockSupabase.from).toHaveBeenCalledWith("bookings");
            expect(mockSupabase.update).toHaveBeenCalledWith({ status: "artist_cancelled" });
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", bookingId);
            expect(mockSupabase.eq).toHaveBeenCalledWith("status", "confirmed");
            expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/view_booking/${bookingId}`);
        });

        it("should throw error if update fails", async () => {
            mockSupabase.eq.mockReturnValueOnce(mockSupabase);
            mockSupabase.eq.mockResolvedValueOnce({
                data: null,
                error: { message: "Update error" },
            });

            await expect(cancelBooking("123")).rejects.toEqual({ message: "Update error" });
        });

        it("should only cancel confirmed bookings", async () => {
            mockSupabase.eq.mockReturnValueOnce(mockSupabase);
            mockSupabase.eq.mockResolvedValueOnce({
                data: null,
                error: null,
            });

            await cancelBooking("123");

            const eqCalls = mockSupabase.eq.mock.calls;
            expect(eqCalls).toContainEqual(["status", "confirmed"]);
        });
    });
});

