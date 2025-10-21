'use client'

import { Button } from '@/components/ui/button'
import { createFAQ } from './actions'
import { useRouter } from 'next/navigation'


/**
 * AddFAQ Component
 * 
 * A form component that allows users to create new FAQ entries.
 * The new FAQ is added to the end of the list based on the maxIndex provided.
 * After successful creation, the page is refreshed to display the new entry.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.maxIndex - The highest index value in the current FAQ list, used to position the new FAQ
 */
export default function AddFAQ({ maxIndex, onFAQAddedAction }: {
    maxIndex: number
    onFAQAddedAction: (faq: Awaited<ReturnType<typeof createFAQ>>) => void
}) {
    const router = useRouter()

    return (
        <form action={async (formData: FormData) => {
            const question = formData.get('question') as string
            const answer = formData.get('answer') as string
            const newFAQ = await createFAQ(question, answer, maxIndex + 1)
            onFAQAddedAction(newFAQ)
            router.refresh()
        }} className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-bold mb-2">Add New FAQ</h3>
            <input
                name="question"
                placeholder="Question"
                className="w-full mb-2 p-2 border rounded"
                required
            />
            <textarea
                name="answer"
                placeholder="Answer"
                className="w-full mb-2 p-2 border rounded"
                required
            />
            <Button type="submit">
                Add FAQ
            </Button>
        </form>
    )
}
