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
                <div className="m-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" asChild>
                            <Link href="/dashboard" className="flex items-center gap-1">
                                <HomeIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                        </Button>

                        <Button variant="secondary" asChild>
                            <Link href="/calendar" className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Calendar</span>
                            </Link>
                        </Button>

                        <Button variant="secondary" asChild>
                            <Link href="/dashboard/settings" className="flex items-center gap-1">
                                <SettingsIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </Link>
                        </Button>
                    </div>
                    <div className="ml-auto">
                        <DropdownMenuDemo />
                    </div>
                </div>
            </header>
            {children}
        </div>
    );
}