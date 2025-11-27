import {render, screen, fireEvent} from "@testing-library/react";
import {TattooImages} from "../TattooImages";
import "@testing-library/jest-dom";

describe("TattooImages", () => {
    const mockImages = [
        {id: 1, image_url: "https://example.com/image1.jpg"},
        {id: 2, image_url: "https://example.com/image2.jpg"},
        {id: 3, image_url: "https://example.com/image3.jpg"},
    ];

    it("renders 'No images' when no images provided", () => {
        render(<TattooImages images={[]}/>);
        expect(screen.getByText(/no images/i)).toBeInTheDocument();
    });

    it("renders 'No images' when images is undefined", () => {
        render(<TattooImages images={undefined}/>);
        expect(screen.getByText(/no images/i)).toBeInTheDocument();
    });

    it("renders first image by default", () => {
        render(<TattooImages images={mockImages}/>);

        const image = screen.getByAltText(/tattoo image 1/i);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
    });

    it("displays correct image counter", () => {
        render(<TattooImages images={mockImages}/>);

        expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("navigates to next image when next button is clicked", () => {
        render(<TattooImages images={mockImages}/>);

        const nextButton = screen.getByRole("button", {name: /next image/i});
        fireEvent.click(nextButton);

        const image = screen.getByAltText(/tattoo image 2/i);
        expect(image).toBeInTheDocument();
        expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });

    it("navigates to previous image when previous button is clicked", () => {
        render(<TattooImages images={mockImages}/>);

        const prevButton = screen.getByRole("button", {name: /previous image/i});
        fireEvent.click(prevButton);

        // Should wrap around to last image
        const image = screen.getByAltText(/tattoo image 3/i);
        expect(image).toBeInTheDocument();
        expect(screen.getByText("3 / 3")).toBeInTheDocument();
    });

    it("wraps around when navigating past last image", () => {
        render(<TattooImages images={mockImages}/>);

        const nextButton = screen.getByRole("button", {name: /next image/i});

        // Click next 3 times to wrap around
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);

        // Should be back at first image
        const image = screen.getByAltText(/tattoo image 1/i);
        expect(image).toBeInTheDocument();
        expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("stays on same image when only one image and next is clicked", () => {
        const singleImage = [{id: 1, image_url: "https://example.com/image1.jpg"}];
        render(<TattooImages images={singleImage}/>);

        const nextButton = screen.getByRole("button", {name: /next image/i});
        fireEvent.click(nextButton);

        const image = screen.getByAltText(/tattoo image 1/i);
        expect(image).toBeInTheDocument();
        expect(screen.getByText("1 / 1")).toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
        render(<TattooImages images={mockImages}/>);

        expect(screen.getByRole("button", {name: /previous image/i})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /next image/i})).toBeInTheDocument();
    });
});

