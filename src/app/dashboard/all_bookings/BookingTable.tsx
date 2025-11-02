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
import { ArrowUpDown } from "lucide-react"


export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown></ArrowUpDown>
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
        sortingFn: (a, b) => {
            // optional custom logic if you want specific order
            const order = ["pending", "edited","confirmed", "customer_cancelled", "artist_cancelled", "done"]
            const aVal = (a.getValue("status") as string)?.toLowerCase() ?? ""
            const bVal = (b.getValue("status") as string)?.toLowerCase() ?? ""

            const aIndex = order.indexOf(aVal)
            const bIndex = order.indexOf(bVal)

            // if both are known statuses, sort by that order
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex

            // fallback to normal ASCII comparison
            return aVal.localeCompare(bVal)
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "date_and_time",
        header: "Dato",
        cell: ({ row }) => {
            const raw = row.getValue("date_and_time") as string | Date

            // Try to safely convert it into a Date
            const date = new Date(raw)

            // Fallback if invalid
            if (isNaN(date.getTime())) return <div>Ugyldig dato</div>

            // Format using toLocaleString
            const formatted = date.toLocaleString("da-DK", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })

            return <div>{formatted}</div>
        },
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

            const hrs = Math.floor(totalDuration / 60)
            const mins = totalDuration % 60

            return <div className=" font-medium">{hrs} timer, {mins} min</div>
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
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="sm:w-3/4 mx-auto">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
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
