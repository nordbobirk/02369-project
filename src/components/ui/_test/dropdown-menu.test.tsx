import {screen, render, fireEvent} from "@testing-library/react"
import * as dpdw from "../dropdown-menu"

describe("Dropdown menu", () => {
  it("renders dropdown menu", () => {
    render(
      <dpdw.DropdownMenu defaultOpen={true}>
        <dpdw.DropdownMenuPortal></dpdw.DropdownMenuPortal>
        <dpdw.DropdownMenuTrigger>trigger</dpdw.DropdownMenuTrigger>
        <dpdw.DropdownMenuContent>
          <dpdw.DropdownMenuLabel>dropdown label</dpdw.DropdownMenuLabel>
          <dpdw.DropdownMenuSeparator/>
          <dpdw.DropdownMenuGroup>
            <dpdw.DropdownMenuItem>
              Menu item 1
              <dpdw.DropdownMenuShortcut></dpdw.DropdownMenuShortcut>
            </dpdw.DropdownMenuItem>
          </dpdw.DropdownMenuGroup>
          <dpdw.DropdownMenuSeparator />
          <dpdw.DropdownMenuCheckboxItem checked>
            Checkbox item
          </dpdw.DropdownMenuCheckboxItem>
          <dpdw.DropdownMenuSeparator />
          <dpdw.DropdownMenuRadioGroup value="test">
            <dpdw.DropdownMenuRadioItem value="test">
              test
            </dpdw.DropdownMenuRadioItem>
          </dpdw.DropdownMenuRadioGroup>
          <dpdw.DropdownMenuSeparator />
          <dpdw.DropdownMenuSub>
            <dpdw.DropdownMenuSubTrigger></dpdw.DropdownMenuSubTrigger>
            <dpdw.DropdownMenuSubContent>
              <dpdw.DropdownMenuItem></dpdw.DropdownMenuItem>
            </dpdw.DropdownMenuSubContent>
          </dpdw.DropdownMenuSub>
        </dpdw.DropdownMenuContent>
      </dpdw.DropdownMenu>
    )
    
    expect(screen.getByText("Menu item 1")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
  })
})
