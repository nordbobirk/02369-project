'use client'

import { Button } from '@/components/ui/button'
import { createFAQ } from './actions'
import { DropSelectMenu } from "@/app/dashboard/settings/edit_faq/DropSelect"
import { useState } from 'react'

export default function AddFAQ({ maxIndex, onFAQAddedAction }: {
    maxIndex: number
    onFAQAddedAction: (faq: Awaited<ReturnType<typeof createFAQ>>) => void
}) {
    const [category, setCategory] = useState("")
    const [newCategory, setNewCategory] = useState("")

    return (
        <form
            action={async (formData: FormData) => {
                const selectedCategory = formData.get('category') as string
                const enteredNewCategory = formData.get('newCategory') as string
                const finalCategory =
                    selectedCategory === "create_new"
                        ? enteredNewCategory.trim()
                        : selectedCategory

                const question = formData.get('question') as string
                const answer = formData.get('answer') as string

                const newFAQ = await createFAQ(finalCategory, question, answer, maxIndex + 1)
                onFAQAddedAction(newFAQ)
            }}
            className="border p-4 rounded-lg bg-gray-50"
        >
            <h3 className="font-bold mb-2">Tilføj ny FAQ</h3>

            {/* Dropdown for existing categories */}
            <DropSelectMenu value={category} hasCreate={true} onChange={setCategory} />

            {/* Hidden input for selected category */}
            <input type="hidden" name="category" value={category} />

            {/* Show only when user selects "Create new" */}
            {category === "create_new" && (
                <input
                    name="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name..."
                    className="w-full mb-2 p-2 border rounded"
                    required
                />
            )}

            <input
                name="question"
                placeholder="Spørgsmål"
                className="w-full mb-2 p-2 border rounded"
                required
            />
            <textarea
                name="answer"
                placeholder="Svar"
                className="w-full mb-2 p-2 border rounded"
                required
            />
            <Button type="submit"
                className="bg-rose-300 hover:bg-rose-400 text-white font-semibold rounded-xl px-4 py-2 shadow-sm">
                Tilføj FAQ
            </Button>
        </form>
    )
}
