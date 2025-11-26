import {render, screen, fireEvent} from "@testing-library/react";
import BookingInfo from "../BookingInfo";
import "@testing-library/jest-dom";
import {updateBookingDetails} from "../actions";
import {acceptPendingBooking, rejectPendingBooking, cancelBooking} from "../actions";
import {useRouter, useParams} from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock("next/link", () => {
    // eslint-disable-next-line react/display-name
    return ({children, href}: {children: React.ReactNode; href: string}) => <a href={href}>{children}</a>;
});

// Mock actions
jest.mock("../actions", () => ({
    updateBookingDetails: jest.fn(),
    acceptPendingBooking: jest.fn(),
    rejectPendingBooking: jest.fn(),
    cancelBooking: jest.fn(),
}));

// Mock child components
jest.mock("../TattoInfo", () => ({
    TattooInfo: ({tattoos}: {tattoos?: Array<{id: number}>}) => <div data-testid="tattoo-info">Tattoo Info ({tattoos?.length || 0} tattoos)</div>,
}));

jest.mock("../EditBooking", () => ({
    __esModule: true,
    default: ({onEditAction}: {onEditAction: () => void}) => (
        <button onClick={onEditAction}>Rediger</button>
    ),
}));

jest.mock("../SaveEditBooking", () => ({
    __esModule: true,
    default: ({onSaveAction}: {onSaveAction: () => void}) => (
        <button onClick={onSaveAction}>Gem</button>
    ),
}));

jest.mock("../CancelEditBooking", () => ({
    __esModule: true,
    default: ({onCancelAction}: {onCancelAction: () => void}) => (
        <button onClick={onCancelAction}>Annuller</button>
    ),
}));

jest.mock("../AcceptPendingBooking", () => ({
    __esModule: true,
    default: () => (
        <button>Accepter</button>
    ),
}));

jest.mock("../RejectPendingBooking", () => ({
    __esModule: true,
    default: () => (
        <button>Afvis</button>
    ),
}));

jest.mock("../CancelBooking", () => ({
    __esModule: true,
    default: () => (
        <button>Aflys</button>
    ),
}));

