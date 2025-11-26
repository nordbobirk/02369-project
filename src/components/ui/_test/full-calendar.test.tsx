import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { 
    Calendar,
    CalendarCurrentDate,
    CalendarDayView,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarWeekView,
    CalendarYearView,
    CalendarEvent 
 } from "../full-calendar";




// Mock the server-side functions
jest.mock("react-hotkeys-hook", () => ({
  useHotkeys: jest.fn(),
})); 

describe("Full calendar", () => {
  
    
    const mockEvents: CalendarEvent[] = [
      { id: "1", start: new Date('2025-11-15T10:00:00Z'), 
        end: new Date('2025-11-15T11:00:00Z'), title: "John Test", color: "green" },
      { id: "2", start: new Date('2025-11-15T11:30:00Z'), 
        end: new Date('2025-11-15T12:30:00Z'), title: "Jane Test", color: "green" },
    ];

    
  

  it("renders the calendar and shows bookings", async () => {
    render(
        <Calendar
        events={mockEvents}>
            <CalendarViewTrigger view="day">
                dag
            </CalendarViewTrigger>
            <CalendarViewTrigger view="week">
                uge
            </CalendarViewTrigger>
            <CalendarViewTrigger view="month">
                måned
            </CalendarViewTrigger>
            <CalendarViewTrigger view="year">
                år
            </CalendarViewTrigger>
            <CalendarCurrentDate />
            <CalendarPrevTrigger>
            </CalendarPrevTrigger>
            <CalendarTodayTrigger>
            </CalendarTodayTrigger>
            <CalendarNextTrigger>
                next
            </CalendarNextTrigger>
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
            
        </Calendar>
        );
        
        const dayViewButton = screen.getByRole("button", {name: "dag"});
        const weekViewButton = screen.getByRole("button", {name: "uge"});
        const monthViewButton = screen.getByRole("button", {name: "måned"});
        const yearViewButton = screen.getByRole("button", {name: "år"});
        const nextTrigger = screen.getByRole("button", {name: "next"})

        fireEvent.click(dayViewButton)
        await waitFor(() =>{
        expect(screen.getByText("9:00")).toBeInTheDocument()
        })
        
        fireEvent.click(weekViewButton)
        await waitFor(() =>{
        expect(screen.getByText("man.")).toBeInTheDocument()
        })
        
        fireEvent.click(monthViewButton)
        await waitFor(() =>{
        expect(screen.getByText("ti")).toBeInTheDocument()
        expect(screen.getByText("John Test")).toBeInTheDocument()
        })

        // Get year view and view next year
        fireEvent.click(yearViewButton)
        fireEvent.click(nextTrigger)
        await waitFor(() =>{
        expect(screen.getByText("november 2026")).toBeInTheDocument()
        })
        
   
  });
});

