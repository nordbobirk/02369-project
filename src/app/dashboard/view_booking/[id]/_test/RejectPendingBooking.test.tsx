import {render, screen, fireEvent} from "@testing-library/react";
import RejectButton from "../RejectPendingBooking";
import "@testing-library/jest-dom";
import {rejectPendingBooking} from "../actions";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
}));

jest.mock("next/link", () => {
    return ({children, href}: any) => <a href={href}>{children}</a>;
});

// Mock actions
jest.mock("../actions", () => ({
    rejectPendingBooking: jest.fn(),
}));

describe("RejectButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const {useParams} = require("next/navigation");
        useParams.mockReturnValue({id: "456"});
    });

    it("renders button with correct text", () => {
        render(<RejectButton/>);

        const button = screen.getByRole("button", {name: /afvis/i});
        expect(button).toBeInTheDocument();
    });

    it("renders link with correct href", () => {
        render(<RejectButton/>);

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/dashboard/");
    });

    it("calls rejectPendingBooking with correct id when clicked", async () => {
        render(<RejectButton/>);

        const button = screen.getByRole("button", {name: /afvis/i});
        fireEvent.click(button);

        expect(rejectPendingBooking).toHaveBeenCalledWith("456");
    });
});

