/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// ---- Correct relative import for the component ----
import EditEmail from "../page";

// ---- Correct relative mock path for Supabase ----

jest.mock("../../../../../lib/supabase/client", () => ({
  initBrowserClient: jest.fn(),
}));

// Helper for building mock Supabase responses
function mockSupabase(fetchResult: any, updateResult: any) {
  const mockClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(() => fetchResult),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(() => updateResult),
  };

  const { initBrowserClient } = require("../../../../../lib/supabase/client");
  (initBrowserClient as jest.Mock).mockReturnValue(mockClient);
}

describe("EditEmail component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("shows initial loading state", () => {
    mockSupabase({ data: null, error: null }, { data: null, error: null });

    render(<EditEmail />);

    expect(screen.getByText(/Indlæser e-mail/i)).toBeInTheDocument();
  });

  test("displays fetched email", async () => {
    mockSupabase(
      { data: { id: "1", email: "test@mail.com" }, error: null },
      { data: null, error: null }
    );

    render(<EditEmail />);

    expect(await screen.findByText("test@mail.com")).toBeInTheDocument();
  });

  test("opens edit mode", async () => {
    mockSupabase(
      { data: { id: "1", email: "old@mail.com" }, error: null },
      { data: null, error: null }
    );

    render(<EditEmail />);

    fireEvent.click(await screen.findByText("Skift e-mail"));

    expect(
      screen.getByPlaceholderText("Indtast ny e-mail")
    ).toBeInTheDocument();
  });

  test("saves updated email", async () => {
    mockSupabase(
      { data: { id: "1", email: "old@mail.com" }, error: null },
      { data: { id: "1", email: "new@mail.com" }, error: null }
    );

    render(<EditEmail />);

    fireEvent.click(await screen.findByText("Skift e-mail"));

    const input = screen.getByPlaceholderText("Indtast ny e-mail");
    fireEvent.change(input, { target: { value: "new@mail.com" } });

    fireEvent.click(screen.getByText("Gem ændring"));

    expect(
      await screen.findByText(/Din email er nu opdateret/i)
    ).toBeInTheDocument();

    expect(screen.getByText("new@mail.com")).toBeInTheDocument();
  });

  test("cancel restores previous email", async () => {
    mockSupabase(
      { data: { id: "1", email: "original@mail.com" }, error: null },
      { data: null, error: null }
    );

    render(<EditEmail />);

    fireEvent.click(await screen.findByText("Skift e-mail"));

    const input = screen.getByPlaceholderText("Indtast ny e-mail");
    fireEvent.change(input, { target: { value: "changed@mail.com" } });

    fireEvent.click(screen.getByText("Annuller"));

    expect(screen.queryByPlaceholderText("Indtast ny e-mail")).not.toBeInTheDocument();
    expect(screen.getByText("original@mail.com")).toBeInTheDocument();
  });
});
