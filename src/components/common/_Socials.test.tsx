import { InstagramTextLink } from "./Socials";
import { render, screen } from "@testing-library/react"

describe("Socials", () => {
    it("renders link and has correct path", () => {
        render(<InstagramTextLink text="test" />)
        const link = screen.getByText("test")
        expect(link).toHaveAttribute("href", "https://instagram.com/bebsisbadekar");
    })
})