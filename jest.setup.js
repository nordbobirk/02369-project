import '@testing-library/jest-dom'

import { sendEmail } from "./src/lib/email/send";
import { getCustomerEmail } from "./src/lib/email/validate"

jest.mock("./src/lib/email/send", () => ({
    sendEmail: jest.fn(),
}))

jest.mock("./src/lib/email/validate", () => ({
    getCustomerEmail: jest.fn().mockReturnValue("customer@example.com")
}))

beforeAll(() => {
    process.env = {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: "http://example.com",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "testkey"
    }
})