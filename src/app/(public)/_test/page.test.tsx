import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (props: any) => {
        const {priority, fill, ...rest} = props;
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...rest} data-priority={priority} data-fill={fill} />;
    },
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
    // eslint-disable-next-line react/display-name
    return ({children, href}: {children: React.ReactNode; href: string}) => <a href={href}>{children}</a>;
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    CalendarClock: () => <span data-testid="calendar-icon">CalendarIcon</span>,
}));

// Mock Button component - must be before the component import
jest.mock("../../../components/ui/button", () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    Button: ({children, className, asChild, variant, size, ...props}: any) => {
        if (asChild) {
            return <>{children}</>;
        }
        return <button className={className} {...props}>{children}</button>;
    },
}));

// Mock Carousel components - must be before the component import
jest.mock("../../../components/ui/carousel", () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    Carousel: ({children, ...props}: any) => <div data-testid="carousel" {...props}>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    CarouselContent: ({children, ...props}: any) => <div data-testid="carousel-content" {...props}>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    CarouselItem: ({children, ...props}: any) => <div data-testid="carousel-item" {...props}>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    CarouselPrevious: (props: any) => <button data-testid="carousel-prev" {...props}>Previous</button>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    CarouselNext: (props: any) => <button data-testid="carousel-next" {...props}>Next</button>,
}));

// Mock Card components - must be before the component import
jest.mock("../../../components/ui/card", () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    Card: ({children, ...props}: any) => <div data-testid="card" {...props}>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    CardContent: ({children, ...props}: any) => <div data-testid="card-content" {...props}>{children}</div>,
}));

import Home from "../page";

describe("Home Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Page Header", () => {
        it("renders the main heading", () => {
            render(<Home />);
            expect(screen.getByText("Bebsis Badekar")).toBeInTheDocument();
        });

        it("renders the subheading", () => {
            render(<Home />);
            expect(screen.getByText("Tats by Andrea Carlberg")).toBeInTheDocument();
        });
    });

    describe("Navigation Buttons", () => {
        it("renders 'Book tid' button with correct link", () => {
            render(<Home />);
            const link = screen.getByRole("link", {name: /book tid/i});
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "/booking");
        });

        it("renders FAQ button with correct link", () => {
            render(<Home />);
            const link = screen.getByRole("link", {name: /FAQ/i});
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "/faq");
        });

        it("renders Aftercare button with correct link", () => {
            render(<Home />);
            const link = screen.getByRole("link", {name: /aftercare/i});
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "/aftercare");
        });

        it("renders 'Før din tid' button with correct link", () => {
            render(<Home />);
            const link = screen.getByRole("link", {name: /før din tid/i});
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "/beforeBooking");
        });

        it("renders all four navigation buttons", () => {
            render(<Home />);
            const links = screen.getAllByRole("link");
            expect(links).toHaveLength(4);
        });
    });

    describe("Image Carousel", () => {
        it("renders the carousel component", () => {
            render(<Home />);
            expect(screen.getByTestId("carousel")).toBeInTheDocument();
        });

        it("renders all 5 carousel items", () => {
            render(<Home />);
            const carouselItems = screen.getAllByTestId("carousel-item");
            expect(carouselItems).toHaveLength(5);
        });

        it("renders images with correct src URLs", () => {
            render(<Home />);
            const images = screen.getAllByRole("img");
            
            expect(images[0]).toHaveAttribute(
                "src",
                "https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/public/assets/CarouselContent/c1.jpg"
            );
            expect(images[1]).toHaveAttribute(
                "src",
                "https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/public/assets/CarouselContent/c2.jpg"
            );
            expect(images[2]).toHaveAttribute(
                "src",
                "https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/public/assets/CarouselContent/c3.jpg"
            );
            expect(images[3]).toHaveAttribute(
                "src",
                "https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/public/assets/CarouselContent/c4.jpg"
            );
            expect(images[4]).toHaveAttribute(
                "src",
                "https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/public/assets/CarouselContent/c5.jpg"
            );
        });

        it("renders images with correct alt text", () => {
            render(<Home />);
            
            expect(screen.getByAltText("Slide 1")).toBeInTheDocument();
            expect(screen.getByAltText("Slide 2")).toBeInTheDocument();
            expect(screen.getByAltText("Slide 3")).toBeInTheDocument();
            expect(screen.getByAltText("Slide 4")).toBeInTheDocument();
            expect(screen.getByAltText("Slide 5")).toBeInTheDocument();
        });

        it("renders carousel navigation buttons", () => {
            render(<Home />);
            
            expect(screen.getByTestId("carousel-prev")).toBeInTheDocument();
            expect(screen.getByTestId("carousel-next")).toBeInTheDocument();
        });
    });

    describe("Page Layout", () => {
        it("renders main element", () => {
            render(<Home />);
            const main = screen.getByRole("main");
            expect(main).toBeInTheDocument();
        });

        it("renders two sections (content and carousel)", () => {
            const {container} = render(<Home />);
            const sections = container.querySelectorAll("section");
            expect(sections).toHaveLength(2);
        });
    });
});

