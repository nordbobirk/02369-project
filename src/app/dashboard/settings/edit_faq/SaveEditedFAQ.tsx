'use client'

import { Button } from '@/components/ui/button'
import { updateFAQ } from './actions'

/**
 * SaveEditedFAQ Component
 *
 * A form component that saves edited FAQ data to the database.
 * When submitted, it updates the FAQ entry and refreshes the page to show the changes.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.id - The unique identifier of the FAQ to update
 * @param {string} props.question - The updated question text
 * @param {string} props.answer - The updated answer text
 * @param {Function} props.onCancelAction - Callback function to execute after successful save (typically exits edit mode)
 * @param {Function} props.onSavedAction - Callback function to execute after successful save (typically updates the FAQ list)
 */
export default function SaveEditedFAQ({
    id,
    question,
    answer,
    onCancelAction,
    onSavedAction
}: {
    id: number
    question: string
    answer: string
    onCancelAction: () => void
    onSavedAction: (updated: { id: number, question: string, answer: string }) => void
}) {

    return (
        <form action={async () => {
            await updateFAQ(id, question, answer)
            onSavedAction({ id, question, answer })
            onCancelAction()
        }} className="inline mr-2">
            <Button
    type="submit"
    className="bg-rose-300 hover:bg-rose-400 text-white font-semibold rounded-xl px-4 py-2 shadow-sm"
  >
    Gem ændring
  </Button>
        </form>
    )
}

