import '@testing-library/jest-dom'

beforeAll(() => {
    process.env = {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: "http://example.com",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "testkey"
    }
})