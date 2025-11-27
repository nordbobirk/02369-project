import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import FAQList from '../FAQList'
import { reorderFAQ } from '../actions'

// --- 1. Global Variables for Mock Control ---
// We use these to control the behavior of mocks dynamically inside tests
let mockIsDraggingId: number | null = null

// --- 2. Mock Next.js Image ---
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}))

// --- 3. Mock Server Actions ---
jest.mock('../actions', () => ({
  reorderFAQ: jest.fn(),
}))

// --- 4. Mock Child Components ---

jest.mock('../AddFAQ', () => {
  return function MockAddFAQ({
    onFAQAddedAction,
    maxIndex,
  }: {
    onFAQAddedAction: Function
    maxIndex: number
  }) {
    return (
      <div data-testid="add-faq-container">
        <span data-testid="max-index-value">{maxIndex}</span>
        <button
          onClick={() =>
            onFAQAddedAction({
              id: 999,
              category: 'New Category',
              question: 'New Question',
              answer: 'New Answer',
              index: maxIndex + 1,
            })
          }
        >
          Simulate Add
        </button>
      </div>
    )
  }
})

jest.mock('../DeleteFAQ', () => {
  return function MockDeleteFAQ({ onDeletedAction }: { onDeletedAction: Function }) {
    return <button onClick={() => onDeletedAction()}>Simulate Delete</button>
  }
})

jest.mock('../EditFAQ', () => {
  return function MockEditFAQ({
    id,
    category,
    question,
    answer,
    onCategoryChange,
    onQuestionChange,
    onAnswerChange,
    onSavedAction,
    onCancelAction,
  }: any) {
    return (
      <div data-testid="edit-mode-container">
        {/* Render current values to verify state updates */}
        <span data-testid="edit-val-category">{category}</span>
        <span data-testid="edit-val-question">{question}</span>
        <span data-testid="edit-val-answer">{answer}</span>

        {/* Inputs to trigger state changes */}
        <button onClick={() => onCategoryChange('Cat Updated')}>Change Cat</button>
        <button onClick={() => onQuestionChange('Que Updated')}>Change Que</button>
        <button onClick={() => onAnswerChange('Ans Updated')}>Change Ans</button>

        <button onClick={onCancelAction}>Cancel</button>
        
        {/* IMPORTANT: Call Save AND Cancel to simulate full flow */}
        <button
          onClick={() => {
            onSavedAction({ id, category, question, answer })
            onCancelAction()
          }}
        >
          Save
        </button>
      </div>
    )
  }
})

