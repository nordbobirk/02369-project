// --- 1. Polyfill TextEncoder (Must be first) ---
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// --- 2. Mock Dependencies ---
jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}));

// FIX: Use relative path instead of alias '@/'
jest.mock("../../../../../lib/supabase/server", () => ({
    initServerClient: jest.fn(),
}));

// --- 3. Import actions via require() to ensure Polyfill runs first ---
const { revalidatePath } = require("next/cache");
const actions = require("../actions");

const {
    getFAQs,
    getCategories,
    updateFAQ,
    createFAQ,
    deleteFAQ,
    reorderFAQ
} = actions;

describe("FAQ Server Actions", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockSupabase: any;
    
    // Type the mock definition
    let initServerClient: jest.Mock<() => Promise<any>>;

    beforeEach(async () => {
        jest.clearAllMocks();

        // FIX: Use relative path here as well to match the mock
        const supabaseModule = await import("../../../../../lib/supabase/server");
        
        // Cast the mock to the correct type
        initServerClient = supabaseModule.initServerClient as unknown as jest.Mock<() => Promise<any>>;

        // Setup generic mocks
        const fromMock = jest.fn<(...args: any[]) => any>();
        const selectMock = jest.fn<(...args: any[]) => any>();
        const updateMock = jest.fn<(...args: any[]) => any>();
        const insertMock = jest.fn<(...args: any[]) => any>();
        const deleteMock = jest.fn<(...args: any[]) => any>();
        const eqMock = jest.fn<(...args: any[]) => any>();
        const orderMock = jest.fn<(...args: any[]) => any>();
        const singleMock = jest.fn<(...args: any[]) => any>();

        mockSupabase = {
            from: fromMock,
            select: selectMock,
            update: updateMock,
            insert: insertMock,
            delete: deleteMock,
            eq: eqMock,
            order: orderMock,
            single: singleMock,
        };

        // Default behavior: Return 'this' to support chaining
        fromMock.mockReturnValue(mockSupabase);
        selectMock.mockReturnValue(mockSupabase);
        updateMock.mockReturnValue(mockSupabase);
        insertMock.mockReturnValue(mockSupabase);
        deleteMock.mockReturnValue(mockSupabase);
        eqMock.mockReturnValue(mockSupabase);
        orderMock.mockReturnValue(mockSupabase);
        singleMock.mockReturnValue(mockSupabase);

        initServerClient.mockResolvedValue(mockSupabase);
    });

    describe("getFAQs", () => {
        it("should fetch all FAQs ordered by index", async () => {
            const mockData = [{ id: 1, question: "Q1", index: 0 }];
            
            mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

            const result = await getFAQs();

            expect(mockSupabase.from).toHaveBeenCalledWith("faq_contents");
            expect(mockSupabase.select).toHaveBeenCalledWith("*");
            expect(mockSupabase.order).toHaveBeenCalledWith("index", { ascending: true });
            expect(result).toEqual(mockData);
        });

        it("should throw error if fetch fails", async () => {
            mockSupabase.order.mockResolvedValue({ data: null, error: { message: "DB Error" } });

            await expect(getFAQs()).rejects.toEqual({ message: "DB Error" });
        });
    });

    describe("getCategories", () => {
        it("should fetch categories ordered by index", async () => {
            const mockData = [{ category: "General" }];
            
            mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

            const result = await getCategories();

            expect(mockSupabase.from).toHaveBeenCalledWith("faq_contents");
            expect(mockSupabase.select).toHaveBeenCalledWith("category");
            expect(mockSupabase.order).toHaveBeenCalledWith("index", { ascending: true });
            expect(result).toEqual(mockData);
        });
    });

    describe("updateFAQ", () => {
        it("should update FAQ and revalidate path", async () => {
            mockSupabase.eq.mockResolvedValue({ error: null });

            await updateFAQ(1, "Cat", "New Q", "New A");

            expect(mockSupabase.from).toHaveBeenCalledWith("faq_contents");
            expect(mockSupabase.update).toHaveBeenCalledWith({
                category: "Cat",
                question: "New Q",
                answer: "New A"
            });
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", 1);
            expect(revalidatePath).toHaveBeenCalledWith("/dashboard/settings/edit_faq");
        });

        it("should throw error if update fails", async () => {
            mockSupabase.eq.mockResolvedValue({ error: { message: "Update failed" } });

            await expect(updateFAQ(1, "C", "Q", "A")).rejects.toEqual({ message: "Update failed" });
        });
    });

    describe("createFAQ", () => {
        it("should insert FAQ and return data", async () => {
            const mockNewFAQ = { id: 10, category: "C", question: "Q", answer: "A", index: 5 };
            
            mockSupabase.single.mockResolvedValue({ data: mockNewFAQ, error: null });

            const result = await createFAQ("C", "Q", "A", 5);

            expect(mockSupabase.from).toHaveBeenCalledWith("faq_contents");
            expect(mockSupabase.insert).toHaveBeenCalledWith({
                category: "C",
                question: "Q",
                answer: "A",
                index: 5
            });
            expect(result).toEqual(mockNewFAQ);
            expect(revalidatePath).toHaveBeenCalledWith("/dashboard/settings/edit_faq");
        });

        it("should throw error if insert fails", async () => {
            mockSupabase.single.mockResolvedValue({ data: null, error: { message: "Insert error" } });

            await expect(createFAQ("C", "Q", "A", 1)).rejects.toEqual({ message: "Insert error" });
        });
    });

    describe("deleteFAQ", () => {
        it("should delete FAQ and revalidate", async () => {
            mockSupabase.eq.mockResolvedValue({ error: null });

            await deleteFAQ(1);

            expect(mockSupabase.from).toHaveBeenCalledWith("faq_contents");
            expect(mockSupabase.delete).toHaveBeenCalled();
            expect(mockSupabase.eq).toHaveBeenCalledWith("id", 1);
            expect(revalidatePath).toHaveBeenCalledWith("/dashboard/settings/edit_faq");
        });

        it("should throw error if delete fails", async () => {
            mockSupabase.eq.mockResolvedValue({ error: { message: "Delete error" } });

            await expect(deleteFAQ(1)).rejects.toEqual({ message: "Delete error" });
        });
    });

    describe("reorderFAQ", () => {
        const initialFAQs = [
            { id: 101, index: 0 },
            { id: 102, index: 1 },
            { id: 103, index: 2 },
            { id: 104, index: 3 },
        ];

        it("should do nothing if fetch fails", async () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
            
            mockSupabase.order.mockResolvedValue({ data: null, error: { message: "Fetch error" } });

            await reorderFAQ(101, 2);

            expect(consoleSpy).toHaveBeenCalledWith("Error fetching FAQs:", { message: "Fetch error" });
            expect(mockSupabase.update).not.toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });

        it("should reorder items correctly when moving DOWN (0 -> 2)", async () => {
            mockSupabase.order.mockResolvedValueOnce({ data: initialFAQs, error: null });
            
            // Mock Updates
            mockSupabase.eq.mockResolvedValue({ error: null });

            await reorderFAQ(101, 2);

            expect(mockSupabase.update).toHaveBeenCalledWith({ index: 0 }); 
            expect(mockSupabase.update).toHaveBeenCalledWith({ index: 1 });
            expect(mockSupabase.update).toHaveBeenCalledWith({ index: 2 });
            
            expect(revalidatePath).toHaveBeenCalledWith("/dashboard/settings/edit_faq");
        });

        it("should reorder items correctly when moving UP (2 -> 0)", async () => {
            mockSupabase.order.mockResolvedValueOnce({ data: initialFAQs, error: null });
            mockSupabase.eq.mockResolvedValue({ error: null });

            await reorderFAQ(103, 0);

            expect(mockSupabase.update).toHaveBeenCalledWith({ index: 1 });
            expect(mockSupabase.update).toHaveBeenCalledWith({ index: 2 });
            expect(mockSupabase.update).toHaveBeenCalledWith({ index: 0 });

            expect(revalidatePath).toHaveBeenCalled();
        });

        it("should return early if item not found", async () => {
            mockSupabase.order.mockResolvedValueOnce({ data: initialFAQs, error: null });
            await reorderFAQ(999, 1);
            expect(mockSupabase.update).not.toHaveBeenCalled();
        });

        it("should return early if oldIndex equals newIndex", async () => {
            mockSupabase.order.mockResolvedValueOnce({ data: initialFAQs, error: null });
            await reorderFAQ(101, 0);
            expect(mockSupabase.update).not.toHaveBeenCalled();
        });
    });
});