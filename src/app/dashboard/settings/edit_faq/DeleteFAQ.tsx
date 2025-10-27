'use client'

import { Button } from '@/components/ui/button'
import { deleteFAQ } from './actions'

/**
 * DeleteFAQ Component
 * 
 * A form component that permanently deletes an FAQ entry from the database.
 * Displays a destructive-styled button to indicate the irreversible action.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.id - The unique identifier of the FAQ to delete
 */
export default function DeleteFAQ({ id, onDeletedAction }: { id: number, onDeletedAction: () => void }) {
    return (
        <form action={async () => {
            await deleteFAQ(id)
            onDeletedAction()
        }} className="inline">
            <Button type="submit" variant="destructive">
                Delete
            </Button>
        </form>
    )
}
