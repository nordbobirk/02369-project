import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PublicLayout from "../layout";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock DropdownMenuDemo
jest.mock("../DropdownMenu", () => ({
  DropdownMenuDemo: () => <div data-testid="dropdown-menu">Menu</div>,
}));

describe("PublicLayout", () => {
  test("renders the navigation buttons", () => {
    render(
      <PublicLayout>
        <div />
      </PublicLayout>
    );

    expect(screen.getByText("Hjem")).toBeInTheDocument();
    expect(screen.getByText("Kalender")).toBeInTheDocument();
    expect(screen.getByText("Ubesvarede anmodninger")).toBeInTheDocument();
    expect(screen.getByText("Præferencer")).toBeInTheDocument();
  });

  test("each navigation button links to the correct route", () => {
    render(
      <PublicLayout>
        <div />
      </PublicLayout>
    );

    expect(screen.getByText("Hjem").closest("a")).toHaveAttribute("href", "/dashboard");
    expect(screen.getByText("Kalender").closest("a")).toHaveAttribute("href", "/dashboard/calendar");
    expect(screen.getByText("Ubesvarede anmodninger").closest("a")).toHaveAttribute(
      "href",
      "/dashboard/pending_bookings"
    );
    expect(screen.getByText("Præferencer").closest("a")).toHaveAttribute(
      "href",
      "/dashboard/settings"
    );
  });

  test("renders the dropdown menu", () => {
    render(
      <PublicLayout>
        <div />
      </PublicLayout>
    );

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  test("renders children content", () => {
    render(
      <PublicLayout>
        <p data-testid="child">Hello child</p>
      </PublicLayout>
    );

    expect(screen.getByTestId("child")).toHaveTextContent("Hello child");
  });
});
