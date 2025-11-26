import { render, screen } from "@testing-library/react"
import { Spinner } from "../spinner"

describe("Spinner", () => {
    it("renders spinner", () => {
        render(
            <Spinner>
                Loading
            </Spinner>
        )
        expect(screen.getByText("Loading")).toBeInTheDocument();
    });

});