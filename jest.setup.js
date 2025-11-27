import "@testing-library/jest-dom";

import { sendEmail } from "./src/lib/email/send";
import { getCustomerEmail } from "./src/lib/email/validate";
import {
  getBookingTimeString,
  getBookingTime,
} from "./src/lib/validateBookingTime";
import { getNotificationEmail } from "./src/lib/email/getNotificationEmail"

jest.mock("./src/lib/email/getNotificationEmail", () => ({
  getNotificationEmail: jest.fn().mockResolvedValue("artist@example.com"),
}))

jest.mock("./src/lib/email/send", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("./src/lib/email/validate", () => ({
  getCustomerEmail: jest.fn().mockReturnValue("customer@example.com"),
}));

jest.mock("./src/lib/validateBookingTime", () => ({
  getBookingTime: jest.fn().mockReturnValue(new Date("")),
  getBookingTimeString: jest.fn().mockReturnValue("27.11.2025 kl. 11.00"),
}));

beforeAll(() => {
  process.env = {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: "http://example.com",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "testkey",
  };
});
