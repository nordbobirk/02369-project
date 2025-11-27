"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Booking } from "../actions"
import ViewBooking from "../ViewBooking"
import { formatMinutesHrsMins } from "@/app/dashboard/utils/formatMinutes";


export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "status",
        header: "Status",
        filterFn: "includesString",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            // Map status to Tailwind styles
            const statusClasses: Record<string, string> = {
                pending: "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded",
                edited: "bg-blue-100 text-blue-800 px-2 py-0.5 rounded",
                confirmed: "bg-green-100 text-green-800 px-2 py-0.5 rounded",
                cancelled: "bg-red-100 text-red-800 px-2 py-0.5 rounded",
            };

            const className = statusClasses[status.toLowerCase()] || "bg-gray-100 text-gray-800 px-2 py-0.5 rounded";

            return <span className={className}>{status}</span>;
        },
    },
    {
        accessorKey: "date_and_time",
        header: "Dato",
        sortingFn: (a, b) => {
            const now = Date.now()
            const dateA = new Date(a.getValue("date_and_time")).getTime()
            const dateB = new Date(b.getValue("date_and_time")).getTime()

            const isPastA = dateA < now
            const isPastB = dateB < now

            // If one is past and the other is future → past goes last
            if (isPastA !== isPastB) {
                return isPastA ? -1 : 1
            }

            // Both are either past or both upcoming → sort newest first
            return dateB - dateA
        },
        cell: ({ row }) => {
            const raw = row.getValue("date_and_time") as string | Date
            const date = new Date(raw)
            if (isNaN(date.getTime())) return <div>Ugyldig dato</div>

            const formatted = date.toLocaleString("da-DK", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })

            const isPast = date.getTime() < Date.now()

            return (
                <div className="flex gap-2 items-center">
                    {formatted}
                    {isPast && (
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                            Over dato
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Navn",
        filterFn: "includesString",
        cell: ({ row }) => (
            <div>{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        filterFn: "includesString",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "duration",
        header: () => <div className="">Samlet varighed</div>,
        cell: ({ row }) => {
            const tattoos = row.original.tattoos
            const totalDuration = tattoos?.reduce(
                (sum, t) => sum + t.estimated_duration,
                0
            )

            return <div className=" font-medium">{formatMinutesHrsMins(totalDuration)}</div>
        },
    },
    {
        accessorKey: "price",
        header: () => <div className="">Samlet pris</div>,
        cell: ({ row }) => {
            const price = row.original.tattoos
            const totalPrice = price?.reduce(
                (sum, t) => sum + t.estimated_price,
                0
            )

            return <div className=" font-medium">{totalPrice}kr</div>
        },
    },
    {
        accessorKey: "id",
        header: "Flere detaljer",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <ViewBooking bookingId={row.getValue("id")}></ViewBooking>
            )
        },
    },
]

export default function BookingTable({ data }: { data: Booking[] }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "date_and_time", desc: true }
    ])
    // Filter state to get email and name at once
    const [globalFilter, setGlobalFilter] = React.useState("")


    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
    })

    return (
        <div className="sm:w-3/4 mx-auto">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails/navn..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />

            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-neutral-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
