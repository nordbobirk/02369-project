import {fireEvent, render, screen} from "@testing-library/react"
import * as caro from "../carousel"

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
describe("Carousel", () => {
  it("renders carousel", () => {
    render(
      <caro.Carousel>
        <caro.CarouselContent>
          <caro.CarouselItem>
            carousel item 1
          </caro.CarouselItem>
          <caro.CarouselItem>
            carousel item 2
          </caro.CarouselItem>
        </caro.CarouselContent>
        <caro.CarouselNext></caro.CarouselNext>
        <caro.CarouselPrevious></caro.CarouselPrevious>
      </caro.Carousel>
    );
    
    expect(screen.getByText("carousel item 1")).toBeInTheDocument();
    expect(screen.getByText("carousel item 2")).toBeInTheDocument();
  });

  it("renders carousel responds to key press", () => {
    render(
      <caro.Carousel>
        <caro.CarouselContent>
          <caro.CarouselItem>
            carousel item 1
          </caro.CarouselItem>
          <caro.CarouselItem>
            carousel item 2
          </caro.CarouselItem>
        </caro.CarouselContent>
        <caro.CarouselNext></caro.CarouselNext>
        <caro.CarouselPrevious></caro.CarouselPrevious>
      </caro.Carousel>
    );
    
    expect(screen.getByText("carousel item 1")).toBeInTheDocument();
    expect(screen.getByText("carousel item 2")).toBeInTheDocument();
    const next = screen.getByRole("button", {name: "Next slide"});
    fireEvent.keyDown(next)
    const prev = screen.getByRole("button", {name: "Previous slide"});
    fireEvent.keyDown(prev)
  });
});