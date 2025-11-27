import {
  getPendingBookingById,
  cancelBooking,
  validateBookingOtp,
  updateBookingDate,
  backfillMissingOTPs,
} from '../actions';
import { initServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import { generateOTPData, verifyOTP } from '../otp_utils';

// --- 1. Mock Dependencies ---

// Mock Next.js Cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock File System
jest.mock('fs/promises', () => ({
  appendFile: jest.fn(),
}));

// Mock OTP Utils
jest.mock('../otp_utils', () => ({
  generateOTPData: jest.fn(),
  verifyOTP: jest.fn(),
}));

// Mock Supabase
const mockSupabase = {
  from: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  eq: jest.fn(),
  order: jest.fn(),
};

jest.mock('../../../../../../lib/supabase/server', () => ({
  initServerClient: jest.fn(() => Promise.resolve(mockSupabase)),
}));

// --- 2. Test Suite ---

describe('Server Actions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default Supabase Chain Behavior
    // We allow chaining by returning 'this' (the mock object itself)
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.update.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.order.mockReturnThis();
  });

  // ----------------------------------------------------------------
  // Test: getPendingBookingById
  // Chain: .from().select().eq().order() -> Returns Data
  // ----------------------------------------------------------------
  describe('getPendingBookingById', () => {
    it('fetches booking data successfully', async () => {
      const mockData = [{ id: '123', name: 'Test' }];

      // Mock the END of the chain (.order) to resolve with data
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getPendingBookingById('123');

      expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
      expect(result).toEqual(mockData);
    });

    it('throws an error if Supabase fails', async () => {
      const mockError = { message: 'DB Error' };
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: mockError });

      await expect(getPendingBookingById('123')).rejects.toEqual(mockError);
    });
  });

  // ----------------------------------------------------------------
  // Test: cancelBooking
  // Chain: .from().update().eq().select() -> Returns Data/Error
  // ----------------------------------------------------------------
  describe('cancelBooking', () => {
    it('updates status to customer_cancelled and revalidates', async () => {
      // Mock the END of the chain (.select)
      mockSupabase.select.mockResolvedValueOnce({ error: null });

      await cancelBooking('123');

      expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'customer_cancelled' });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
      expect(mockSupabase.select).toHaveBeenCalled(); // Ensures .select() was called
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/view_booking/123');
    });

    it('throws error if update fails', async () => {
      // Mock the END of the chain (.select) to return error
      mockSupabase.select.mockResolvedValueOnce({ error: { message: 'Fail' } });

      await expect(cancelBooking('123')).rejects.toEqual({ message: 'Fail' });
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // Test: validateBookingOtp
  // Dependencies: Calls getPendingBookingById internally
  // ----------------------------------------------------------------
  describe('validateBookingOtp', () => {
    it('returns failure if booking not found', async () => {
      // Mock getPendingBookingById behavior (empty array)
      // Since validateBookingOtp calls getPendingBookingById, we mock the DB call inside that function
      mockSupabase.order.mockResolvedValueOnce({ data: [], error: null });

      const result = await validateBookingOtp('123', '9999');

      expect(result).toEqual({ success: false, message: 'Booking not found' });
    });

    it('returns success if OTP is valid', async () => {
      // 1. Mock DB Return for getPendingBookingById
      mockSupabase.order.mockResolvedValueOnce({
        data: [{ id: '123', otp_hash: 'hashed_secret' }],
        error: null,
      });

      // 2. Mock OTP verification success
      (verifyOTP as jest.Mock).mockReturnValue(true);

      const result = await validateBookingOtp('123', '1234');

      expect(verifyOTP).toHaveBeenCalledWith('1234', 'hashed_secret');
      expect(result).toEqual({ success: true });
    });

    it('returns failure if OTP is invalid', async () => {
      // 1. Mock DB Return
      mockSupabase.order.mockResolvedValueOnce({
        data: [{ id: '123', otp_hash: 'hashed_secret' }],
        error: null,
      });

      // 2. Mock OTP verification failure
      (verifyOTP as jest.Mock).mockReturnValue(false);

      const result = await validateBookingOtp('123', 'wrong');

      expect(result).toEqual({ success: false, message: 'Invalid code' });
    });
  });

  // ----------------------------------------------------------------
  // Test: updateBookingDate
  // Chain: .from().update().eq().select() -> Returns Data/Error
  // ----------------------------------------------------------------
  describe('updateBookingDate', () => {
    it('updates date and status, then revalidates paths', async () => {
      // Mock the END of the chain (.select)
      mockSupabase.select.mockResolvedValueOnce({ error: null });
      const newDate = new Date('2025-01-01T12:00:00Z');

      const result = await updateBookingDate('123', newDate);

      // Verify DB Update payload
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({
          date_and_time: newDate.toISOString(),
          status: 'edited',
        })
      );

      // Verify Revalidations
      expect(revalidatePath).toHaveBeenCalledWith('/booking/edit_booking/123');
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/view_booking/123');
      expect(result).toEqual({ success: true });
    });

    it('returns error object if update fails', async () => {
      // Mock the END of the chain (.select)
      mockSupabase.select.mockResolvedValueOnce({ error: { message: 'DB Update Failed' } });
      const newDate = new Date();

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await updateBookingDate('123', newDate);

      expect(result).toEqual({ success: false, error: 'DB Update Failed' });
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  // ----------------------------------------------------------------
  // Test: backfillMissingOTPs
  // Chain 1 (Select): .from().select() -> Returns Data
  // Chain 2 (Update loop): .from().update().eq() -> Returns Error
  // ----------------------------------------------------------------
  describe('backfillMissingOTPs', () => {
    it('returns message if no bookings found', async () => {
      // Mock Select returning empty
      mockSupabase.select.mockResolvedValueOnce({ data: [], error: null });

      const result = await backfillMissingOTPs();

      expect(result).toEqual({ success: true, message: 'No bookings found.' });
      expect(fs.appendFile).not.toHaveBeenCalled();
    });

    it('handles database fetch error', async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: null,
        error: { message: 'Fetch Fail' },
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await backfillMissingOTPs();

      expect(result).toEqual({ success: false, error: 'Fetch Fail' });
      consoleSpy.mockRestore();
    });

    it('loops through bookings, updates DB, and writes to file', async () => {
      // 1. Mock Initial Fetch
      const mockBookings = [
        { id: '1', email: 'a@b.com', name: 'Alice' },
        { id: '2', email: 'b@c.com', name: 'Bob' },
      ];
      mockSupabase.select.mockResolvedValueOnce({ data: mockBookings, error: null });

      // 2. Mock OTP Generation
      (generateOTPData as jest.Mock)
        .mockReturnValueOnce({ code: '1111', hash: 'hash1' })
        .mockReturnValueOnce({ code: '2222', hash: 'hash2' });

      // 3. Mock The Loop Updates
      // In backfill(), the code is: await supabase.update().eq()
      // It DOES NOT call .select().
      // Because we set .eq.mockReturnThis() in beforeEach, awaiting `.eq()` resolves to the `mockSupabase` object.
      // We need to ensure that when the code does `const { error } = await ...eq()`, `error` is undefined/null.
      // Since `mockSupabase` does not have an `error` property by default, it works for success cases (error is undefined).
      // We don't need to change anything for the SUCCESS case here.

      const result = await backfillMissingOTPs();

      expect(result).toEqual({ success: true, count: 2 });

      // Verify Updates
      expect(mockSupabase.update).toHaveBeenCalledWith({ otp_hash: 'hash1' });
      expect(mockSupabase.update).toHaveBeenCalledWith({ otp_hash: 'hash2' });
      expect(mockSupabase.update).toHaveBeenCalledTimes(2);

      // Verify File Write
      expect(fs.appendFile).toHaveBeenCalledTimes(1);

      const [filePath, content] = (fs.appendFile as jest.Mock).mock.calls[0];
      expect(filePath).toContain('temp_otps.txt');
      expect(content).toContain(
        'Alice | Link: http://localhost:3000/booking/edit_booking/1?code=1111'
      );
      expect(content).toContain(
        'Bob | Link: http://localhost:3000/booking/edit_booking/2?code=2222'
      );
    });

    it('continues loop even if one update fails', async () => {
      const mockBookings = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];

      mockSupabase.select.mockResolvedValueOnce({ data: mockBookings, error: null });
      (generateOTPData as jest.Mock).mockReturnValue({ code: '0000', hash: 'hash' });

      // TRICKY PART: Mocking one failure in the loop.
      // backfill() awaits .eq().
      // We need .eq() to return { error: 'Fail' } for the first call, and {} for the second.

      mockSupabase.eq
        .mockResolvedValueOnce({ error: { message: 'Update Fail' } }) // 1. Alice fails (Break chain, return error directly)
        .mockResolvedValueOnce({ error: null }); // 2. Bob succeeds

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await backfillMissingOTPs();

      // Only Bob should be counted
      expect(result).toEqual({ success: true, count: 1 });

      // File should only contain Bob
      const [, content] = (fs.appendFile as jest.Mock).mock.calls[0];
      expect(content).not.toContain('Alice');
      expect(content).toContain('Bob');

      consoleSpy.mockRestore();
    });
  });
});