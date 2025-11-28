import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddFAQ from '../AddFAQ'

// --- 1. Mock Child Components & Dependencies ---

// Mock DropSelectMenu component
jest.mock('../DropSelect', () => ({
  DropSelectMenu: ({ value, onChange, hasCreate }: { value: string, onChange: (val: string) => void, hasCreate: boolean }) => (
    <div data-testid="mock-drop-select">
      <span data-testid="select-value">{value}</span>
      <span data-testid="has-create">{hasCreate ? 'true' : 'false'}</span>
      {/* Simulate selecting an existing category */}
      <button onClick={() => onChange('General')}>Select General</button>
      {/* Simulate selecting "create new" option */}
      <button onClick={() => onChange('create_new')}>Create New Category</button>
    </div>
  ),
}))

// Mock createFAQ action
jest.mock('../actions', () => ({
  createFAQ: jest.fn(),
}))

// Mock Button component from ui
jest.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, type, onClick, className }: {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
    className?: string
  }) => (
    <button type={type} onClick={onClick} className={className} data-testid="submit-button">
      {children}
    </button>
  ),
}))

// Import the mocked function to control its behavior
import { createFAQ } from '../actions'
const mockCreateFAQ = createFAQ as jest.MockedFunction<typeof createFAQ>

describe('AddFAQ Component', () => {
  const mockOnFAQAddedAction = jest.fn()
  const defaultProps = {
    maxIndex: 5,
    onFAQAddedAction: mockOnFAQAddedAction,
  }

  // Mock window.alert
  const originalAlert = window.alert
  
  beforeEach(() => {
    jest.clearAllMocks()
    window.alert = jest.fn()
    mockCreateFAQ.mockResolvedValue({
      id: 99,
      category: 'General',
      question: 'Test Question?',
      answer: 'Test Answer.',
      index: 6,
    })
  })

  afterEach(() => {
    window.alert = originalAlert
  })

  it('renders the form with all required fields', () => {
    render(<AddFAQ {...defaultProps} />)

    // Check heading
    expect(screen.getByText('Tilføj ny FAQ')).toBeInTheDocument()

    // Check if DropSelectMenu is rendered
    expect(screen.getByTestId('mock-drop-select')).toBeInTheDocument()

    // Check question input
    const questionInput = screen.getByPlaceholderText('Spørgsmål')
    expect(questionInput).toBeInTheDocument()
    expect(questionInput).toHaveAttribute('name', 'question')
    expect(questionInput).toHaveAttribute('required')

    // Check answer textarea
    const answerInput = screen.getByPlaceholderText('Svar')
    expect(answerInput).toBeInTheDocument()
    expect(answerInput).toHaveAttribute('name', 'answer')
    expect(answerInput).toHaveAttribute('required')

    // Check submit button
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    expect(screen.getByText('Tilføj FAQ')).toBeInTheDocument()
  })

  it('renders DropSelectMenu with hasCreate=true', () => {
    render(<AddFAQ {...defaultProps} />)

    expect(screen.getByTestId('has-create')).toHaveTextContent('true')
  })

  it('allows selecting an existing category', () => {
    render(<AddFAQ {...defaultProps} />)

    // Initially category is empty
    expect(screen.getByTestId('select-value')).toHaveTextContent('')

    // Simulate selecting "General" category
    fireEvent.click(screen.getByText('Select General'))

    // Value should update
    expect(screen.getByTestId('select-value')).toHaveTextContent('General')
  })

  it('shows new category input when "create_new" is selected', () => {
    render(<AddFAQ {...defaultProps} />)

    // New category input should not be visible initially
    expect(screen.queryByPlaceholderText('Skriv en ny kategori...')).not.toBeInTheDocument()

    // Select "create new" option
    fireEvent.click(screen.getByText('Create New Category'))

    // New category input should now be visible
    const newCategoryInput = screen.getByPlaceholderText('Skriv en ny kategori...')
    expect(newCategoryInput).toBeInTheDocument()
    expect(newCategoryInput).toHaveAttribute('name', 'newCategory')
    expect(newCategoryInput).toHaveAttribute('required')
  })

  it('allows typing in the new category input field', () => {
    render(<AddFAQ {...defaultProps} />)

    // Select "create new" option
    fireEvent.click(screen.getByText('Create New Category'))

    // Type in new category
    const newCategoryInput = screen.getByPlaceholderText('Skriv en ny kategori...')
    fireEvent.change(newCategoryInput, { target: { value: 'Custom Category' } })

    expect(newCategoryInput).toHaveValue('Custom Category')
  })

  it('shows alert when submitting without selecting a category', async () => {
    render(<AddFAQ {...defaultProps} />)

    // Fill in question and answer but don't select category
    fireEvent.change(screen.getByPlaceholderText('Spørgsmål'), {
      target: { value: 'Test Question?' },
    })
    fireEvent.change(screen.getByPlaceholderText('Svar'), {
      target: { value: 'Test Answer.' },
    })

    // Submit form
    const form = screen.getByTestId('submit-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Vælg venligst en kategori før du sender.')
    })

    // createFAQ should not have been called
    expect(mockCreateFAQ).not.toHaveBeenCalled()
    expect(mockOnFAQAddedAction).not.toHaveBeenCalled()
  })

  it('submits form with existing category successfully', async () => {
    render(<AddFAQ {...defaultProps} />)

    // Select existing category
    fireEvent.click(screen.getByText('Select General'))

    // Fill in fields
    fireEvent.change(screen.getByPlaceholderText('Spørgsmål'), {
      target: { value: 'How do I book?' },
    })
    fireEvent.change(screen.getByPlaceholderText('Svar'), {
      target: { value: 'Click the booking button.' },
    })

    // Submit form
    const form = screen.getByTestId('submit-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockCreateFAQ).toHaveBeenCalledWith(
        'General',
        'How do I book?',
        'Click the booking button.',
        6 // maxIndex + 1
      )
    })

    await waitFor(() => {
      expect(mockOnFAQAddedAction).toHaveBeenCalledWith({
        id: 99,
        category: 'General',
        question: 'Test Question?',
        answer: 'Test Answer.',
        index: 6,
      })
    })
  })

  it('submits form with new category successfully', async () => {
    render(<AddFAQ {...defaultProps} />)

    // Select "create new" option
    fireEvent.click(screen.getByText('Create New Category'))

    // Type new category name
    fireEvent.change(screen.getByPlaceholderText('Skriv en ny kategori...'), {
      target: { value: '  New Custom Category  ' }, // with spaces to test trim
    })

    // Fill in fields
    fireEvent.change(screen.getByPlaceholderText('Spørgsmål'), {
      target: { value: 'Custom Question?' },
    })
    fireEvent.change(screen.getByPlaceholderText('Svar'), {
      target: { value: 'Custom Answer.' },
    })

    // Submit form
    const form = screen.getByTestId('submit-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockCreateFAQ).toHaveBeenCalledWith(
        'New Custom Category', // trimmed
        'Custom Question?',
        'Custom Answer.',
        6 // maxIndex + 1
      )
    })

    await waitFor(() => {
      expect(mockOnFAQAddedAction).toHaveBeenCalled()
    })
  })

  it('uses correct maxIndex when creating FAQ', async () => {
    const customProps = {
      maxIndex: 10,
      onFAQAddedAction: mockOnFAQAddedAction,
    }

    render(<AddFAQ {...customProps} />)

    // Select category
    fireEvent.click(screen.getByText('Select General'))

    // Fill in fields
    fireEvent.change(screen.getByPlaceholderText('Spørgsmål'), {
      target: { value: 'Q' },
    })
    fireEvent.change(screen.getByPlaceholderText('Svar'), {
      target: { value: 'A' },
    })

    // Submit
    const form = screen.getByTestId('submit-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockCreateFAQ).toHaveBeenCalledWith('General', 'Q', 'A', 11) // maxIndex + 1 = 11
    })
  })

  it('hides new category input when switching back to existing category', () => {
    render(<AddFAQ {...defaultProps} />)

    // Select "create new" to show the input
    fireEvent.click(screen.getByText('Create New Category'))
    expect(screen.getByPlaceholderText('Skriv en ny kategori...')).toBeInTheDocument()

    // Switch back to existing category
    fireEvent.click(screen.getByText('Select General'))
    expect(screen.queryByPlaceholderText('Skriv en ny kategori...')).not.toBeInTheDocument()
  })
})

