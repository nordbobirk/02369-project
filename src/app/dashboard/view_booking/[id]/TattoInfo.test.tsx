import {render, screen, fireEvent} from "@testing-library/react";
import {TattooInfo} from "./TattoInfo";
import "@testing-library/jest-dom";
import {updateTattooDetails} from "./actions";
import {useRouter, useParams} from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(),
}));

// Mock actions
jest.mock("./actions", () => ({
    updateTattooDetails: jest.fn(),
}));

// Mock child components
jest.mock("./TattooImages", () => ({
    TattooImages: ({images}: {images?: Array<{id: number; image_url: string}>}) => (
        <div data-testid="tattoo-images">Images ({images?.length || 0})</div>
    ),
}));

jest.mock("./EditTattoo", () => ({
    __esModule: true,
    default: ({onEditAction}: {onEditAction: () => void}) => (
        <button onClick={onEditAction}>Rediger</button>
    ),
}));

jest.mock("./SaveEditTattoo", () => ({
    __esModule: true,
    default: ({onSaveAction}: {onSaveAction: () => void}) => (
        <button onClick={onSaveAction}>Gem</button>
    ),
}));

jest.mock("./CancelEditTattoo", () => ({
    __esModule: true,
    default: ({onCancelAction}: {onCancelAction: () => void}) => (
        <button onClick={onCancelAction}>Annuller</button>
    ),
}));

