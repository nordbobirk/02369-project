import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import SaveEditTattoo from "./SaveEditTattoo";
import "@testing-library/jest-dom";
import {updateTattooDetails} from "./actions";
import {useRouter} from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock actions
jest.mock("./actions", () => ({
    updateTattooDetails: jest.fn(),
}));

describe("SaveEditTattoo", () => {
    const mockRefresh = jest.fn();
    const mockOnSave = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            refresh: mockRefresh,
        });
        (updateTattooDetails as jest.Mock).mockResolvedValue(undefined);
    });

    it("renders button with correct text", () => {
        render(
            <SaveEditTattoo
                tattooId="456"
                width={10}
                height={15}
                placement="arm"
                detailLevel="high"
                coloredOption="colored"
                colorDescription="Red and blue"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        expect(button).toBeInTheDocument();
    });

    it("calls updateTattooDetails with correct parameters when clicked", async () => {
        render(
            <SaveEditTattoo
                tattooId="456"
                width={10}
                height={15}
                placement="arm"
                detailLevel="high"
                coloredOption="colored"
                colorDescription="Red and blue"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        await waitFor(() => {
            expect(updateTattooDetails).toHaveBeenCalledWith(
                "456",
                10,
                15,
                "arm",
                "high",
                "colored",
                "Red and blue"
            );
        });
    });

    it("calls onSaveAction callback after saving", async () => {
        render(
            <SaveEditTattoo
                tattooId="456"
                width={10}
                height={15}
                placement="arm"
                detailLevel="high"
                coloredOption="colored"
                colorDescription="Red and blue"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledTimes(1);
        });
    });

    it("calls router.refresh after saving", async () => {
        render(
            <SaveEditTattoo
                tattooId="456"
                width={10}
                height={15}
                placement="arm"
                detailLevel="high"
                coloredOption="colored"
                colorDescription="Red and blue"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalledTimes(1);
        });
    });

    it("handles null detailLevel correctly", async () => {
        render(
            <SaveEditTattoo
                tattooId="456"
                width={10}
                height={15}
                placement="arm"
                detailLevel={null}
                coloredOption="colored"
                colorDescription="Red and blue"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        await waitFor(() => {
            expect(updateTattooDetails).toHaveBeenCalledWith(
                "456",
                10,
                15,
                "arm",
                null,
                "colored",
                "Red and blue"
            );
        });
    });

    it("disables button while saving", async () => {
        // Mock a slow update
        (updateTattooDetails as jest.Mock).mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        render(
            <SaveEditTattoo
                tattooId="456"
                width={10}
                height={15}
                placement="arm"
                detailLevel="high"
                coloredOption="colored"
                colorDescription="Red and blue"
                onSaveAction={mockOnSave}
            />
        );

        const button = screen.getByRole("button", {name: /gem/i});
        fireEvent.click(button);

        // Button should be disabled during save
        expect(button).toBeDisabled();

        await waitFor(() => {
            expect(updateTattooDetails).toHaveBeenCalled();
        });
    });
});

