import {render, screen, fireEvent} from "@testing-library/react";
import AcceptButton from "../AcceptPendingBooking";
import "@testing-library/jest-dom";
import {acceptPendingBooking} from "../actions";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
}));

jest.mock("next/link", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ({children, href}: any) => <a href={href}>{children}</a>;
});

// Mock actions
jest.mock("../actions", () => ({
    acceptPendingBooking: jest.fn(),
}));

describe("AcceptButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const {useParams} = require("next/navigation");
        useParams.mockReturnValue({id: "123"});
    });

    it("renders button with correct text", () => {
        render(<AcceptButton/>);

        const button = screen.getByRole("button", {name: /accepter/i});
        expect(button).toBeInTheDocument();
    });

    it("renders link with correct href", () => {
        render(<AcceptButton/>);

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/dashboard/");
    });

    it("calls acceptPendingBooking with correct id when clicked", async () => {
        render(<AcceptButton/>);

        const button = screen.getByRole("button", {name: /accepter/i});
        fireEvent.click(button);

        expect(acceptPendingBooking).toHaveBeenCalledWith("123");
    });
});

