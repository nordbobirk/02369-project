import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DropSelectMenu } from '../DropSelect'

// --- 1. Mock Dependencies ---

// Mock getCategories action
jest.mock('../actions', () => ({
  getCategories: jest.fn(),
}))

// Mock Button component
jest.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, variant, className, onClick }: {
    children: React.ReactNode
    variant?: string
    className?: string
    onClick?: () => void
  }) => (
    <button onClick={onClick} className={className} data-testid="dropdown-trigger" data-variant={variant}>
      {children}
    </button>
  ),
}))

// Mock Dropdown Menu components
jest.mock('../../../../../components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { asChild?: boolean; children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger-wrapper">{children}</div>
  ),
  DropdownMenuContent: ({ children, align, side, className }: {
    children: React.ReactNode
    align?: string
    side?: string
    className?: string
  }) => (
    <div data-testid="dropdown-content" data-align={align} data-side={side} className={className}>
      {children}
    </div>
  ),
  DropdownMenuRadioGroup: ({ children, value, onValueChange }: {
    children: React.ReactNode
    value: string
    onValueChange: (val: string) => void
  }) => {
    // Store the onValueChange callback in a context-like way
    const enhanceChildren = (nodes: React.ReactNode): React.ReactNode => {
      return React.Children.map(nodes, (child) => {
        if (!React.isValidElement(child)) return child

        const childProps = child.props as Record<string, unknown>

        // If it's a fragment, enhance its children
        if (child.type === React.Fragment) {
          return React.cloneElement(child, childProps as never, enhanceChildren(childProps.children as React.ReactNode))
        }

        // If it has an onValueChangeCallback prop (our RadioItem), pass the callback
        if ('value' in childProps) {
          return React.cloneElement(child, { ...childProps, onValueChangeCallback: onValueChange } as never)
        }

        // For other elements (like separator), just return them with enhanced children if they have any
        if (childProps.children) {
          return React.cloneElement(child, childProps as never, enhanceChildren(childProps.children as React.ReactNode))
        }

        return child
      })
    }

    return (
      <div data-testid="radio-group" data-value={value}>
        {enhanceChildren(children)}
      </div>
    )
  },
  DropdownMenuRadioItem: ({ children, value, className, onValueChangeCallback }: {
    children: React.ReactNode
    value: string
    className?: string
    onValueChangeCallback?: (val: string) => void
  }) => (
    <button
      data-testid={`radio-item-${value}`}
      data-value={value}
      className={className}
      onClick={() => onValueChangeCallback?.(value)}
    >
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr data-testid="separator" />,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="menu-label">{children}</div>
  ),
}))

// Import the mocked function
import { getCategories } from '../actions'
const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>

