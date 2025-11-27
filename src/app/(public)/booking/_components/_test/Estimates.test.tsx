import React from "react";
import { render, screen } from "@testing-library/react";
import { Estimates } from "../Estimates";

// Mock lucide-react to avoid invalid element errors
jest.mock("lucide-react", () => ({
  __esModule: true,
  DollarSign: () => <div data-testid="icon-dollar" />,
  Clock: () => <div data-testid="icon-clock" />,
}));

describe("Estimates", () => {
  it("renders price estimate correctly", () => {
    render(<Estimates priceEstimate={1200} timeEstimate={45} />);

    expect(
      screen.getByText("DKK 1200 + 500", { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByTestId("icon-dollar")).toBeInTheDocument();
  });

  it("renders time estimate in minutes when under 60", () => {
    render(<Estimates priceEstimate={1000} timeEstimate={30} />);

    expect(screen.getByText("30 minutter")).toBeInTheDocument();
    expect(screen.getByTestId("icon-clock")).toBeInTheDocument();
  });

  it("renders time estimate as hours when divisible by 60", () => {
    render(<Estimates priceEstimate={1000} timeEstimate={120} />);

    expect(screen.getByText("2 timers")).toBeInTheDocument();
  });

  it("renders time estimate as hours and minutes", () => {
    render(<Estimates priceEstimate={1000} timeEstimate={95} />);

    // 95 → 1 hour + 35 minutes
    expect(screen.getByText(/1 timer 35 min/)).toBeInTheDocument();
  });

  it("formats singular 'time' correctly for 60 minutes", () => {
    render(<Estimates priceEstimate={1000} timeEstimate={60} />);

    expect(screen.getByText(/1 time/)).toBeInTheDocument();
  });
});
