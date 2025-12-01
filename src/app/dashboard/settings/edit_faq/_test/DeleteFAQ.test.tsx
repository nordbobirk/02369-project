import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DeleteFAQ from '../DeleteFAQ'

// --- 1. Mock Dependencies ---

// Mock deleteFAQ action
jest.mock('../actions', () => ({
  deleteFAQ: jest.fn(),
}))

// Mock Button component from ui
jest.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, type, onClick, className }: {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
    className?: string
  }) => (
    <button type={type} onClick={onClick} className={className} data-testid="delete-button">
      {children}
    </button>
  ),
}))

// Import the mocked function to control its behavior
import { deleteFAQ } from '../actions'
const mockDeleteFAQ = deleteFAQ as jest.MockedFunction<typeof deleteFAQ>

describe('DeleteFAQ Component', () => {
  const mockOnDeletedAction = jest.fn()
  const defaultProps = {
    id: 42,
    onDeletedAction: mockOnDeletedAction,
  }

  // Mock window.confirm
  const originalConfirm = window.confirm

  beforeEach(() => {
    jest.clearAllMocks()
    window.confirm = jest.fn()
    mockDeleteFAQ.mockResolvedValue(undefined)
  })

  afterEach(() => {
    window.confirm = originalConfirm
  })

  it('renders the delete button', () => {
    render(<DeleteFAQ {...defaultProps} />)

    const deleteButton = screen.getByTestId('delete-button')
    expect(deleteButton).toBeInTheDocument()
    expect(deleteButton).toHaveTextContent('Delete')
    expect(deleteButton).toHaveAttribute('type', 'submit')
  })

  it('renders with correct styling classes', () => {
    render(<DeleteFAQ {...defaultProps} />)

    const deleteButton = screen.getByTestId('delete-button')
    expect(deleteButton).toHaveClass('bg-rose-300', 'hover:bg-rose-400', 'text-white', 'font-semibold', 'rounded-xl', 'px-4', 'py-2', 'shadow-sm')
  })

  it('renders form with inline class', () => {
    const { container } = render(<DeleteFAQ {...defaultProps} />)

    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('inline')
  })

  it('shows confirmation dialog when delete button is clicked', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false)

    render(<DeleteFAQ {...defaultProps} />)

    const form = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this FAQ?')
    })
  })

  it('does not delete FAQ when user cancels confirmation', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false)

    render(<DeleteFAQ {...defaultProps} />)

    const form = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled()
    })

    // deleteFAQ should not have been called
    expect(mockDeleteFAQ).not.toHaveBeenCalled()
    expect(mockOnDeletedAction).not.toHaveBeenCalled()
  })

  it('deletes FAQ when user confirms deletion', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true)

    render(<DeleteFAQ {...defaultProps} />)

    const form = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this FAQ?')
    })

    await waitFor(() => {
      expect(mockDeleteFAQ).toHaveBeenCalledWith(42)
    })

    await waitFor(() => {
      expect(mockOnDeletedAction).toHaveBeenCalledTimes(1)
    })
  })

  it('calls deleteFAQ with correct id', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true)

    const customProps = {
      id: 123,
      onDeletedAction: mockOnDeletedAction,
    }

    render(<DeleteFAQ {...customProps} />)

    const form = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockDeleteFAQ).toHaveBeenCalledWith(123)
    })
  })

  it('calls onDeletedAction callback after successful deletion', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true)

    render(<DeleteFAQ {...defaultProps} />)

    const form = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockOnDeletedAction).toHaveBeenCalledTimes(1)
    })
  })

  it('calls deleteFAQ action with correct id when confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true)

    render(<DeleteFAQ {...defaultProps} />)

    const form = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockDeleteFAQ).toHaveBeenCalledWith(42)
      expect(mockOnDeletedAction).toHaveBeenCalled()
    })
  })

  it('works with multiple instances having different ids', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true)

    const { rerender } = render(<DeleteFAQ id={1} onDeletedAction={mockOnDeletedAction} />)

    const form1 = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form1)

    await waitFor(() => {
      expect(mockDeleteFAQ).toHaveBeenCalledWith(1)
    })

    jest.clearAllMocks()

    rerender(<DeleteFAQ id={2} onDeletedAction={mockOnDeletedAction} />)

    const form2 = screen.getByTestId('delete-button').closest('form')!
    fireEvent.submit(form2)

    await waitFor(() => {
      expect(mockDeleteFAQ).toHaveBeenCalledWith(2)
    })
  })
})

