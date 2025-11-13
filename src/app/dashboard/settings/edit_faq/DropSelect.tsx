"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCategories } from "./actions"

export function DropSelectMenu({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [allCategories, setAllCategories] = React.useState<string[]>([])

  React.useEffect(() => {
    async function fetchCategories() {
      const categories = await getCategories()
      const uniqueCategories = Array.from(
        new Set(categories.map((c: { category: string }) => c.category))
      )
      setAllCategories(uniqueCategories)
    }
    fetchCategories()
  }, [])

  const displayLabel = value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Vælg kategori"

  return (
    <div className="w-full mb-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            {displayLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {allCategories.map((cat) => (
              <DropdownMenuRadioItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
