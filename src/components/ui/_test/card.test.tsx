import { Car } from "lucide-react"
import * as Card from "../card"
import {render, screen} from "@testing-library/react"

describe("Card", () => {
    it("renders card", () => {
        render(
            <Card.Card>
                Test Card
                <Card.CardTitle>
                    Test title
                </Card.CardTitle>
                <Card.CardHeader>
                    Test header
                </Card.CardHeader>
                <Card.CardAction>
                    Test action
                </Card.CardAction>
                <Card.CardContent>
                    Test content
                </Card.CardContent>
                <Card.CardDescription>
                    Test description
                </Card.CardDescription>
                <Card.CardFooter>
                    Test footer
                </Card.CardFooter>
            </Card.Card>
        )

        expect(screen.getByText("Test Card"));
        expect(screen.getByText("Test title"));
        expect(screen.getByText("Test header"));
        expect(screen.getByText("Test action"));
        expect(screen.getByText("Test content"));
        expect(screen.getByText("Test description"));
        expect(screen.getByText("Test footer"));
    })
})

