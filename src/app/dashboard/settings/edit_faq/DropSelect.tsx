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

export function DropSelectMenu() {
  const [category, setCategory] = React.useState("")
  const [allCategories, setAllCategories] = React.useState<string[]>([])

  React.useEffect(() => {
    async function fetchCategories() {
      const categories = await getCategories() // [{ Category: "common questionx" }, ...]
      // Extract string and remove duplicates
      const uniqueCategories = Array.from(
        new Set(categories.map((c: { category: string }) => c.category))
      )
      setAllCategories(uniqueCategories)
    }
    fetchCategories()
  }, []) // empty dependency array ensures fetch runs only once

  const displayLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Choose category"

  return (
    <div className="w-full mb-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            {displayLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
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
