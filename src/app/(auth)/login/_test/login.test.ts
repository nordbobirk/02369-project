import { login } from "../login";
import { redirect } from "next/navigation";


jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock("../../../../lib/supabase/server", () => ({
  initServerClient: jest.fn(),
}));

const { initServerClient } = require("../../../../lib/supabase/server");

describe("login server action", () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      auth: {
        signInWithPassword: jest.fn(),
      },
    };
    (initServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it("redirects to dashboard on successful login", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "user-123", email: "test@example.com" } },
      error: null,
    });

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    await login(formData);

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns error message when credentials are invalid", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid credentials" },
    });

    const formData = new FormData();
    formData.append("email", "wrong@example.com");
    formData.append("password", "wrongpass");

    const result = await login(formData);

    expect(result).toBe("Ugyldig email eller password");
    expect(redirect).not.toHaveBeenCalled();
  });
});