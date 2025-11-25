import { render, screen, fireEvent } from "@testing-library/react";
import {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "../alert-dialog";
import "@testing-library/jest-dom";
import { Button } from "../button"


describe("Alert-dialog", () => {
    it("renders alert-dialog", () => {
        render(
            <AlertDialog open={true}>
                <AlertDialogTrigger asChild>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Denne handling vil aflyse bookingen. Tatovøren vil modtage en email om aflysningen. DETTE KAN IKKE ÆNDRES!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuller</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );


        expect(screen.getByText("Er du sikker?")).toBeInTheDocument();
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("rendered dialog box should close, when cancel is clicked", () => {
        
        
        render(
            <AlertDialog defaultOpen={true}>
                <AlertDialogTrigger asChild>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Denne handling vil aflyse bookingen. Tatovøren vil modtage en email om aflysningen. DETTE KAN IKKE ÆNDRES!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuller</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
        
       
        const button = screen.getByRole("button", { name: "Annuller"})
        const dialog = screen.getByRole("alertdialog")
        expect(dialog).toHaveAttribute("data-state", "open");
        // Alert closes when "Annuller" is pressed 
        fireEvent.click(button);
        expect(dialog).toHaveAttribute("data-state", "closed");
        
    })
});
/* it("expands and collapses accordion items", () => {
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
}); */