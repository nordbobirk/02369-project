import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, UserIcon } from "lucide-react"
import Link from "next/link"

export function DropdownMenuDemo() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"secondary"} asChild>
                    <div>
                        Andrea {/* In the future get user from auth here */}
                        <UserIcon />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Link href={"/"}>
                    <DropdownMenuItem>
                        Log ud
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
