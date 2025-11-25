
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "../src/components/ui/button"


describe("Button", () => {
    it("renders button with text", () => {
        render(
            <Button>
                Test
            </Button>
        );


        expect(screen.getByText("Test")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("fires when clicked", () => {
        const x = 10;
        var y = 0
        const sum = async () => {y + x + x}
        render(
            <Button onClick={sum}>
                Sum
            </Button>
        );

        fireEvent(
            getByText(Button, "Sum"),
        new MouseEvent("click"))
        expect(screen.getByText("Sum")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(y == 20);
    })
});