describe('DropSelectMenu Component', () => {
  const mockOnChange = jest.fn()
  const defaultProps = {
    value: '',
    hasCreate: false,
    onChange: mockOnChange,
  }

  const mockCategories = [
    { category: 'general' },
    { category: 'booking' },
    { category: 'pricing' },
    { category: 'aftercare' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCategories.mockResolvedValue(mockCategories)
  })

  it('renders the dropdown menu structure', () => {
    render(<DropSelectMenu {...defaultProps} />)

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-trigger-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
  })

  it('displays default label when no value is selected', () => {
    render(<DropSelectMenu {...defaultProps} />)

    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toHaveTextContent('Vælg kategori')
  })

  it('displays selected category with capitalized first letter', () => {
    render(<DropSelectMenu {...defaultProps} value="general" />)

    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toHaveTextContent('General')
  })

  it('displays "create new" label when value is "create_new"', () => {
    render(<DropSelectMenu {...defaultProps} value="create_new" />)

    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toHaveTextContent('➕ Lav ny kategori')
  })

  it('fetches categories on mount', async () => {
    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(mockGetCategories).toHaveBeenCalledTimes(1)
    })
  })

  it('renders all fetched categories', async () => {
    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('radio-item-general')).toBeInTheDocument()
      expect(screen.getByTestId('radio-item-booking')).toBeInTheDocument()
      expect(screen.getByTestId('radio-item-pricing')).toBeInTheDocument()
      expect(screen.getByTestId('radio-item-aftercare')).toBeInTheDocument()
    })
  })

  it('capitalizes category names in menu items', async () => {
    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('radio-item-general')).toHaveTextContent('General')
      expect(screen.getByTestId('radio-item-booking')).toHaveTextContent('Booking')
    })
  })

  it('filters out empty or whitespace-only categories', async () => {
    mockGetCategories.mockResolvedValue([
      { category: 'valid' },
      { category: '' },
      { category: '   ' },
      { category: 'another' },
    ])

    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('radio-item-valid')).toBeInTheDocument()
      expect(screen.getByTestId('radio-item-another')).toBeInTheDocument()
      expect(screen.queryByTestId('radio-item-')).not.toBeInTheDocument()
      expect(screen.queryByTestId('radio-item-   ')).not.toBeInTheDocument()
    })
  })

  it('removes duplicate categories', async () => {
    mockGetCategories.mockResolvedValue([
      { category: 'general' },
      { category: 'booking' },
      { category: 'general' },
      { category: 'booking' },
    ])

    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      const generalItems = screen.getAllByTestId('radio-item-general')
      const bookingItems = screen.getAllByTestId('radio-item-booking')
      expect(generalItems).toHaveLength(1)
      expect(bookingItems).toHaveLength(1)
    })
  })

  it('calls onChange when a category is selected', async () => {
    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('radio-item-general')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('radio-item-general'))

    expect(mockOnChange).toHaveBeenCalledWith('general')
  })

  it('shows "create new" option when hasCreate is true', async () => {
    render(<DropSelectMenu {...defaultProps} hasCreate={true} />)

    await waitFor(() => {
      expect(screen.getByTestId('separator')).toBeInTheDocument()
      expect(screen.getByTestId('radio-item-create_new')).toBeInTheDocument()
    })
  })

  it('does not show "create new" option when hasCreate is false', async () => {
    render(<DropSelectMenu {...defaultProps} hasCreate={false} />)

    await waitFor(() => {
      expect(mockGetCategories).toHaveBeenCalled()
    })

    expect(screen.queryByTestId('separator')).not.toBeInTheDocument()
    expect(screen.queryByTestId('radio-item-create_new')).not.toBeInTheDocument()
  })

  it('applies correct styling to "create new" option', async () => {
    render(<DropSelectMenu {...defaultProps} hasCreate={true} />)

    await waitFor(() => {
      const createNewItem = screen.getByTestId('radio-item-create_new')
      expect(createNewItem).toBeInTheDocument()
      expect(createNewItem).toHaveClass('font-medium', 'text-blue-600')
    })
  })

  it('calls onChange with "create_new" when create new option is clicked', async () => {
    render(<DropSelectMenu {...defaultProps} hasCreate={true} />)

    await waitFor(() => {
      expect(screen.getByTestId('radio-item-create_new')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('radio-item-create_new'))

    expect(mockOnChange).toHaveBeenCalledWith('create_new')
  })

  it('renders Button with correct props', () => {
    render(<DropSelectMenu {...defaultProps} />)

    const button = screen.getByTestId('dropdown-trigger')
    expect(button).toHaveAttribute('data-variant', 'outline')
    expect(button).toHaveClass('w-full', 'justify-start', 'bg-transparent', 'text-left')
  })

  it('renders DropdownMenuContent with correct props', () => {
    render(<DropSelectMenu {...defaultProps} />)

    const content = screen.getByTestId('dropdown-content')
    expect(content).toHaveAttribute('data-align', 'start')
    expect(content).toHaveAttribute('data-side', 'bottom')
    expect(content).toHaveClass('w-[100%]', 'min-w-[button-width]')
  })

  it('passes current value to RadioGroup', async () => {
    render(<DropSelectMenu {...defaultProps} value="booking" />)

    await waitFor(() => {
      const radioGroup = screen.getByTestId('radio-group')
      expect(radioGroup).toHaveAttribute('data-value', 'booking')
    })
  })

  it('handles empty categories array', async () => {
    mockGetCategories.mockResolvedValue([])

    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(mockGetCategories).toHaveBeenCalled()
    })

    // Should not crash and should show no category items
    expect(screen.queryByTestId(/^radio-item-(?!create_new)/)).not.toBeInTheDocument()
  })

  it('attempts to fetch categories on mount', async () => {
    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(mockGetCategories).toHaveBeenCalled()
    })

    // Component should render the trigger
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
  })

  it('renders container with correct classes', () => {
    const { container } = render(<DropSelectMenu {...defaultProps} />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('w-full', 'mb-2')
  })

  it('updates display when value prop changes', () => {
    const { rerender } = render(<DropSelectMenu {...defaultProps} value="general" />)

    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('General')

    rerender(<DropSelectMenu {...defaultProps} value="booking" />)

    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Booking')
  })

  it('handles multiple rapid category selections', async () => {
    render(<DropSelectMenu {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('radio-item-general')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('radio-item-general'))
    fireEvent.click(screen.getByTestId('radio-item-booking'))
    fireEvent.click(screen.getByTestId('radio-item-pricing'))

    expect(mockOnChange).toHaveBeenCalledTimes(3)
    expect(mockOnChange).toHaveBeenNthCalledWith(1, 'general')
    expect(mockOnChange).toHaveBeenNthCalledWith(2, 'booking')
    expect(mockOnChange).toHaveBeenNthCalledWith(3, 'pricing')
  })
})

