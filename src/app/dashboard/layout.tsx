import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { CalendarIcon, HomeIcon, MoveRightIcon, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { DropdownMenuDemo } from "./DropdownMenu";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <header>
                <div className="m-8 flex border shadow-sm rounded-xl p-3 justify-between">
                    <div className="flex flex-row space-x-3 justify-">
                        <Button variant={"secondary"} asChild>
                            <Link href={"/dashboard"}>
                                <HomeIcon /> Home
                            </Link>
                        </Button>
                        <Button variant={"secondary"} asChild>
                            <Link href={"/calendar"}>
                                <CalendarIcon /> Calendar
                            </Link>
                        </Button>
                        <Button variant={"secondary"} asChild>
                            <Link href="/dashboard/settings">
                                <SettingsIcon />
                                Settings
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-col">
                        <DropdownMenuDemo></DropdownMenuDemo>
                    </div>
                </div>
            </header>
            {children}
        </div>
    );
}