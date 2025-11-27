import '@testing-library/jest-dom'

import { sendEmail } from "./src/lib/email/send";

jest.mock("./src/lib/email/send", () => ({
    sendEmail: jest.fn(),
}))

beforeAll(() => {
    process.env = {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: "http://example.com",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "testkey"
    }
})