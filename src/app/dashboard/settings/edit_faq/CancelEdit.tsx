'use client'

import { Button } from '@/components/ui/button'

/**
 * CancelEdit Component
 * 
 * A button component that cancels the current edit operation for an FAQ entry.
 * When clicked, it triggers the provided callback to exit edit mode without saving changes.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onCancelAction - Callback function executed when cancel is clicked
 */
export default function CancelEdit({ onCancelAction }: { onCancelAction: () => void }) {
    return (
        <Button onClick={onCancelAction} variant="secondary">
            Cancel
        </Button>
    )
}