// --- 5. Mock UI Components ---
jest.mock('../../../../../components/ui/button', () => ({
  Button: ({ onClick, children, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

// --- 6. Mock Dnd-Kit ---
// We mock DndContext to expose the `onDragEnd` handler via a button so we can trigger it manually.
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: ({ children, onDragEnd }: any) => (
    <div>
      <button
        data-testid="trigger-drag-end"
        onClick={() =>
          // Simulate dragging ID 1 over ID 2
          onDragEnd({
            active: { id: 1 },
            over: { id: 2 },
          })
        }
      >
        Trigger Drag End
      </button>
      {children}
    </div>
  ),
  useSensor: jest.fn(),
  useSensors: jest.fn(),
}))

// We mock useSortable to control `isDragging` via our global variable `mockIsDraggingId`
jest.mock('@dnd-kit/sortable', () => ({
  ...jest.requireActual('@dnd-kit/sortable'),
  SortableContext: ({ children }: any) => <div>{children}</div>,
  useSortable: ({ id }: { id: number }) => ({
    attributes: {},
    listeners: {},
    setNodeRef: (node: any) => node,
    transform: null,
    transition: null,
    isDragging: mockIsDraggingId === id, // Dynamic check
  }),
  verticalListSortingStrategy: {}, // Mock strategy
  arrayMove: (items: any[], oldIndex: number, newIndex: number) => {
    // Simple mock implementation of array move
    const newItems = [...items]
    const [removed] = newItems.splice(oldIndex, 1)
    newItems.splice(newIndex, 0, removed)
    return newItems
  },
}))

// --- Test Data ---
const mockInitialFAQs = [
  { id: 1, category: 'Cat1', question: 'Q1', answer: 'A1', index: 0 },
  { id: 2, category: 'Cat2', question: 'Q2', answer: 'A2', index: 1 },
]

describe('FAQList Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsDraggingId = null // Reset dragging state
  })

  // 1. Initial Render & Empty State Coverage
  it('handles empty list correctly (maxIndex fallback)', () => {
    render(<FAQList initialFAQs={[]} />)
    
    // Check if AddFAQ received 0 as maxIndex (covering `?? 0` branch)
    expect(screen.getByTestId('max-index-value')).toHaveTextContent('0')
    
    // Add one to verify it works from empty
    fireEvent.click(screen.getByText('Simulate Add'))
    expect(screen.getByText('New Question')).toBeInTheDocument()
  })

  // 2. Add / Delete Coverage
  it('calculates maxIndex correctly with items and handles deletion', () => {
    render(<FAQList initialFAQs={mockInitialFAQs} />)
    
    // maxIndex should be 1 (index of last item)
    expect(screen.getByTestId('max-index-value')).toHaveTextContent('1')

    // Delete item ID 1
    const deleteBtns = screen.getAllByText('Simulate Delete')
    fireEvent.click(deleteBtns[0])
    
    expect(screen.queryByText('Q1')).not.toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
  })

  // 3. Edit Mode State Updates (Category, Question, Answer)
  it('updates all fields in edit mode and saves', () => {
    render(<FAQList initialFAQs={mockInitialFAQs} />)

    // Enter Edit Mode for Item 1
    const editBtns = screen.getAllByText('Rediger')
    fireEvent.click(editBtns[0])

    // Verify initial values passed to EditFAQ
    expect(screen.getByTestId('edit-val-category')).toHaveTextContent('Cat1')
    expect(screen.getByTestId('edit-val-question')).toHaveTextContent('Q1')
    expect(screen.getByTestId('edit-val-answer')).toHaveTextContent('A1')

    // Trigger ALL changes (covers setEditCategory, setEditQuestion, setEditAnswer)
    fireEvent.click(screen.getByText('Change Cat'))
    fireEvent.click(screen.getByText('Change Que'))
    fireEvent.click(screen.getByText('Change Ans'))

    // Verify state updated inside the mock (which reflects parent state)
    expect(screen.getByTestId('edit-val-category')).toHaveTextContent('Cat Updated')
    expect(screen.getByTestId('edit-val-question')).toHaveTextContent('Que Updated')
    expect(screen.getByTestId('edit-val-answer')).toHaveTextContent('Ans Updated')

    // Save
    fireEvent.click(screen.getByText('Save'))

    // Verify Edit Mode exited
    expect(screen.queryByTestId('edit-mode-container')).not.toBeInTheDocument()

    // Verify List Updated
    expect(screen.getByText('Cat Updated')).toBeInTheDocument()
    expect(screen.getByText('Que Updated')).toBeInTheDocument()
  })

  // 4. Edit Mode Cancel
  it('resets state on cancel', () => {
    render(<FAQList initialFAQs={mockInitialFAQs} />)
    
    // Enter Edit
    fireEvent.click(screen.getAllByText('Rediger')[0])
    
    // Change something
    fireEvent.click(screen.getByText('Change Que'))
    
    // Cancel
    fireEvent.click(screen.getByText('Cancel'))
    
    // Expect original text to remain
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.queryByText('Que Updated')).not.toBeInTheDocument()
  })

  // 5. Drag & Drop Reordering Logic (The Complex Part)
  it('reorders items and calls server action on drag end', async () => {
    render(<FAQList initialFAQs={mockInitialFAQs} />)

    // Initial Order: Q1 then Q2
    const questionsBefore = screen.getAllByRole('heading', { level: 3 })
    expect(questionsBefore[0]).toHaveTextContent('Q1')
    expect(questionsBefore[1]).toHaveTextContent('Q2')

    // Trigger the mocked DragEnd event (Simulates moving ID 1 to position of ID 2)
    // This covers: arrayMove, setFaqs update, and reorderFAQ call
    fireEvent.click(screen.getByTestId('trigger-drag-end'))

    // Wait for UI update (Optimistic update)
    // Q2 should now be first, Q1 second
    await waitFor(() => {
        const questionsAfter = screen.getAllByRole('heading', { level: 3 })
        expect(questionsAfter[0]).toHaveTextContent('Q2')
        expect(questionsAfter[1]).toHaveTextContent('Q1')
    })

    // Verify Server Action was called
    // active.id was 1 (number), newIndex is 1 (because it swapped with index 1)
    expect(reorderFAQ).toHaveBeenCalledWith(1, 1)
  })

  // 6. Styling Coverage (Opacity check)
  it('applies opacity style when item is dragging', () => {
    // Set the global variable so item with ID 1 renders as "dragging"
    mockIsDraggingId = 1
    
    render(<FAQList initialFAQs={mockInitialFAQs} />)

    // Find the container div for item 1
    // Note: Since we render multiple items, we need to find the specific one.
    // The component structure is: <div style={{opacity...}}> ... <h3>Q1</h3> ... </div>
    const item1Title = screen.getByText('Q1')
    // Traverse up to the container div that has the style
    const container1 = item1Title.closest('.bg-white') 
    
    expect(container1).toHaveStyle('opacity: 0.5')

    // Check item 2 (not dragging)
    const item2Title = screen.getByText('Q2')
    const container2 = item2Title.closest('.bg-white')
    expect(container2).toHaveStyle('opacity: 1')
  })
})