describe("TattooInfo", () => {
    const mockRouter = {refresh: jest.fn()};

    const mockTattoos = [
        {
            id: 1,
            notes: "First tattoo notes",
            width: 10,
            height: 15,
            placement: "arm",
            tattoo_type: "custom",
            detail_level: "high",
            tattoo_images: [{id: 1, image_url: "https://example.com/image1.jpg"}],
            colored_option: "black",
            estimated_price: 1000,
            color_description: null,
            estimated_duration: 120,
        },
        {
            id: 2,
            notes: "Second tattoo notes",
            width: 5,
            height: 8,
            placement: "leg",
            tattoo_type: "flash",
            detail_level: null,
            tattoo_images: [],
            colored_option: "colored",
            estimated_price: 500,
            color_description: "Red and blue",
            estimated_duration: 60,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useParams as jest.Mock).mockReturnValue({id: "123"});
        (updateTattooDetails as jest.Mock).mockResolvedValue(undefined);
    });

    it("renders 'Ingen tatoveringer' when no tattoos", () => {
        render(<TattooInfo tattoos={[]}/>);

        expect(screen.getByText(/ingen tatoveringer/i)).toBeInTheDocument();
    });

    it("renders first tattoo by default", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText("First tattoo notes")).toBeInTheDocument();
        expect(screen.getByText(/Tattoo 1/)).toBeInTheDocument();
    });

    it("displays tattoo type", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText(/\(custom\)/)).toBeInTheDocument();
    });

    it("displays tattoo notes", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText("First tattoo notes")).toBeInTheDocument();
    });

    it("displays tattoo size", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText(/Størrelse:/)).toBeInTheDocument();
        expect(screen.getByText(/10 x 15 cm/)).toBeInTheDocument();
    });

    it("displays tattoo placement", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText(/Placering:/)).toBeInTheDocument();
        expect(screen.getByText(/arm/)).toBeInTheDocument();
    });

    it("displays detail level for custom tattoos", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText(/Detaljeniveau:/)).toBeInTheDocument();
        expect(screen.getByText(/high/)).toBeInTheDocument();
    });

    it("displays 'Flash' for flash tattoos", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        // Navigate to second tattoo
        const nextButton = screen.getByRole("button", {name: /next tattoo/i});
        fireEvent.click(nextButton);

        expect(screen.getByText(/Detaljeniveau:/)).toBeInTheDocument();
        expect(screen.getByText(/Flash/)).toBeInTheDocument();
    });

    it("displays color option", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText(/Farvevalg:/)).toBeInTheDocument();
        expect(screen.getByText(/black/)).toBeInTheDocument();
    });

    it("displays color description when present", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        // Navigate to second tattoo
        const nextButton = screen.getByRole("button", {name: /next tattoo/i});
        fireEvent.click(nextButton);

        expect(screen.getByText(/Farvebeskrivelse:/)).toBeInTheDocument();
        expect(screen.getByText("Red and blue")).toBeInTheDocument();
    });

    it("displays estimated time", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText(/Est\. tid:/)).toBeInTheDocument();
        expect(screen.getByText(/2 timer/)).toBeInTheDocument();
    });

    it("displays estimated price", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText(/Est\. pris:/)).toBeInTheDocument();
        expect(screen.getByText(/1000 kr/)).toBeInTheDocument();
    });

    it("displays '—' for undefined values", () => {
        const tattooWithUndefined = [
            {
                id: 1,
                notes: "Test",
                width: undefined,
                height: undefined,
                placement: undefined,
                tattoo_type: "custom",
                detail_level: undefined,
                tattoo_images: [],
                colored_option: undefined,
                estimated_price: undefined,
                color_description: undefined,
                estimated_duration: undefined,
            },
        ];

        render(<TattooInfo tattoos={tattooWithUndefined}/>);

        // Should have multiple "—" for undefined values
        const emptyValues = screen.getAllByText("—");
        expect(emptyValues.length).toBeGreaterThan(0);
    });

    it("displays tattoo counter", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        expect(screen.getByText("1 / 2")).toBeInTheDocument();
    });

    it("navigates to next tattoo when next button is clicked", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const nextButton = screen.getByRole("button", {name: /next tattoo/i});
        fireEvent.click(nextButton);

        expect(screen.getByText("Second tattoo notes")).toBeInTheDocument();
        expect(screen.getByText("2 / 2")).toBeInTheDocument();
    });

    it("navigates to previous tattoo when previous button is clicked", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const prevButton = screen.getByRole("button", {name: /previous tattoo/i});
        fireEvent.click(prevButton);

        // Should wrap around to last tattoo
        expect(screen.getByText("Second tattoo notes")).toBeInTheDocument();
        expect(screen.getByText("2 / 2")).toBeInTheDocument();
    });

    it("wraps around when navigating past last tattoo", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const nextButton = screen.getByRole("button", {name: /next tattoo/i});

        // Click next twice to wrap around
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);

        // Should be back at first tattoo
        expect(screen.getByText("First tattoo notes")).toBeInTheDocument();
        expect(screen.getByText("1 / 2")).toBeInTheDocument();
    });

    it("stays on same tattoo when only one tattoo", () => {
        const singleTattoo = [mockTattoos[0]];
        render(<TattooInfo tattoos={singleTattoo}/>);

        const nextButton = screen.getByRole("button", {name: /next tattoo/i});
        fireEvent.click(nextButton);

        expect(screen.getByText("1 / 1")).toBeInTheDocument();
    });

    it("renders TattooImages component", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const images = screen.getByTestId("tattoo-images");
        expect(images).toBeInTheDocument();
        expect(images).toHaveTextContent("Images (1)");
    });

    it("enters edit mode when edit button is clicked", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        // Check for input fields
        const widthInput = screen.getByDisplayValue("10");
        expect(widthInput).toBeInTheDocument();
        expect(widthInput).toHaveAttribute("type", "number");

        const heightInput = screen.getByDisplayValue("15");
        expect(heightInput).toBeInTheDocument();

        const placementInput = screen.getByDisplayValue("arm");
        expect(placementInput).toBeInTheDocument();
    });

    it("allows editing width in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const widthInput = screen.getByDisplayValue("10");
        fireEvent.change(widthInput, {target: {value: "20"}});

        expect(widthInput).toHaveValue(20);
    });

    it("allows editing height in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const heightInput = screen.getByDisplayValue("15");
        fireEvent.change(heightInput, {target: {value: "25"}});

        expect(heightInput).toHaveValue(25);
    });

    it("allows editing placement in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const placementInput = screen.getByDisplayValue("arm");
        fireEvent.change(placementInput, {target: {value: "leg"}});

        expect(placementInput).toHaveValue("leg");
    });

    it("shows detail level dropdown for custom tattoos in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        // Check that a select element exists with the correct value
        const selects = screen.getAllByRole("combobox");
        const detailSelect = selects.find(select => (select as HTMLSelectElement).value === "high");
        expect(detailSelect).toBeInTheDocument();
        expect(detailSelect?.tagName).toBe("SELECT");
    });

    it("shows color option dropdown in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        // Check that a select element exists with the correct value
        const selects = screen.getAllByRole("combobox");
        const colorSelect = selects.find(select => (select as HTMLSelectElement).value === "black");
        expect(colorSelect).toBeInTheDocument();
        expect(colorSelect?.tagName).toBe("SELECT");
    });

    it("shows color description input when colored option is selected in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        // Find the color select and change it to "colored"
        const selects = screen.getAllByRole("combobox");
        const colorSelect = selects.find(select => (select as HTMLSelectElement).value === "black");
        expect(colorSelect).toBeInTheDocument();

        fireEvent.change(colorSelect!, {target: {value: "colored"}});

        // Should now show color description input
        const inputs = screen.getAllByRole("textbox");
        const colorDescInput = inputs.find(input => (input as HTMLInputElement).value === "");
        expect(colorDescInput).toBeInTheDocument();
    });

    it("exits edit mode when cancel is clicked", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const widthInput = screen.getByDisplayValue("10");
        fireEvent.change(widthInput, {target: {value: "20"}});

        const cancelButton = screen.getByRole("button", {name: /annuller/i});
        fireEvent.click(cancelButton);

        // Should show original value, not the edited one
        expect(screen.getByText(/10 x 15 cm/)).toBeInTheDocument();
        expect(screen.queryByDisplayValue("20")).not.toBeInTheDocument();
    });

    it("exits edit mode when save is clicked", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const saveButton = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(saveButton);

        // Edit button should be back
        expect(screen.getByRole("button", {name: /rediger/i})).toBeInTheDocument();
    });

    it("disables navigation buttons in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const nextButton = screen.getByRole("button", {name: /next tattoo/i});
        const prevButton = screen.getByRole("button", {name: /previous tattoo/i});

        expect(nextButton).toBeDisabled();
        expect(prevButton).toBeDisabled();
    });

    it("does not navigate when navigation buttons are disabled", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const nextButton = screen.getByRole("button", {name: /next tattoo/i});
        fireEvent.click(nextButton);

        // Should still be on first tattoo
        expect(screen.getByText("First tattoo notes")).toBeInTheDocument();
    });

    it("clears width when input is emptied in edit mode", () => {
        render(<TattooInfo tattoos={mockTattoos}/>);

        const editButton = screen.getByRole("button", {name: /rediger/i});
        fireEvent.click(editButton);

        const widthInput = screen.getByDisplayValue("10");
        fireEvent.change(widthInput, {target: {value: ""}});

        expect(widthInput).toHaveValue(null);
    });

    it("handles tattoos without images", () => {
        const tattooNoImages = [{...mockTattoos[0], tattoo_images: []}];
        render(<TattooInfo tattoos={tattooNoImages}/>);

        const images = screen.getByTestId("tattoo-images");
        expect(images).toHaveTextContent("Images (0)");
    });

    it("handles undefined tattoo_images", () => {
        const tattooUndefinedImages = [{...mockTattoos[0], tattoo_images: undefined}];
        render(<TattooInfo tattoos={tattooUndefinedImages}/>);

        const images = screen.getByTestId("tattoo-images");
        expect(images).toBeInTheDocument();
    });
});