describe("BookingInfo", () => {
    const mockRouter = {refresh: jest.fn()};

    const mockBooking = {
        id: "123",
        email: "test@test.com",
        phone_number: "+4512345678",
        name: "Test User",
        date_and_time: "2024-12-15T10:00:00Z",
        created_at: "2024-12-01T10:00:00Z",
        status: "confirmed",
        is_FirstTattoo: true,
        internal_notes: "Test notes",
        edited_date_and_time: "2024-12-10T12:00:00Z",
        tattoos: [
            {
                id: 1,
                notes: "Test tattoo",
                width: 10,
                height: 15,
                placement: "arm",
                tattoo_type: "custom",
                detail_level: "high",
                colored_option: "black",
                estimated_price: 1000,
                estimated_duration: 120,
                tattoo_images: [],
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useParams as jest.Mock).mockReturnValue({id: "123"});
        (updateBookingDetails as jest.Mock).mockResolvedValue(undefined);
        (acceptPendingBooking as jest.Mock).mockResolvedValue(undefined);
        (rejectPendingBooking as jest.Mock).mockResolvedValue(undefined);
        (cancelBooking as jest.Mock).mockResolvedValue(undefined);
    });

    it("renders booking information", () => {
        render(<BookingInfo booking={mockBooking}/>);

        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText(/test@test\.com/i)).toBeInTheDocument();
        expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    });

    it("displays formatted phone number", () => {
        render(<BookingInfo booking={mockBooking}/>);

        expect(screen.getByText(/\+45 12 34 56 78/)).toBeInTheDocument();
    });

    it("displays first tattoo status", () => {
        render(<BookingInfo booking={mockBooking}/>);

        expect(screen.getByText(/Første Tattoo:/)).toBeInTheDocument();
        expect(screen.getByText(/Ja/)).toBeInTheDocument();
    });

    it("displays 'Nope' when not first tattoo", () => {
        const booking = {...mockBooking, is_FirstTattoo: false};
        render(<BookingInfo booking={booking}/>);

        expect(screen.getByText(/Nope/)).toBeInTheDocument();
    });

    it("displays total estimated time", () => {
        render(<BookingInfo booking={mockBooking}/>);

        expect(screen.getByText(/Samlet tid for tatoveringer:/)).toBeInTheDocument();
        expect(screen.getByText(/2 timer/)).toBeInTheDocument();
    });

    it("displays total estimated price", () => {
        render(<BookingInfo booking={mockBooking}/>);

        expect(screen.getByText(/Samlet pris for tatoveringer:/)).toBeInTheDocument();
        expect(screen.getByText(/1000 kr/)).toBeInTheDocument();
    });

    it("displays internal notes", () => {
        render(<BookingInfo booking={mockBooking}/>);

        expect(screen.getByText(/Interne Notes:/)).toBeInTheDocument();
        expect(screen.getByText("Test notes")).toBeInTheDocument();
    });

    it("displays '—' when no internal notes", () => {
        const booking = {...mockBooking, internal_notes: ""};
        render(<BookingInfo booking={booking}/>);

        expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("renders TattooInfo component with tattoos", () => {
        render(<BookingInfo booking={mockBooking}/>);

        const tattooInfo = screen.getByTestId("tattoo-info");
        expect(tattooInfo).toBeInTheDocument();
        expect(tattooInfo).toHaveTextContent("1 tattoos");
    });

    it("enters edit mode when edit button is clicked", () => {
        render(<BookingInfo booking={mockBooking}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        // Check for input fields
        const emailInput = screen.getByDisplayValue("test@test.com");
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");

        const phoneInput = screen.getByDisplayValue("+4512345678");
        expect(phoneInput).toBeInTheDocument();
        expect(phoneInput).toHaveAttribute("type", "tel");
    });

    it("allows editing email in edit mode", () => {
        render(<BookingInfo booking={mockBooking}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const emailInput = screen.getByDisplayValue("test@test.com");
        fireEvent.change(emailInput, {target: {value: "newemail@test.com"}});

        expect(emailInput).toHaveValue("newemail@test.com");
    });

    it("allows editing phone number in edit mode", () => {
        render(<BookingInfo booking={mockBooking}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const phoneInput = screen.getByDisplayValue("+4512345678");
        fireEvent.change(phoneInput, {target: {value: "+4587654321"}});

        expect(phoneInput).toHaveValue("+4587654321");
    });

    it("allows editing internal notes in edit mode", () => {
        render(<BookingInfo booking={mockBooking}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const notesInput = screen.getByDisplayValue("Test notes");
        fireEvent.change(notesInput, {target: {value: "Updated notes"}});

        expect(notesInput).toHaveValue("Updated notes");
    });

    it("exits edit mode and resets values when cancel is clicked", () => {
        render(<BookingInfo booking={mockBooking}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const emailInput = screen.getByDisplayValue("test@test.com");
        fireEvent.change(emailInput, {target: {value: "newemail@test.com"}});

        const cancelButton = screen.getByRole("button", {name: /annuller/i});
        fireEvent.click(cancelButton);

        // Should show original email, not the edited one
        expect(screen.getByText(/test@test\.com/i)).toBeInTheDocument();
        expect(screen.queryByDisplayValue("newemail@test.com")).not.toBeInTheDocument();
    });

    it("exits edit mode when save is clicked", () => {
        render(<BookingInfo booking={mockBooking}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const saveButton = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(saveButton);

        // Edit button should be back
        expect(screen.getByRole("button", {name: /rediger/i})).toBeInTheDocument();
    });

    it("shows Accept and Reject buttons for pending status", () => {
        const pendingBooking = {...mockBooking, status: "pending"};
        render(<BookingInfo booking={pendingBooking}/>);

        expect(screen.getByRole("button", {name: /accepter/i})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /afvis/i})).toBeInTheDocument();
    });

    it("shows Accept and Reject buttons for edited status", () => {
        const editedBooking = {...mockBooking, status: "edited"};
        render(<BookingInfo booking={editedBooking}/>);

        expect(screen.getByRole("button", {name: /accepter/i})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /afvis/i})).toBeInTheDocument();
    });

    it("shows Cancel button for confirmed status", () => {
        const confirmedBooking = {...mockBooking, status: "confirmed"};
        render(<BookingInfo booking={confirmedBooking}/>);

        expect(screen.getByRole("button", {name: /aflys/i})).toBeInTheDocument();
    });

    it("does not show action buttons for other statuses", () => {
        const cancelledBooking = {...mockBooking, status: "cancelled"};
        render(<BookingInfo booking={cancelledBooking}/>);

        expect(screen.queryByRole("button", {name: /accepter/i})).not.toBeInTheDocument();
        expect(screen.queryByRole("button", {name: /afvis/i})).not.toBeInTheDocument();
        expect(screen.queryByRole("button", {name: /aflys/i})).not.toBeInTheDocument();
    });

    it("calculates correct total when multiple tattoos", () => {
        const bookingWithMultipleTattoos = {
            ...mockBooking,
            tattoos: [
                {
                    id: 1,
                    notes: "Tattoo 1",
                    estimated_price: 1000,
                    estimated_duration: 120,
                    tattoo_images: [],
                },
                {
                    id: 2,
                    notes: "Tattoo 2",
                    estimated_price: 500,
                    estimated_duration: 60,
                    tattoo_images: [],
                },
            ],
        };

        render(<BookingInfo booking={bookingWithMultipleTattoos}/>);

        expect(screen.getByText(/1500 kr/)).toBeInTheDocument();
        expect(screen.getByText(/3 timer/)).toBeInTheDocument();
    });

    it("handles tattoos with undefined prices and durations", () => {
        const bookingWithUndefinedValues = {
            ...mockBooking,
            tattoos: [
                {
                    id: 1,
                    notes: "Tattoo 1",
                    estimated_price: undefined,
                    estimated_duration: undefined,
                    tattoo_images: [],
                },
            ],
        };

        render(<BookingInfo booking={bookingWithUndefinedValues}/>);

        expect(screen.getByText(/0 kr/)).toBeInTheDocument();
        expect(screen.getByText(/0 minutter/)).toBeInTheDocument();
    });

    it("displays '—' for edited_date_and_time when null", () => {
        const booking = {...mockBooking, edited_date_and_time: null};
        render(<BookingInfo booking={booking}/>);

        const editedLabel = screen.getByText(/Ændret:/);
        expect(editedLabel.parentElement).toHaveTextContent("—");
    });
});

