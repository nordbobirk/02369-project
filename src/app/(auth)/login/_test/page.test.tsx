import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

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

jest.mock("../LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

const { initServerClient } = require("../../../../lib/supabase/server");

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders LoginForm when user is not authenticated", async () => {
    const mockSupabase = {
      auth: {
        getClaims: jest.fn().mockResolvedValue({ data: null }),
      },
    };
    (initServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const component = await LoginPage();
    render(component);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to dashboard when user is authenticated", async () => {
    const mockSupabase = {
      auth: {
        getClaims: jest.fn().mockResolvedValue({
          data: { claims: { sub: "user-123" } },
        }),
      },
    };
    (initServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    await LoginPage();

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("does not redirect when claims data is empty", async () => {
    const mockSupabase = {
      auth: {
        getClaims: jest.fn().mockResolvedValue({ data: { claims: null } }),
      },
    };
    (initServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const component = await LoginPage();
    render(component);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});