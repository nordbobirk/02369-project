import { Button } from "@/components/ui/button";
import { BookImageIcon, CalendarIcon, HomeIcon, SettingsIcon } from "lucide-react";
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
                                <span className="hidden sm:inline">Hjem</span>
                            </Link>
                        </Button>

                        <Button variant="secondary" asChild>
                            <Link href="/dashboard/calendar" className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Kalender</span>
                            </Link>
                        </Button>

                        <Button variant="secondary" asChild>
                            <Link href="/dashboard/all_bookings" className="flex items-center gap-1">
                                <BookImageIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Alle bookings</span>
                            </Link>
                        </Button>

                        <Button variant="secondary" asChild>
                            <Link href="/dashboard/settings" className="flex items-center gap-1">
                                <SettingsIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Indstillinger</span>
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