import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditFAQ from '../EditFAQ'

// --- 1. Mock Child Components ---
// We mock these to isolate EditFAQ. We want to ensure EditFAQ passes 
// the correct props and callbacks to these children.

jest.mock('../DropSelect', () => ({
  DropSelectMenu: ({ value, onChange }: { value: string, onChange: Function }) => (
    <div data-testid="mock-drop-select">
      <span data-testid="select-value">{value}</span>
      {/* Button to simulate selecting a new category */}
      <button onClick={() => onChange('Updated Category')}>Select New Category</button>
    </div>
  ),
}))

jest.mock('../SaveEditedFAQ', () => ({
  __esModule: true,
  default: ({ id, category, question, answer, onSavedAction }: any) => (
    <div data-testid="mock-save-component">
      {/* We render the received props to verify EditFAQ passed them correctly */}
      <span data-testid="save-prop-id">{id}</span>
      <span data-testid="save-prop-category">{category}</span>
      <span data-testid="save-prop-question">{question}</span>
      <span data-testid="save-prop-answer">{answer}</span>
      <button onClick={() => onSavedAction({ id, category, question, answer })}>
        Simulate Save
      </button>
    </div>
  ),
}))

jest.mock('../CancelEdit', () => ({
  __esModule: true,
  default: ({ onCancelAction }: { onCancelAction: React.MouseEventHandler }) => (
    <button data-testid="mock-cancel-btn" onClick={onCancelAction}>
      Simulate Cancel
    </button>
  ),
}))

describe('EditFAQ Component', () => {
  // Setup default props to reuse in tests
  const defaultProps = {
    id: 123,
    category: 'General',
    question: 'Original Question?',
    answer: 'Original Answer.',
    onCategoryChange: jest.fn(),
    onQuestionChange: jest.fn(),
    onAnswerChange: jest.fn(),
    onCancelAction: jest.fn(),
    onSavedAction: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders input fields with initial values', () => {
    render(<EditFAQ {...defaultProps} />)

    // Check Question Input
    const questionInput = screen.getByPlaceholderText('Question')
    expect(questionInput).toBeInTheDocument()
    expect(questionInput).toHaveValue('Original Question?')

    // Check Answer Textarea
    const answerInput = screen.getByPlaceholderText('Answer')
    expect(answerInput).toBeInTheDocument()
    expect(answerInput).toHaveValue('Original Answer.')

    // Check Hidden Input (Technical requirement check)
    // Hidden inputs are not visible, so we search by selector/attribute
    const hiddenInput = document.querySelector('input[name="category"]')
    expect(hiddenInput).toHaveValue('General')
  })

  it('calls onQuestionChange when typing in the question field', () => {
    render(<EditFAQ {...defaultProps} />)

    const questionInput = screen.getByPlaceholderText('Question')
    fireEvent.change(questionInput, { target: { value: 'New Question?' } })

    expect(defaultProps.onQuestionChange).toHaveBeenCalledTimes(1)
    expect(defaultProps.onQuestionChange).toHaveBeenCalledWith('New Question?')
  })

  it('calls onAnswerChange when typing in the answer field', () => {
    render(<EditFAQ {...defaultProps} />)

    const answerInput = screen.getByPlaceholderText('Answer')
    fireEvent.change(answerInput, { target: { value: 'New Answer.' } })

    expect(defaultProps.onAnswerChange).toHaveBeenCalledTimes(1)
    expect(defaultProps.onAnswerChange).toHaveBeenCalledWith('New Answer.')
  })

  it('renders DropSelectMenu and handles category change', () => {
    render(<EditFAQ {...defaultProps} />)

    // Check if mock rendered with initial value
    expect(screen.getByTestId('select-value')).toHaveTextContent('General')

    // Simulate change from inside the child component
    fireEvent.click(screen.getByText('Select New Category'))

    expect(defaultProps.onCategoryChange).toHaveBeenCalledTimes(1)
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('Updated Category')
  })

  it('passes correct props to SaveEditedFAQ child component', () => {
    render(<EditFAQ {...defaultProps} />)

    // Verify the mock received the data via props
    expect(screen.getByTestId('save-prop-id')).toHaveTextContent('123')
    expect(screen.getByTestId('save-prop-category')).toHaveTextContent('General')
    expect(screen.getByTestId('save-prop-question')).toHaveTextContent('Original Question?')
    expect(screen.getByTestId('save-prop-answer')).toHaveTextContent('Original Answer.')
  })

  it('wires up the CancelEdit component correctly', () => {
    render(<EditFAQ {...defaultProps} />)

    const cancelBtn = screen.getByTestId('mock-cancel-btn')
    fireEvent.click(cancelBtn)

    expect(defaultProps.onCancelAction).toHaveBeenCalledTimes(1)
  })
})