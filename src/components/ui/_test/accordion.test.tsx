import { render, screen, fireEvent } from "@testing-library/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../accordion";
import "@testing-library/jest-dom";

describe("Accordion", () => {
  it("renders accordion with items", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content for section 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content for section 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("button", { name: "Section 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Section 2" })).toBeInTheDocument();
  });

  it("expands and collapses accordion items", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Click me</AccordionTrigger>
          <AccordionContent>Hidden content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Click me" });
    
    expect(trigger).toHaveAttribute("data-state", "closed");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("applies custom className to accordion item", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="custom-class">
          <AccordionTrigger>Test</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const item = screen.getByRole("button", { name: "Test" }).closest('[data-slot="accordion-item"]');
    expect(item).toHaveClass("custom-class");
  });

  it("renders chevron icon in trigger", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Test" });
    const svg = trigger.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("shows content when accordion is opened", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test</AccordionTrigger>
          <AccordionContent>This is the content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Click to open
    const trigger = screen.getByRole("button", { name: "Test" });
    fireEvent.click(trigger);

    // Now content should be visible
    expect(screen.getByText("This is the content")).toBeVisible();
  });
});