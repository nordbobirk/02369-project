'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getCategories } from "./actions"

export function DropSelectMenu({
  value,
  hasCreate,
  onChange,
}: {
  value: string
  hasCreate: boolean
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

  const hasCreateItem = hasCreate
  const displayLabel =
    value === "create_new"
      ? "➕ Lav ny kategori"
      : value
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : "Vælg kategori"

  return (
    <div className="w-full mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent text-left"
          >
            {displayLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" className="w-[100%] min-w-[button-width]">
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {allCategories.map((cat) => (
              <DropdownMenuRadioItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </DropdownMenuRadioItem>
            ))}

            {hasCreate && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem
                  value="create_new"
                  className="font-medium text-blue-600"
                >
                  ➕ Create new category
                </DropdownMenuRadioItem>
              </>
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
