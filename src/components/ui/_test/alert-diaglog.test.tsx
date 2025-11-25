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
                  <AlertDialogPortal>
                    <AlertDialogOverlay></AlertDialogOverlay>
                  </AlertDialogPortal>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Denne handling vil aflyse bookingen. Tatovøren vil modtage en email om aflysningen. DETTE KAN IKKE ÆNDRES!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuller</AlertDialogCancel>
                        <AlertDialogAction>Test</AlertDialogAction>
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